<script lang="ts">
  import { onMount } from "svelte";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { ArrowUpRight } from "lucide-svelte";

  gsap.registerPlugin(ScrollTrigger);

  const projects = [
    {
      name: "Stop Being the Bottleneck",
      year: "MAR 10",
      type: "Operations",
      color: "bg-slate-800",
      link: "https://tally.so/r/waKK7E",
    },
    {
      name: "Financial Transparency",
      year: "MAR 08",
      type: "Finance",
      color: "bg-slate-800",
      link: "https://tally.so/r/waKK7E",
    },
    {
      name: "Promise Management",
      year: "MAR 05",
      type: "Leadership",
      color: "bg-slate-800",
      link: "https://tally.so/r/waKK7E",
    },
  ];

  let items: HTMLElement[] = [];

  onMount(() => {
    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  });
</script>

<section
  id="archive"
  class="py-32 lg:py-60 px-6 border-t border-black/5 bg-[#fdfdfc] overflow-hidden"
>
  <div class="max-w-5xl mx-auto">
    <div
      class="flex flex-col md:flex-row md:items-end justify-between mb-40 gap-8"
    >
      <div class="space-y-4">
        <span
          class="text-apple-600 text-[10px] font-bold tracking-[0.6em] uppercase block"
          >Executive Intel</span
        >
        <h2 class="text-6xl md:text-8xl font-bold tracking-tightest">
          Strategic Briefings.
        </h2>
      </div>
    </div>

    <div class="divide-y divide-black/5">
      {#each projects as project, i}
        <a
          bind:this={items[i]}
          href={project.link}
          class="group py-12 lg:py-16 flex items-center justify-between cursor-pointer border-t first:border-t-0 border-black/5"
        >
          <div class="flex items-center gap-12 md:gap-20">
            <span class="text-apple-300 font-mono text-xs hidden md:block"
              >0{i + 1}</span
            >
            <div class="flex flex-col gap-3">
              <span
                class="text-2xl md:text-5xl font-bold tracking-tightest group-hover:translate-x-6 transition-transform duration-700 ease-in-out"
              >
                {project.name}
              </span>
              <div class="flex items-center gap-4">
                <div class={`w-1.5 h-1.5 rounded-full ${project.color}`}></div>
                <span
                  class="text-[9px] font-bold tracking-[0.3em] uppercase text-apple-500"
                >
                  {project.type}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-12 md:gap-20">
            <span
              class="text-apple-300 font-medium font-mono text-sm hidden md:block"
              >{project.year}</span
            >
            <div
              class="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500"
            >
              <ArrowUpRight size={24} strokeWidth={1.5} />
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
