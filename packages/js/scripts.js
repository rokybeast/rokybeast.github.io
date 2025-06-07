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

  const circleContainer = document.querySelector(".circle-container");
  const numCircles = 50;

  function createCircle() {
    const circle = document.createElement("div");
    circle.classList.add("circle");

    const size = Math.random() * 50 + 20;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circleContainer.appendChild(circle);
  }

  for (let i = 0; i < numCircles; i++) {
    createCircle();
  }

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
});
