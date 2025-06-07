// Wrap all code in a DOMContentLoaded event listener to ensure the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Switcher ---
  const themeToggleButton = document.getElementById("theme-toggle-icon");
  const body = document.body;

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
    updateToolLogosVisibility(theme);
  }

  function updateToolLogosVisibility(theme) {
    const lightLogos = document.querySelectorAll(".tool-logo.logo-light");
    const darkLogos = document.querySelectorAll(".tool-logo.logo-dark");
    if (theme === "light") {
      lightLogos.forEach((logo) => (logo.style.display = "inline-block"));
      darkLogos.forEach((logo) => (logo.style.display = "none"));
    } else {
      lightLogos.forEach((logo) => (logo.style.display = "none"));
      darkLogos.forEach((logo) => (logo.style.display = "inline-block"));
    }
  }

  themeToggleButton.addEventListener("click", () => {
    let newTheme =
      body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  // Apply saved theme on initial load
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

  // Highlight active nav link on scroll
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
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
    if (slides.length === 0) return; // Exit if no slides

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

  // --- Email Reveal Button ---
  const revealEmailButton = document.getElementById("reveal-email-button");
  const emailText = document.getElementById("email-text");
  if (revealEmailButton && emailText) {
    revealEmailButton.addEventListener("click", () => {
      const isHidden =
        emailText.style.display === "none" || emailText.style.display === "";
      if (isHidden) {
        emailText.style.display = "inline-block";
        emailText.textContent = "sajid.shaik1186@gmail.com";
        revealEmailButton.innerHTML =
          "<i class='bx bx-check-circle'></i> Email:";
      } else {
        emailText.style.display = "none";
        revealEmailButton.innerHTML = "<i class='bx bx-envelope'></i> Email";
      }
    });
  }

  // --- Welcome Section Interactive Background ---
  const welcomeSection = document.getElementById("welcome");
  if (welcomeSection) {
    const polygonBg = welcomeSection.querySelector(".polygon-bg");
    const numTriangles = 15;

    for (let i = 0; i < numTriangles; i++) {
      const triangle = document.createElement("div");
      triangle.classList.add("triangle");
      triangle.style.left = `${Math.random() * 100}%`;
      triangle.style.top = `${Math.random() * 100}%`;
      const scale = Math.random() * 0.5 + 0.5;
      const rotation = Math.random() * 360;
      triangle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      triangle.dataset.originalTransform = triangle.style.transform; // Store original state
      triangle.style.borderBottomColor =
        Math.random() > 0.5
          ? "var(--primary-color-light-400)"
          : "var(--primary-color-light-600)";
      polygonBg.appendChild(triangle);
    }

    const triangles = polygonBg.querySelectorAll(".triangle");
    welcomeSection.addEventListener("mousemove", (e) => {
      const rect = welcomeSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      triangles.forEach((triangle) => {
        const dx = x - (parseFloat(triangle.style.left) * rect.width) / 100;
        const dy = y - (parseFloat(triangle.style.top) * rect.height) / 100;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const moveFactor = 200 / (dist + 1);
        const angle = Math.atan2(dy, dx);

        const maxMove = 25;
        const moveX = Math.max(
          -maxMove,
          Math.min(maxMove, Math.cos(angle) * moveFactor)
        );
        const moveY = Math.max(
          -maxMove,
          Math.min(maxMove, Math.sin(angle) * moveFactor)
        );

        triangle.style.transform = `translate(${moveX}px, ${moveY}px) ${triangle.dataset.originalTransform}`;
      });
    });

    welcomeSection.addEventListener("mouseleave", () => {
      triangles.forEach((triangle) => {
        triangle.style.transform = triangle.dataset.originalTransform;
      });
    });
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

  // --- Physics-based Cursor Circle ---
  const cursorCircle = document.querySelector(".cursor-circle");
  if (cursorCircle) {
    let mouse = { x: -100, y: -100 }; // Current mouse position
    let circle = { x: -100, y: -100 }; // Current circle position
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout;

    const speed = 0.1; // Lower is slower/smoother
    let scaleX = 1;
    let scaleY = 1;

    // Update mouse position
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Handle scrolling effect
    window.addEventListener("scroll", () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    });

    const tick = () => {
      // Interpolate circle position to mouse position for smoothness
      circle.x += (mouse.x - circle.x) * speed;
      circle.y += (mouse.y - circle.y) * speed;

      // Calculate velocity
      const deltaX = mouse.x - circle.x;
      const deltaY = mouse.y - circle.y;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Calculate scaling based on velocity and scrolling
      const targetScaleX = 1 - Math.min(velocity / 60, 0.5); // Stretch horizontally when moving fast
      const targetScaleY = isScrolling ? 0.6 : 1; // Squish vertically when scrolling

      // Lerp scaling for smooth transitions
      scaleX += (targetScaleX - scaleX) * speed;
      scaleY += (targetScaleY - scaleY) * speed;

      // Apply transform
      cursorCircle.style.transform = `translate(${circle.x}px, ${circle.y}px) scale(${scaleX}, ${scaleY})`;

      window.requestAnimationFrame(tick);
    };

    tick();
  }
});
