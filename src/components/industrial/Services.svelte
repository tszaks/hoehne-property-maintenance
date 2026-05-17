<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import {
        Hammer, Wrench, PaintBrush, Plant, Snowflake,
        Tree, Bathtub, CookingPot, Drop, House,
        Wall, Door
    } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const services = [
        { icon: Hammer,      title: "Home Remodeling"   },
        { icon: Wrench,      title: "Handyman Services"  },
        { icon: PaintBrush,  title: "Painting"           },
        { icon: Plant,       title: "Lawn Care"          },
        { icon: Snowflake,   title: "Snow Removal"       },
        { icon: Tree,        title: "Decks & Outdoor"    },
        { icon: Bathtub,     title: "Bathrooms"          },
        { icon: CookingPot,  title: "Kitchens"           },
        { icon: Drop,        title: "Pressure Washing"   },
        { icon: House,       title: "General Repairs"    },
        { icon: Wall,        title: "Drywall & Paint"    },
        { icon: Door,        title: "Doors & Windows"    },
    ];

    onMount(() => {
        gsap.from(".svc-item", {
            scrollTrigger: { trigger: sectionRef, start: "top 85%" },
            y: 20, opacity: 0, duration: 0.4, stagger: 0.04, ease: "power2.out",
        });
    });
</script>

<section bind:this={sectionRef} id="services" class="py-20 bg-ind-surface relative z-10">
    <div class="max-w-4xl mx-auto px-6">

        <div class="text-center mb-12">
            <div class="ind-metadata text-ind-steel mb-3 opacity-60">WHAT WE DO</div>
            <h2 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
                No Job Too Small.<br class="sm:hidden" /> No Job Too Big.
            </h2>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {#each services as svc}
                <div class="svc-item flex flex-col items-center gap-2 p-4 border border-ind-border/20 hover:border-ind-accent/60 hover:bg-ind-bg transition-all duration-200 group cursor-default">
                    <svelte:component this={svc.icon} size={24} weight="duotone" class="text-ind-accent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span class="text-[0.6rem] font-bold uppercase tracking-widest text-ind-steel group-hover:text-white transition-colors text-center leading-tight">{svc.title}</span>
                </div>
            {/each}
        </div>

        <div class="text-center mt-10">
            <p class="text-ind-steel text-sm">Serving Pottstown, Boyertown, Phoenixville, Limerick & all of Montgomery + Chester Counties</p>
        </div>
    </div>
</section>
