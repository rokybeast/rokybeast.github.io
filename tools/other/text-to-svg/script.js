class TextToSVGGenerator {
   constructor() {
      this.canvas = document.getElementById('textCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.loadedFonts = new Set();
      this.currentCustomFont = null;

      this.initializeElements();
      this.setupEventListeners();
      this.setupFontSuggestions();
      this.renderText();

      window.addEventListener('resize', () => this.adjustCanvasSize());
      this.adjustCanvasSize();
   }

   adjustCanvasSize() {
      const container = this.canvas.parentElement;
      const containerWidth = container.clientWidth - 40;

      this.canvas.width = Math.min(800, containerWidth);
      this.canvas.height = 300 * (this.canvas.width / 800);

      this.renderText();
   }

   initializeElements() {
      this.textInput = document.getElementById('textInput');
      this.fontSize = document.getElementById('fontSize');
      this.fontSizeValue = document.getElementById('fontSizeValue');
      this.fontFamily = document.getElementById('fontFamily');
      this.googleFont = document.getElementById('googleFont');
      this.fontStyle = document.getElementById('fontStyle');
      this.fillType = document.getElementById('fillType');
      this.color1 = document.getElementById('color1');
      this.color2 = document.getElementById('color2');
      this.enableShadow = document.getElementById('enableShadow');
      this.enableStroke = document.getElementById('enableStroke');
      this.enableGlow = document.getElementById('enableGlow');
      this.fontFile = document.getElementById('fontFile');
      this.uploadStatus = document.getElementById('uploadStatus');
   }

   setupEventListeners() {
      this.textInput.addEventListener('input', () => this.renderText());
      this.fontSize.addEventListener('input', () => {
         this.fontSizeValue.textContent = this.fontSize.value;
         this.renderText();
      });
      this.fontFamily.addEventListener('input', () => this.renderText());
      this.fontStyle.addEventListener('change', () => this.renderText());
      this.fillType.addEventListener('change', () => this.renderText());
      this.color1.addEventListener('input', () => this.renderText());
      this.color2.addEventListener('input', () => this.renderText());
      this.enableShadow.addEventListener('change', () => this.renderText());
      this.enableStroke.addEventListener('change', () => this.renderText());
      this.enableGlow.addEventListener('change', () => this.renderText());
      document.getElementById('loadGoogleFont').addEventListener('click', () => this.loadGoogleFont());
      this.fontFile.addEventListener('change', (e) => this.handleFontUpload(e));
      document.getElementById('downloadPNG').addEventListener('click', () => this.downloadPNG());
      document.getElementById('downloadSVG').addEventListener('click', () => this.downloadSVG());
   }

   setupFontSuggestions() {
      const commonFonts = [
         'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
         'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Courier New'
      ];

      const suggestionsContainer = document.getElementById('fontSuggestions');
      commonFonts.forEach(font => {
         const suggestion = document.createElement('span');
         suggestion.className = 'font-suggestion';
         suggestion.textContent = font;
         suggestion.style.fontFamily = font;
         suggestion.onclick = () => {
            this.fontFamily.value = font;
            this.renderText();
         };
         suggestionsContainer.appendChild(suggestion);
      });
   }

   async loadGoogleFont() {
      const fontName = this.googleFont.value.trim();
      if (!fontName) return;

      if (this.loadedFonts.has(fontName)) {
         this.fontFamily.value = fontName;
         this.renderText();
         return;
      }

      try {
         const link = document.createElement('link');
         link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;700;900&display=swap`;
         link.rel = 'stylesheet';
         document.head.appendChild(link);

         await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 2000);
         });

         this.loadedFonts.add(fontName);
         this.fontFamily.value = fontName;
         this.renderText();
      } catch (error) {
         console.error('Failed to load Google Font:', error);
      }
   }

   handleFontUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
         const fontData = e.target.result;
         const fontName = `custom-font-${Date.now()}`;

         const style = document.createElement('style');
         style.textContent = `
                        @font-face {
                            font-family: "${fontName}";
                            src: url("${fontData}");
                        }
                    `;
         document.head.appendChild(style);

         this.currentCustomFont = fontName;
         this.fontFamily.value = fontName;
         this.uploadStatus.innerHTML = `<div class="text-success"><i class='bx bx-check'></i> Font uploaded: ${file.name}</div>`;

         setTimeout(() => this.renderText(), 100);
      };
      reader.readAsDataURL(file);
   }

   createGradient() {
      const fillType = this.fillType.value;
      const color1 = this.color1.value;
      const color2 = this.color2.value;

      if (fillType === 'linear') {
         const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
         gradient.addColorStop(0, color1);
         gradient.addColorStop(1, color2);
         return gradient;
      } else if (fillType === 'radial') {
         const centerX = this.canvas.width / 2;
         const centerY = this.canvas.height / 2;
         const radius = Math.min(this.canvas.width, this.canvas.height) / 2;
         const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
         gradient.addColorStop(0, color1);
         gradient.addColorStop(1, color2);
         return gradient;
      }

      return color1;
   }

   renderText() {
      const text = this.textInput.value || 'Enter Anything!';
      const fontSize = this.fontSize.value;
      const fontFamily = this.fontFamily.value || 'Arial';
      const fontStyle = this.fontStyle.value;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let fontString = `${fontSize}px ${fontFamily}`;
      if (fontStyle.includes('bold')) fontString = `bold ${fontString}`;
      if (fontStyle.includes('italic')) fontString = `italic ${fontString}`;

      this.ctx.font = fontString;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      if (this.enableShadow.checked) {
         this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
         this.ctx.shadowBlur = 8;
         this.ctx.shadowOffsetX = 4;
         this.ctx.shadowOffsetY = 4;
      } else {
         this.ctx.shadowColor = 'transparent';
         this.ctx.shadowBlur = 0;
         this.ctx.shadowOffsetX = 0;
         this.ctx.shadowOffsetY = 0;
      }

      if (this.enableGlow.checked) {
         this.ctx.shadowColor = this.color1.value;
         this.ctx.shadowBlur = 15;
         this.ctx.shadowOffsetX = 0;
         this.ctx.shadowOffsetY = 0;
      }

      this.ctx.fillStyle = this.createGradient();

      this.ctx.fillText(text, centerX, centerY);

      if (this.enableStroke.checked) {
         this.ctx.strokeStyle = '#000000';
         this.ctx.lineWidth = 2;
         this.ctx.strokeText(text, centerX, centerY);
      }
   }

   downloadPNG() {
      const link = document.createElement('a');
      link.download = 'text-design.png';
      link.href = this.canvas.toDataURL();
      link.click();
   }

   downloadSVG() {
      const text = this.textInput.value || 'Hello World!';
      const fontSize = this.fontSize.value;
      const fontFamily = this.fontFamily.value || 'Arial';
      const fontStyle = this.fontStyle.value;
      const fillColor = this.createGradientSVG();

      let fontWeight = 'normal';
      let fontStyleAttr = 'normal';

      if (fontStyle.includes('bold')) fontWeight = 'bold';
      if (fontStyle.includes('italic')) fontStyleAttr = 'italic';

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this.canvas.width}" height="${this.canvas.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        ${this.getSVGGradientDefs()}
    </defs>
    <text 
        x="${this.canvas.width/2}" 
        y="${this.canvas.height/2}" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        font-weight="${fontWeight}"
        font-style="${fontStyleAttr}"
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="${fillColor}"
        ${this.enableStroke.checked ? `stroke="#000000" stroke-width="2"` : ''}
        ${this.enableShadow.checked ? `filter="url(#shadow)"` : ''}
    >${text}</text>
    ${this.enableShadow.checked ? `
    <defs>
        <filter id="shadow">
            <feDropShadow dx="4" dy="4" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
    </defs>` : ''}
</svg>`;

      const blob = new Blob([svgContent], {
         type: 'image/svg+xml'
      });
      const link = document.createElement('a');
      link.download = 'text-design.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
   }

   createGradientSVG() {
      const fillType = this.fillType.value;

      if (fillType === 'linear') {
         return 'url(#linearGradient)';
      } else if (fillType === 'radial') {
         return 'url(#radialGradient)';
      }

      return this.color1.value;
   }

   getSVGGradientDefs() {
      const color1 = this.color1.value;
      const color2 = this.color2.value;
      const fillType = this.fillType.value;

      if (fillType === 'linear') {
         return `
                        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                        </linearGradient>
                    `;
      } else if (fillType === 'radial') {
         return `
                        <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                        </radialGradient>
                    `;
      }

      return '';
   }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
   new TextToSVGGenerator();
});