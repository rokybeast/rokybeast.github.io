<script>
  import { onMount } from "svelte";
  let show = false;
  onMount(() => {
    window.addEventListener("scroll", () => {
      show = window.scrollY > 300;
    });
  });
  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<button
  id="to-top-btn"
  class="contact-button to-top-btn {show ? 'show' : ''}"
  title="Back to Top"
  on:click={goTop}
>
  <i class="bx bx-arrow-to-top"></i>
</button>
