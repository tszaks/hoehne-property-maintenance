<script lang="ts">
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { Cpu, ShieldCheck, Zap } from "lucide-svelte";

  gsap.registerPlugin(ScrollTrigger);

  let section: HTMLElement;
  let card: HTMLElement;
  let content: HTMLElement;

  onMount(() => {
    // Reveal and Scale Card on Scroll
    gsap.fromTo(
      card,
      { scale: 0.92, opacity: 0, y: 100, rotateX: 5 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 30%",
          scrub: 1.5,
        },
      },
    );

    // Inner content parallax with secondary staggered reveal
    gsap.fromTo(
      content,
      { y: 60, opacity: 0 },
      {
        y: -40,
        opacity: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });
</script>

<section
  bind:this={section}
  id="works"
  class="py-32 lg:py-60 px-6 min-h-screen flex items-center justify-center bg-[#fdfdfc]"
>
  <div class="max-w-7xl mx-auto w-full">
    <div
      class="mb-16 lg:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12"
    >
      <div class="space-y-4">
        <span
          class="text-accent text-[10px] font-bold tracking-[0.6em] uppercase block"
          >Flagship Offering</span
        >
        <h2
          class="text-6xl md:text-[6rem] lg:text-[8rem] font-bold tracking-tightest"
        >
          Mastermind.
        </h2>
      </div>
      <p
        class="max-w-md text-apple-500 text-sm md:text-lg leading-relaxed font-medium italic"
      >
        "Elite peer-to-peer advisory." <br class="hidden md:block" />
        For high-revenue owners ready to share blueprints, expose bottlenecks, and
        scale together.
      </p>
    </div>

    <a
      href="https://tally.so/r/waKK7E"
      target="_blank"
      bind:this={card}
      class="relative block w-full aspect-[4/5] md:aspect-[16/8] rounded-[3rem] overflow-hidden group"
    >
      <!-- Background / Shadow -->
      <div
        class="absolute inset-0 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-black/5"
      ></div>

      <div
        bind:this={content}
        class="relative z-10 h-full flex flex-col items-center justify-center text-center p-12 transition-transform duration-700 group-hover:scale-[1.02]"
      >
        <h3
          class="text-5xl md:text-7xl font-bold tracking-tightest mb-12 text-black"
        >
          Industry Dominance
        </h3>

        <div class="flex flex-wrap justify-center gap-10 md:gap-20">
          <div class="flex flex-col items-center gap-3">
            <Cpu size={24} class="text-apple-300" />
            <span
              class="text-[9px] font-bold tracking-[0.3em] uppercase text-apple-400"
              >Strategic</span
            >
          </div>
          <div class="flex flex-col items-center gap-3">
            <ShieldCheck size={24} class="text-apple-300" />
            <span
              class="text-[9px] font-bold tracking-[0.3em] uppercase text-apple-400"
              >Exclusive</span
            >
          </div>
          <div class="flex flex-col items-center gap-3">
            <Zap size={24} class="text-apple-300" />
            <span
              class="text-[9px] font-bold tracking-[0.3em] uppercase text-apple-400"
              >Proven</span
            >
          </div>
        </div>
      </div>

      <!-- Texture -->
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('/noise.svg')] mix-blend-overlay"
      ></div>
    </a>
  </div>
</section>

<style>
  section {
    perspective: 1000px;
  }
</style>
