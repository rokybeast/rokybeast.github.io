document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Switcher ---
  const themeToggleButton = document.getElementById("theme-toggle-icon");
  const body = document.body;

  const toolData = [
    {
      name: "HTML",
      srcLight: "https://cdn.simpleicons.org/html5",
      srcDark: "https://cdn.simpleicons.org/html5",
    },
    {
      name: "CSS",
      srcLight: "https://cdn.simpleicons.org/css",
      srcDark: "https://cdn.simpleicons.org/css",
    },
    {
      name: "SCSS",
      srcLight: "https://cdn.simpleicons.org/sass",
      srcDark: "https://cdn.simpleicons.org/sass",
    },
    {
      name: "JavaScript",
      srcLight: "https://cdn.simpleicons.org/javascript",
      srcDark: "https://cdn.simpleicons.org/javascript",
    },
    {
      name: "VBA",
      srcLight: "https://api.iconify.design/simple-icons/visualbasic.svg?color=%232B579A",
      srcDark: "https://api.iconify.design/simple-icons/visualbasic.svg?color=%232B579A"
    },
    {
      name: "PowerPoint",
      srcLight: "https://api.iconify.design/mdi/microsoft-powerpoint.svg?color=%23D24726",
      srcDark: "https://api.iconify.design/mdi/microsoft-powerpoint.svg?color=%23D24726",
    },
    {
      name: "Poly",
      srcLight: "../poly/assets/poly_svg_mod.svg",
      srcDark: "../poly/assets/poly_svg_mod.svg",
    },
    {
      name: "React",
      srcLight: "https://cdn.simpleicons.org/react",
      srcDark: "https://cdn.simpleicons.org/react",
    },
    {
      name: "Svelte",
      srcLight: "https://cdn.simpleicons.org/svelte",
      srcDark: "https://cdn.simpleicons.org/svelte",
    },
    {
      name: "TypeScript",
      srcLight: "https://cdn.simpleicons.org/typescript",
      srcDark: "https://cdn.simpleicons.org/typescript",
    },
    {
      name: "Selenium",
      srcLight: "https://cdn.simpleicons.org/selenium",
      srcDark: "https://cdn.simpleicons.org/selenium",
    },
    {
      name: "Next.js",
      srcLight: "https://cdn.simpleicons.org/nextdotjs/000",
      srcDark: "https://cdn.simpleicons.org/nextdotjs/fff",
    },
    {
      name: "Bootstrap",
      srcLight: "https://cdn.simpleicons.org/bootstrap",
      srcDark: "https://cdn.simpleicons.org/bootstrap",
    },
    {
      name: "Tailwind CSS",
      srcLight: "https://cdn.simpleicons.org/tailwindcss",
      srcDark: "https://cdn.simpleicons.org/tailwindcss",
    },
    {
      name: "MongoDB",
      srcLight: "https://cdn.simpleicons.org/mongodb",
      srcDark: "https://cdn.simpleicons.org/mongodb",
    },
    {
      name: "PHP",
      srcLight: "https://cdn.simpleicons.org/php",
      srcDark: "https://cdn.simpleicons.org/php",
    },
    {
      name: "Rust",
      srcLight: "https://cdn.simpleicons.org/rust/F74C00",
      srcDark: "https://cdn.simpleicons.org/rust/F74C00",
    },
    {
      name: "C++",
      srcLight: "https://cdn.simpleicons.org/cplusplus",
      srcDark: "https://cdn.simpleicons.org/cplusplus",
    },
    {
      name: "Bash",
      srcLight: "https://cdn.simpleicons.org/gnubash",
      srcDark: "https://cdn.simpleicons.org/gnubash",
    },
    {
      name: "Markdown",
      srcLight: "https://cdn.simpleicons.org/markdown/083fa1",
      srcDark: "https://cdn.simpleicons.org/markdown/083fa1",
    },
  ];

  function createToolLogos(theme) {
    const marquee = document.querySelector(".marquee");
    if (!marquee) return;

    marquee.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (let j = 0; j < 2; j++) {
      toolData.forEach((tool) => {
        const container = document.createElement("div");
        container.classList.add("tool-logo-container");

        const img = document.createElement("img");
        img.src = theme === "dark" ? tool.srcDark : tool.srcLight;
        img.alt = tool.name;
        img.classList.add("tool-logo");

        const tooltip = document.createElement("span");
        tooltip.classList.add("tool-tooltip");
        tooltip.textContent = tool.name;

        container.appendChild(img);
        container.appendChild(tooltip);
        fragment.appendChild(container);
      });
    }
    marquee.appendChild(fragment);
  }

  function updateFavicon(theme) {
    const head = document.querySelector("head");
    if (!head) return;

    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(link => head.removeChild(link));

    const newFavicon = document.createElement("link");
    newFavicon.rel = "icon";
    newFavicon.type = "image/png";

    newFavicon.href = theme === "dark"
      ? "../../assets/favicon/favicon_dark.png"
      : "../../assets/favicon/favicon_light.png";
    head.appendChild(newFavicon);
  }


  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      themeToggleButton.classList.remove("bx-sun");
      themeToggleButton.classList.add("bx-moon");
    } else {
      themeToggleButton.classList.remove("bx-moon");
      themeToggleButton.classList.add("bx-sun");
    }

    createToolLogos(theme);
    updateFavicon(theme);
  }

  themeToggleButton.addEventListener("click", () => {
    let newTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // --- Smooth Scrolling & Active Nav Link ---
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");

  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // --- Slideshow Logic ---
  let slideIndex = 1;
  const projectDescriptions = [
    "RippleKit, a CSS Framework with custom elements.",
    "Poly, A programming language, with new elements, to change the world ahh type stuff.",
    "Project: Mountain, a PPTOS, focusing on WinAPI (Archived until October).",
  ];
  showSlides(slideIndex);

  window.plusSlides = function (n) {
    showSlides((slideIndex += n));
  };
  window.currentSlide = function (n) {
    showSlides((slideIndex = n));
  };

  function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";

    const desc = document.getElementById("project-desc");
    if (desc) desc.textContent = projectDescriptions[slideIndex - 1];
  }

  // --- "To Top" Button ---
  const toTopBtn = document.getElementById("to-top-btn");
  if (toTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        toTopBtn.classList.add("show");
      } else {
        toTopBtn.classList.remove("show");
      }
    });

    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

