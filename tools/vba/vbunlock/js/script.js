const VBA_PATHS = [
   'xl/vbaProject.bin',
   'word/vbaProject.bin',
   'ppt/vbaProject.bin',
   'visio/vbaProject.bin',
   'vbaProject.bin'
];

function log(message) {
   document.getElementById('log').textContent += message + '\n';
}

async function unlockVBA() {
   const fileInput = document.getElementById('fileInput');
   const file = fileInput.files[0];
   if (!file) {
      alert('Please select a file first.');
      return;
   }

   const zip = new JSZip();
   const content = await file.arrayBuffer();

   try {
      const archive = await zip.loadAsync(content);
      let modified = false;

      for (const path of VBA_PATHS) {
         const fileObj = archive.file(path);
         if (fileObj) {
            const vbaBuffer = await fileObj.async('uint8array');
            let found = false;
            for (let i = 0; i < vbaBuffer.length - 3; i++) {
               if (
                  vbaBuffer[i] === 0x44 && // D
                  vbaBuffer[i + 1] === 0x50 && // P
                  vbaBuffer[i + 2] === 0x42 && // B
                  vbaBuffer[i + 3] === 0x3D // =
               ) {
                  vbaBuffer[i + 2] = 0x78; // Replace B with x => DPx=
                  found = true;
                  log(`[+] Patched DPB= → DPx= at offset ${i} in: ${path}`);
               }
            }
            if (found) {
               archive.file(path, vbaBuffer);
               modified = true;
            } else {
               log(`[=] Found VBA, but no protection (already unlocked): ${path}`);
            }
         }
      }

      if (!modified) {
         log('[-] No locked VBA modules were found.');
         return;
      }

      const newBlob = await archive.generateAsync({
         type: 'blob'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(newBlob);
      a.download = 'unlocked_' + file.name;
      a.click();

      log('[✓] Done! File downloaded.');
   } catch (err) {
      console.error(err);
      log('Error: ' + err.message);
   }
}