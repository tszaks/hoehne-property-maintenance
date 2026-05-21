<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let lineRef: HTMLElement;
    let descRefs: HTMLElement[] = [];

    const steps = [
        {
            id: "01",
            title: "Call or Text",
            description: "Reach out at (610) 412-6424 or fill out the contact form. Tell us what you need. No job is too small to talk about.",
        },
        {
            id: "02",
            title: "Free On-Site Estimate",
            description: "We come to you, assess the work, and give you a straight, detailed estimate. No surprises, no pressure.",
        },
        {
            id: "03",
            title: "Work Gets Scheduled",
            description: "Once you approve, we get on the calendar. We show up when we say we will. That's a Hoehne guarantee.",
        },
        {
            id: "04",
            title: "Job Done Right",
            description: "We do the work, clean up after ourselves, and don't leave until you're satisfied. Then we follow up.",
        },
    ];

    onMount(() => {
        gsap.from(lineRef, {
            scrollTrigger: { trigger: sectionRef, start: "top 70%", end: "bottom 80%", scrub: 1 },
            scaleY: 0, transformOrigin: "top",
        });
        descRefs.forEach((ref, i) => {
            if (ref) gsap.from(ref, {
                scrollTrigger: { trigger: ref, start: "top 85%" },
                y: 30, opacity: 0, duration: 0.7, delay: i * 0.1, ease: "power3.out",
            });
        });
    });
</script>

<section bind:this={sectionRef} id="process" class="py-24 lg:py-32 bg-ind-surface relative z-10 ind-gridpaper">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 03 // PROCESS</div>
            <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-ind-accent"></span> How It Works
            </h2>
            <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl">
                Simple. Straight. Done.
            </h3>
        </div>

        <div class="relative">
            <div bind:this={lineRef} class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-ind-border/30 -translate-x-1/2"></div>

            <div class="space-y-16 lg:space-y-0">
                {#each steps as step, i}
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center lg:min-h-[180px]">
                        {#if i % 2 === 0}
                            <div bind:this={descRefs[i]} class="lg:pr-16">
                                <div class="text-ind-accent font-black text-5xl lg:text-6xl tracking-tighter opacity-20 mb-2">{step.id}</div>
                                <h4 class="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">{step.title}</h4>
                                <p class="text-ind-steel text-sm md:text-base leading-relaxed">{step.description}</p>
                            </div>
                            <div class="hidden lg:flex items-center justify-start pl-16">
                                <div class="w-3 h-3 bg-ind-accent rounded-full"></div>
                            </div>
                        {:else}
                            <div class="hidden lg:flex items-center justify-end pr-16">
                                <div class="w-3 h-3 bg-ind-accent rounded-full"></div>
                            </div>
                            <div bind:this={descRefs[i]} class="lg:pl-16">
                                <div class="text-ind-accent font-black text-5xl lg:text-6xl tracking-tighter opacity-20 mb-2">{step.id}</div>
                                <h4 class="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">{step.title}</h4>
                                <p class="text-ind-steel text-sm md:text-base leading-relaxed">{step.description}</p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
