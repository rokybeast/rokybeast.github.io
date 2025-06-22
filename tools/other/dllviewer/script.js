class PEParser {
   constructor(buffer) {
      this.buffer = buffer;
      this.view = new DataView(buffer);
      this.is64Bit = false;
      this.exports = [];
   }

   parse() {
      try {
         // Check DOS header
         if (this.view.getUint16(0, true) !== 0x5A4D) { // 'MZ'
            throw new Error('Invalid DOS header');
         }

         // Get PE header offset
         const peOffset = this.view.getUint32(0x3C, true);

         // Check PE signature
         if (this.view.getUint32(peOffset, true) !== 0x00004550) { // 'PE\0\0'
            throw new Error('Invalid PE signature');
         }

         // Read COFF header
         const machine = this.view.getUint16(peOffset + 4, true);
         const numberOfSections = this.view.getUint16(peOffset + 6, true);
         const sizeOfOptionalHeader = this.view.getUint16(peOffset + 20, true);

         // Determine architecture
         this.is64Bit = machine === 0x8664; // IMAGE_FILE_MACHINE_AMD64

         // Parse optional header
         const optionalHeaderOffset = peOffset + 24;
         const magic = this.view.getUint16(optionalHeaderOffset, true);

         if (magic !== 0x10b && magic !== 0x20b) {
            throw new Error('Invalid optional header magic');
         }

         // Get data directories offset
         const dataDirectoriesOffset = this.is64Bit ?
            optionalHeaderOffset + 112 : // PE32+
            optionalHeaderOffset + 96; // PE32

         // Export table is the first data directory
         const exportTableRVA = this.view.getUint32(dataDirectoriesOffset, true);
         const exportTableSize = this.view.getUint32(dataDirectoriesOffset + 4, true);

         if (exportTableRVA === 0 || exportTableSize === 0) {
            return {
               exports: []
            }; // No exports
         }

         // Parse section headers to find export table
         const sectionHeaderOffset = optionalHeaderOffset + sizeOfOptionalHeader;
         let exportTableFileOffset = 0;

         for (let i = 0; i < numberOfSections; i++) {
            const sectionOffset = sectionHeaderOffset + (i * 40);
            const virtualAddress = this.view.getUint32(sectionOffset + 12, true);
            const sizeOfRawData = this.view.getUint32(sectionOffset + 16, true);
            const pointerToRawData = this.view.getUint32(sectionOffset + 20, true);

            if (exportTableRVA >= virtualAddress &&
               exportTableRVA < virtualAddress + sizeOfRawData) {
               exportTableFileOffset = pointerToRawData + (exportTableRVA - virtualAddress);
               break;
            }
         }

         if (exportTableFileOffset === 0) {
            throw new Error('Could not locate export table in file');
         }

         // Parse export directory
         const numberOfFunctions = this.view.getUint32(exportTableFileOffset + 20, true);
         const numberOfNames = this.view.getUint32(exportTableFileOffset + 24, true);
         const addressOfFunctions = this.view.getUint32(exportTableFileOffset + 28, true);
         const addressOfNames = this.view.getUint32(exportTableFileOffset + 32, true);
         const addressOfNameOrdinals = this.view.getUint32(exportTableFileOffset + 36, true);

         // Convert RVAs to file offsets
         const functionsOffset = this.rvaToFileOffset(addressOfFunctions, sectionHeaderOffset, numberOfSections);
         const namesOffset = this.rvaToFileOffset(addressOfNames, sectionHeaderOffset, numberOfSections);
         const ordinalsOffset = this.rvaToFileOffset(addressOfNameOrdinals, sectionHeaderOffset, numberOfSections);

         // Read exports
         const exports = [];

         for (let i = 0; i < numberOfNames; i++) {
            const nameRVA = this.view.getUint32(namesOffset + i * 4, true);
            const nameOffset = this.rvaToFileOffset(nameRVA, sectionHeaderOffset, numberOfSections);
            const ordinal = this.view.getUint16(ordinalsOffset + i * 2, true);
            const functionRVA = this.view.getUint32(functionsOffset + ordinal * 4, true);

            // Read function name
            let name = '';
            let namePos = nameOffset;
            while (namePos < this.buffer.byteLength) {
               const char = this.view.getUint8(namePos);
               if (char === 0) break;
               name += String.fromCharCode(char);
               namePos++;
            }

            exports.push({
               Ordinal: ordinal + 1, // Ordinals are typically base + index
               Name: name,
               RVA: functionRVA,
               Hint: i
            });
         }

         return {
            exports
         };

      } catch (error) {
         throw new Error(`PE parsing failed: ${error.message}`);
      }
   }

   rvaToFileOffset(rva, sectionHeaderOffset, numberOfSections) {
      for (let i = 0; i < numberOfSections; i++) {
         const sectionOffset = sectionHeaderOffset + (i * 40);
         const virtualAddress = this.view.getUint32(sectionOffset + 12, true);
         const sizeOfRawData = this.view.getUint32(sectionOffset + 16, true);
         const pointerToRawData = this.view.getUint32(sectionOffset + 20, true);

         if (rva >= virtualAddress && rva < virtualAddress + sizeOfRawData) {
            return pointerToRawData + (rva - virtualAddress);
         }
      }
      return 0;
   }
}

