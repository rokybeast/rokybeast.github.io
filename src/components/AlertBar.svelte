<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const isOpen = writable(true);

  function close() {
    isOpen.set(false);
  }

  onMount(() => {
    // set alert bar height CSS variable for layout
    const alertBar = document.getElementById("alertBar");
    if (!alertBar) return;

    const setAlertBarHeight = () => {
      const height = alertBar.offsetHeight;
      document.body.style.setProperty("--alert-bar-height", height + "px");
    };

    setAlertBarHeight();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setAlertBarHeight, 100);
    });
  });
</script>

{#if $isOpen}
  <div class="alert-bar" id="alertBar">
    <div class="alert-bar-content">
      <div class="alert-bar-message">Website Updated, now with Astro 🚀</div>
      <button class="alert-bar-close" on:click={close} aria-label="Close alert">
        <i class="bx bx-x"></i>
      </button>
    </div>
  </div>
{/if}
