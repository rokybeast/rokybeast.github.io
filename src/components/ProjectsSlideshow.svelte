<script>
  let current = 0;
  const slides = [
    {
      img: "https://placehold.co/800x400/383838/FFFFFF?text=Project+1",
      caption: "RippleKit",
    },
    {
      img: "https://placehold.co/800x400/383838/FFFFFF?text=Project+2",
      caption: "Poly",
    },
    {
      img: "https://placehold.co/800x400/383838/FFFFFF?text=Project+3",
      caption: "Project: Mountain",
    },
  ];

  function next(n) {
    current = (current + n + slides.length) % slides.length;
  }
</script>

<div class="slideshow-container" style="font-weight: 100;">
  {#each slides as slide, i}
    <div class="slide" style="display: {i === current ? 'block' : 'none'};">
      <img src={slide.img} style="width: 100%" alt={slide.caption} />
    </div>
  {/each}

  <a class="prev" on:click={() => next(-1)}>&#10094;</a>
  <a class="next" on:click={() => next(1)}>&#10095;</a>

</div>
