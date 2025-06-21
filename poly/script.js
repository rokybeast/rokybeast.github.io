// --- Custom Language Definition for PrismJS ---
Prism.languages.poly = {
   'comment': {
      pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
      greedy: true
   },
   'string': {
      pattern: /(["'])(?:\\.|(?!\1)[^\\])*\1/,
      greedy: true
   },
   'keyword': /\b(?:import|from|as|new|float|int|string|bool|if|else|function|write|return|!isConstant)\b/,
   'function': /\b\w+(?=\()/,
   'operator': /[=<>!+-/*]+/,
   'number': /\b\d+(?:\.\d+)?\b/,
   'punctuation': /[.,;{}()]/
};

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const setTheme = (isDark) => {
   body.classList.toggle('dark', isDark);
   themeToggle.classList.toggle('bx-sun', isDark);
   themeToggle.classList.toggle('bx-moon', !isDark);
   localStorage.setItem('darkMode', isDark);
};

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('darkMode');

if (savedTheme !== null) {
   setTheme(savedTheme === 'true');
} else {
   setTheme(prefersDark);
}

themeToggle.addEventListener('click', () => {
   setTheme(!body.classList.contains('dark'));
});

Prism.highlightAll();