function showStatus(message, isError = false) {
   const statusDiv = document.getElementById('statusMessage');
   statusDiv.innerHTML = `
        <div class="alert ${isError ? 'alert-danger' : 'alert-success'} alert-dismissible fade show">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
}

document.getElementById('dllInput').addEventListener('change', async function (e) {
   const file = e.target.files[0];
   if (!file) return;
   await parseFile(file);
});

document.getElementById('dropZone').addEventListener('dragover', function (e) {
   e.preventDefault();
   e.stopPropagation();
   this.classList.add('hover');
});

document.getElementById('dropZone').addEventListener('dragleave', function (e) {
   e.preventDefault();
   e.stopPropagation();
   this.classList.remove('hover');
});

document.getElementById('dropZone').addEventListener('drop', async function (e) {
   e.preventDefault();
   e.stopPropagation();
   this.classList.remove('hover');

   const file = e.dataTransfer.files[0];
   if (file) {
      await parseFile(file);
   }
});

async function parseFile(file) {
   try {
      showStatus('Parsing PE file...', false);

      const buffer = await file.arrayBuffer();
      const parser = new PEParser(buffer);
      const result = parser.parse();

      const infoBox = document.getElementById('fileInfo');
      const exportsTable = document.getElementById('exportsTable');

      // Show file info
      const arch = parser.is64Bit ? 'x64 (64-bit)' : 'x86 (32-bit)';
      const fileSize = (file.size / 1024).toFixed(2);

      infoBox.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">📄 ${file.name}</h5>
              <p class="card-text">
                <strong>Architecture:</strong> ${arch}<br>
                <strong>File Size:</strong> ${fileSize} KB<br>
                <strong>Exported Functions:</strong> ${result.exports.length}
              </p>
            </div>
          </div>
        `;

      // Clear table
      exportsTable.innerHTML = '';

      if (result.exports.length === 0) {
         exportsTable.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No exported functions found in this file</td></tr>';
         showStatus('File parsed successfully, but no exports were found.', false);
         return;
      }

      // Sort exports by ordinal
      result.exports.sort((a, b) => a.Ordinal - b.Ordinal);

      // Populate table
      for (const exp of result.exports) {
         const row = document.createElement('tr');
         row.innerHTML = `
            <td><span class="badge bg-primary">${exp.Ordinal}</span></td>
            <td><code>${exp.Name || '<em>unnamed</em>'}</code></td>
            <td><span class="hex-value">0x${exp.RVA.toString(16).toUpperCase().padStart(8, '0')}</span></td>
            <td>${exp.Hint}</td>
          `;
         exportsTable.appendChild(row);
      }

      showStatus(`Successfully parsed ${result.exports.length} exported functions!`, false);

   } catch (error) {
      console.error('Error parsing PE file:', error);
      showStatus(`Error: ${error.message}`, true);

      document.getElementById('fileInfo').innerHTML = '';
      document.getElementById('exportsTable').innerHTML =
         '<tr><td colspan="4" class="text-center text-danger">Failed to parse file</td></tr>';
   }
}