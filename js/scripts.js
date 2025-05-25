function toggleDarkMode() {
   const body = document.body;
   const button = document.getElementById("toggleButton");
   body.classList.toggle('dark-mode');

   // Change button text based on the current mode
   if (body.classList.contains('dark-mode')) {
      button.textContent = "Toggle Light Mode";
   } else {
      button.textContent = "Toggle Dark Mode";
   }
}

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let circles = [];

function resizeCanvas() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 50; i++) {
   circles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      dx: Math.random() * 0.5 - 0.25,
      dy: Math.random() * 0.5 - 0.25
   });
}

function drawCircles() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
   for (let c of circles) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      c.x += c.dx;
      c.y += c.dy;
      if (c.x < 0 || c.x > canvas.width) c.dx *= -1;
      if (c.y < 0 || c.y > canvas.height) c.dy *= -1;
   }
   requestAnimationFrame(drawCircles);
}
drawCircles();

const hakiCanvas = document.getElementById("hakiCanvas");
const hakiCtx = hakiCanvas.getContext("2d");

function resizeHaki() {
   hakiCanvas.width = window.innerWidth;
   hakiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeHaki);
resizeHaki();

function drawHaki() {
   hakiCtx.clearRect(0, 0, hakiCanvas.width, hakiCanvas.height);
   for (let i = 0; i < 3; i++) {
      let x = Math.random() * hakiCanvas.width;
      let y = 0;
      let length = hakiCanvas.height * 0.6 + Math.random() * 100;

      hakiCtx.beginPath();
      hakiCtx.moveTo(x, y);
      for (let j = 0; j < 10; j++) {
         x += Math.random() * 40 - 20;
         y += length / 10;
         hakiCtx.lineTo(x, y);
      }
      hakiCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--haki-stroke');
      hakiCtx.lineWidth = 2;
      hakiCtx.shadowColor = getComputedStyle(document.body).getPropertyValue('--haki-glow');
      hakiCtx.shadowBlur = 8;
      hakiCtx.stroke();
   }
   setTimeout(drawHaki, 800);
}
drawHaki();