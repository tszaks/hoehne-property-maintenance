<script lang="ts">
  import { onMount } from "svelte";
  import gsap from "gsap";

  let nav: HTMLElement;

  onMount(() => {
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 0.5, ease: "power4.out" },
    );
  });
</script>

<nav
  bind:this={nav}
  class="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 lg:pt-8 px-6 pointer-events-none"
>
  <div
    class="glass px-6 md:px-8 py-4 rounded-full flex items-center gap-6 md:gap-12 pointer-events-auto"
  >
    <a
      href="/"
      class="text-[10px] font-bold tracking-[0.4em] uppercase text-black"
    >
      GNA.WORKS
    </a>

    <div class="hidden md:flex gap-10">
      {#each ["About", "Opportunities", "Insights"] as item}
        <a
          href={`/#${item.toLowerCase()}`}
          class="text-[10px] text-apple-400 hover:text-black transition-colors tracking-[0.3em] font-bold uppercase transition-transform hover:scale-105"
        >
          {item}
        </a>
      {/each}
    </div>

    <a
      href="https://tally.so/r/waKK7E"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black/80 transition-all duration-300"
    >
      Execute
    </a>
  </div>
</nav>
