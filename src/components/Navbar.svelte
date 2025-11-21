<script>
  import { onMount } from "svelte";
  let theme = "light";

  function applyTheme(t) {
    theme = t;
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    const themeIcon = document.getElementById("theme-toggle-icon");
    if (themeIcon) {
      themeIcon.classList.remove("bx-sun", "bx-moon");
      themeIcon.classList.add(t === "dark" ? "bx-moon" : "bx-sun");
    }
  }

  function toggleTheme() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  onMount(() => {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
  });
</script>

<nav id="navbar">
  <div class="nav-logo"><a href="#welcome">[r]</a></div>
  <ul class="nav-links">
    <li><a href="#welcome">Welcome</a></li>
    <li><a href="#about-me">About</a></li>
    <li><a href="#my-tools">My Tools</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ul>
  <div class="theme-switcher" on:click={toggleTheme}>
    <i id="theme-toggle-icon" class="bx bx-sun"></i>
  </div>
</nav>
