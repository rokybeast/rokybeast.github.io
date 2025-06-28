const themeToggle = document.getElementById('themeToggle');
const body = document.body;
let darkModeState = false;

const setTheme = (isDark) => {
   body.classList.toggle('dark', isDark);
   if (themeToggle) {
      themeToggle.classList.toggle('bx-sun', isDark);
      themeToggle.classList.toggle('bx-moon', !isDark);
   }

   try {
      localStorage.setItem('darkMode', isDark);
   } catch (e) {
      darkModeState = isDark;
   }

   return isDark;
};

const initializeTheme = () => {
   let savedTheme = null;

   try {
      savedTheme = localStorage.getItem('darkMode');
   } catch (e) {
      savedTheme = darkModeState ? 'true' : 'false';
   }

   const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

   if (savedTheme !== null) {
      setTheme(savedTheme === 'true');
   } else {
      setTheme(prefersDark);
   }
};

if (themeToggle) {
   themeToggle.addEventListener('click', () => {
      setTheme(!body.classList.contains('dark'));
   });
}

initializeTheme();