<script>
  import { onMount } from "svelte";

  const toolData = [
    // Languages
    { name: "Rust", src: "https://cdn.simpleicons.org/rust/F74C00" },
    { name: "Go", src: "https://cdn.simpleicons.org/go" },
    { name: "C++", src: "https://cdn.simpleicons.org/cplusplus" },
    { name: "C", src: "https://cdn.simpleicons.org/c" },
    { name: "Arduino", src: "https://cdn.simpleicons.org/arduino" },
    { name: "WebAssembly", src: "https://cdn.simpleicons.org/webassembly" },
    { name: "OpenJDK/Java", src: "https://cdn.simpleicons.org/openjdk/FFFFFF" },
    { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },
    { name: "JavaScript", src: "https://cdn.simpleicons.org/javascript" },
    { name: "Python", src: "https://cdn.simpleicons.org/python" },
    { name: "SCSS", src: "https://cdn.simpleicons.org/sass" },

    // Helpers
    { name: "React", src: "https://cdn.simpleicons.org/react" },
    { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
    { name: "Svelte", src: "https://cdn.simpleicons.org/svelte" },
    { name: "Astro", src: "https://cdn.simpleicons.org/astro" },
    { name: "LaTeX", src: "https://cdn.simpleicons.org/latex" },

    // Operating Systems
    { name: "Linux", src: "https://cdn.simpleicons.org/linux" },
    { name: "Arch Linux", src: "https://cdn.simpleicons.org/archlinux" },
    { name: "Debian", src: "https://cdn.simpleicons.org/debian" },
    { name: "Kali Linux", src: "https://cdn.simpleicons.org/kalilinux" },
    {
      name: "Windows",
      src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg",
    },
  ];

  function createToolLogos() {
    const items = [];
    for (let j = 0; j < 2; j++) {
      toolData.forEach((tool) =>
        items.push({ src: tool.src, name: tool.name }),
      );
    }
    return items;
  }

  let items = [];

  onMount(() => {
    items = createToolLogos();
  });
</script>

<div class="marquee-container">
  <div class="marquee">
    {#each items as item}
      <div class="tool-logo-container">
        <img class="tool-logo" src={item.src} alt={item.name} />
        <span class="tool-tooltip">{item.name}</span>
      </div>
    {/each}
  </div>
</div>