// --- Spotify Now Playing Widget ---
let progressInterval;
let fetchInterval;
let currentProgress = 0;
let durationMs = 0;
let lastTrackId = null;
let isPlaying = false;
let isLoading = false;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Show loading state
function showLoadingState() {
  if (isLoading) return; // Prevent multiple loading states
  isLoading = true;
  
  const widget = document.querySelector('.spotify-now-playing');
  const albumArt = document.getElementById('spotify-album-art');
  const trackName = document.getElementById('spotify-track-name');
  const artistName = document.getElementById('spotify-artist-name');
  const progressBar = document.getElementById('spotify-progress-bar');
  const timeDisplay = document.getElementById('spotify-time-display');
  
  // Add loading class to widget
  widget.classList.add('spotify-loading');
  
  // Show skeleton for album art
  albumArt.innerHTML = '<div class="spotify-spinner"></div>';
  albumArt.className = 'spotify-album-art spotify-album-loading';
  albumArt.style.backgroundImage = 'none';
  
  // Show skeleton text
  trackName.innerHTML = '<div class="spotify-skeleton spotify-track-name-skeleton"></div>';
  artistName.innerHTML = '<div class="spotify-skeleton spotify-artist-name-skeleton"></div>';
  
  // Show skeleton progress
  progressBar.className = 'spotify-skeleton';
  progressBar.style.width = '100%';
  
  // Show skeleton time
  timeDisplay.innerHTML = '<div class="spotify-skeleton spotify-time-skeleton"></div>';
}

// Hide loading state
function hideLoadingState() {
  if (!isLoading) return;
  isLoading = false;
  
  const widget = document.querySelector('.spotify-now-playing');
  const albumArt = document.getElementById('spotify-album-art');
  const progressBar = document.getElementById('spotify-progress-bar');
  
  // Remove loading classes
  widget.classList.remove('spotify-loading');
  albumArt.classList.remove('spotify-album-loading');
  albumArt.innerHTML = '';
  progressBar.classList.remove('spotify-skeleton');
  
  // Add fade-in animation
  widget.classList.add('spotify-fade-in');
  setTimeout(() => widget.classList.remove('spotify-fade-in'), 500);
}

// Function to extract dominant color from album art
function extractAlbumColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(this, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const colorMap = {};
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        if (brightness < 50 || brightness > 200) continue;
        
        const color = `${Math.round(r/10)*10},${Math.round(g/10)*10},${Math.round(b/10)*10}`;
        colorMap[color] = (colorMap[color] || 0) + 1;
      }
      
      let dominantColor = 'limegreen';
      let maxCount = 0;
      for (const color in colorMap) {
        if (colorMap[color] > maxCount) {
          maxCount = colorMap[color];
          dominantColor = `rgb(${color})`;
        }
      }
      
      resolve(dominantColor);
    };
    
    img.onerror = () => resolve('limegreen');
    img.src = imageUrl;
  });
}

// Apply dynamic theme colors
function applyDynamicTheme(dominantColor) {
  const widget = document.querySelector('.spotify-now-playing');
  const progressBar = document.getElementById('spotify-progress-bar');
  
  const rgbMatch = dominantColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    
    const accentColor = dominantColor;
    const accentLight = `rgba(${r}, ${g}, ${b}, 0.2)`;
    const accentGlow = `rgba(${r}, ${g}, ${b}, 0.4)`;
    
    // Set CSS custom property for hover effects
    widget.style.setProperty('--accent-color', accentColor);
    widget.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    
    progressBar.style.backgroundColor = accentColor;
    progressBar.style.boxShadow = `0 0 10px ${accentGlow}`;
    
    widget.style.background = `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.1) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%)`;
    widget.style.border = `1px solid ${accentLight}`;
  }
}

