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
      name: "React",
      srcLight: "https://cdn.simpleicons.org/react",
      srcDark: "https://cdn.simpleicons.org/react",
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
        const img = document.createElement("img");
        img.src = theme === "dark" ? tool.srcDark : tool.srcLight;
        img.alt = tool.name;
        img.classList.add("tool-logo");
        fragment.appendChild(img);
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
    "Project Alpha is a showcase of my first major project.",
    "Project Beta is a collaborative effort with a focus on UI/UX.",
    "Project Gamma explores advanced backend integrations.",
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

  // --- Spotify Now Playing Logic ---
  async function fetchSpotifyNowPlaying() {
    try {
      const response = await fetch("https://yourproxy.com/spotify/nowplaying", {
        headers: {
          Authorization: "Bearer YOUR_SPOTIFY_ACCESS_TOKEN"
        }
      });

      if (!response.ok) throw new Error("Not playing");

      const data = await response.json();

      const trackName = data.item.name;
      const artistName = data.item.artists.map(a => a.name).join(", ");
      const albumArt = data.item.album.images[0].url;

      document.getElementById("spotify-track-name").textContent = trackName;
      document.getElementById("spotify-artist-name").textContent = artistName;
      document.getElementById("spotify-album-art").style.backgroundImage = `url(${albumArt})`;

    } catch (err) {
      document.getElementById("spotify-track-name").textContent = "Nothing Playing";
      document.getElementById("spotify-artist-name").textContent = "Spotify idle...";
      document.getElementById("spotify-album-art").style.backgroundImage = "none";
    }
  }

  fetchSpotifyNowPlaying();
  setInterval(fetchSpotifyNowPlaying, 60000); // auto-refresh every 1 minute
});