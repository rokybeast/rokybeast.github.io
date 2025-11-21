<script>
  import { onMount } from "svelte";

  // SIMPLIFIED: Only 1 src per tool (color icons)
  const toolData = [
    { name: "HTML", src: "https://cdn.simpleicons.org/html5" },
    { name: "CSS", src: "https://cdn.simpleicons.org/css" },
    { name: "SCSS", src: "https://cdn.simpleicons.org/sass" },
    { name: "JavaScript", src: "https://cdn.simpleicons.org/javascript" },
    {
      name: "VBA",
      src: "https://api.iconify.design/simple-icons/visualbasic.svg?color=%232B579A",
    },
    { name: "Poly", src: "../poly/assets/poly_svg_mod.svg" },
    { name: "PHP", src: "https://cdn.simpleicons.org/php" },
    { name: "Svelte", src: "https://cdn.simpleicons.org/svelte" },
    { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },
    { name: "Rust", src: "https://cdn.simpleicons.org/rust/F74C00" },
  ];

  // No theme logic needed anymore — simple repeat x2
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
    // Just generate once — no theme switching required
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