async function fetchSpotifyNowPlaying() {
  try {
    // Show loading only on first load or after error
    if (lastTrackId === null) {
      showLoadingState();
    }
    
    const response = await fetch("https://spotify-npp.onrender.com/nowplaying");
    if (!response.ok) throw new Error("Spotify not reachable");

    const data = await response.json();
    if (!data.item) throw new Error("Nothing is playing");

    const track = data.item;
    const trackId = track.id;
    const newProgress = data.progress_ms;
    const newDuration = track.duration_ms;
    const playing = data.is_playing;

    const timeJump = Math.abs(newProgress - currentProgress) > 3000;
    const trackChanged = trackId !== lastTrackId;

    if (trackChanged || timeJump || (playing !== isPlaying)) {
      const trackName = track.name;
      const artistName = track.artists.map(a => a.name).join(", ");
      const albumArt = track.album.images[0].url;

      // Hide loading state before updating content
      hideLoadingState();

      document.getElementById("spotify-track-name").textContent = trackName;
      document.getElementById("spotify-artist-name").textContent = artistName;
      
      const albumArtElement = document.getElementById("spotify-album-art");
      albumArtElement.style.backgroundImage = `url(${albumArt})`;
      albumArtElement.className = 'spotify-album-art'; // Reset to normal class
      
      // Extract and apply album colors (only on track change)
      if (trackChanged) {
        try {
          const dominantColor = await extractAlbumColor(albumArt);
          applyDynamicTheme(dominantColor);
        } catch (e) {
          console.log('Color extraction failed, using default');
        }
      }

      lastTrackId = trackId;
    }

    // Always update progress and duration
    currentProgress = newProgress;
    durationMs = newDuration;
    isPlaying = playing;

    const percent = (currentProgress / durationMs) * 100;
    document.getElementById("spotify-progress-bar").style.width = `${percent}%`;
    document.getElementById("spotify-time-display").textContent =
      `${formatTime(currentProgress)} / ${formatTime(durationMs)}`;

    clearInterval(progressInterval);

    if (isPlaying) {
      progressInterval = setInterval(() => {
        currentProgress += 1000;

        if (currentProgress >= durationMs) {
          clearInterval(progressInterval);
          return;
        }

        const updatedPercent = (currentProgress / durationMs) * 100;
        document.getElementById("spotify-progress-bar").style.width = `${updatedPercent}%`;
        document.getElementById("spotify-time-display").textContent =
          `${formatTime(currentProgress)} / ${formatTime(durationMs)}`;
      }, 1000);
    }

  } catch (err) {
    hideLoadingState();
    
    const widget = document.querySelector('.spotify-now-playing');
    widget.classList.add('spotify-error');
    
    document.getElementById("spotify-track-name").textContent = "Nothing Playing";
    document.getElementById("spotify-artist-name").textContent = "Spotify idle...";
    document.getElementById("spotify-album-art").style.backgroundImage = "none";
    document.getElementById("spotify-album-art").className = 'spotify-album-art';
    document.getElementById("spotify-progress-bar").style.width = "0%";
    document.getElementById("spotify-time-display").textContent = "0:00 / 0:00";
    
    // Reset to default theme
    const progressBar = document.getElementById('spotify-progress-bar');
    widget.style.background = '';
    widget.style.border = '';
    progressBar.style.backgroundColor = 'var(--accent-color, limegreen)';
    progressBar.style.boxShadow = '';
    
    clearInterval(progressInterval);
    lastTrackId = null;
    isPlaying = false;
    
    // Remove error class after animation
    setTimeout(() => widget.classList.remove('spotify-error'), 300);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('.spotify-now-playing');
  if (widget) {
    widget.addEventListener('click', () => {
      if (lastTrackId && lastTrackId !== null) {
        window.open(`https://open.spotify.com/track/${lastTrackId}`, '_blank');
      }
    });
  }
});

// Initial fetch
fetchSpotifyNowPlaying();

// Fetch every 10 seconds for real-time updates
clearInterval(fetchInterval);
fetchInterval = setInterval(fetchSpotifyNowPlaying, 2500);
});

(function () {
   const alertBar = document.getElementById('alertBar');
   const closeBtn = document.getElementById('alertBarClose');
   const body = document.body;

   if (!alertBar || !closeBtn) return;

   function setAlertBarHeight() {
      const height = alertBar.offsetHeight;
      body.style.setProperty('--alert-bar-height', height + 'px');
   }

   setAlertBarHeight();

   let resizeTimeout;
   window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setAlertBarHeight, 100);
   });

   closeBtn.addEventListener('click', function () {
      body.classList.add('alert-bar-closing');
      body.classList.remove('alert-bar-active');
      alertBar.classList.add('closing');

      setTimeout(function () {
         if (alertBar.parentNode) {
            alertBar.parentNode.removeChild(alertBar);
         }
      }, 300);
   });

   closeBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         closeBtn.click();
      }
   });
})();