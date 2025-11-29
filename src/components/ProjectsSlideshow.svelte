<script>
  import { onMount } from "svelte";
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
  const projectDescriptions = [
    "RippleKit (archived)",
    "Poly (archived)",
    "Project: Mountain (archived)",
  ];

  function next(n) {
    current = (current + n + slides.length) % slides.length;
    updateDesc();
  }
  function goTo(n) {
    current = n % slides.length;
    updateDesc();
  }
  let desc = projectDescriptions[0];
  function updateDesc() {
    desc = projectDescriptions[current];
  }

  onMount(() => {
    updateDesc();
  });
</script>

<div class="slideshow-container" style="font-weight: 100;">
  {#each slides as slide, i}
    <div class="slide" style="display: {i === current ? 'block' : 'none'};">
      <img src={slide.img} style="width: 100%" alt={slide.caption} />
    </div>
  {/each}

  <a class="prev" on:click={() => next(-1)}>&#10094;</a>
  <a class="next" on:click={() => next(1)}>&#10095;</a>

  <div style="text-align:center; margin-top:15px;">
    {#each slides as _, i}
      <span class="dot {i === current ? 'active' : ''}" on:click={() => goTo(i)}
      ></span>
    {/each}
  </div>

  <p
    id="project-desc"
    style="text-align:center; margin:1.5rem 0 0 0; font-size:1.1rem; font-weight:100;"
  >
    {desc}
  </p>
</div>
