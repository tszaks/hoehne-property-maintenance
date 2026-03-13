<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const steps = [
        {
            id: "01",
            title: "Assessment",
            description:
                "We start with a one-on-one meeting for a deep dive into your financials, operations, team, and culture. We find exactly where the gaps are, and the hidden breakdowns costing you money, time, and sanity.",
        },
        {
            id: "02",
            title: "Design",
            description:
                "From that assessment, we build a custom blueprint for your business. We keep it practical and focused on what you and your team can actually execute.",
        },
        {
            id: "03",
            title: "Install",
            description:
                "Weekly coaching actions, accountability systems, meeting frameworks, and team practices are installed into the DNA of your company. Your framework for success starts running daily.",
        },
        {
            id: "04",
            title: "Freedom",
            description:
                "Your team becomes the driving force of the business, productivity rises, profits follow, and you run the business instead of it running you.",
        },
    ];

    let sectionRef: HTMLElement;
    let progressLine: HTMLElement;
    let stepRefs: HTMLElement[] = [];
    let descRefs: HTMLElement[] = [];

    onMount(() => {
        // Header reveal
        gsap.from(".process-header", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        // Progress line grows as you scroll through the section
        gsap.to(progressLine, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 60%",
                end: "bottom 60%",
                scrub: true,
            },
        });

        // Each step staggers in
        stepRefs.forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: "top 80%",
                },
                x: i % 2 === 0 ? -40 : 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });
        });

        // Descriptions fade up after the step title enters
        descRefs.forEach((desc) => {
            gsap.from(desc, {
                scrollTrigger: {
                    trigger: desc,
                    start: "top 85%",
                },
                y: 20,
                opacity: 0,
                duration: 0.7,
                delay: 0.3,
                ease: "power3.out",
            });
        });
    });
</script>

<section
    bind:this={sectionRef}
    id="process"
    class="py-24 lg:py-32 bg-ind-bg relative z-10"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="process-header mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">
                SEC. 03 // PROCESS // METHODOLOGY
            </div>
            <h2
                class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4"
            >
                <span class="w-12 h-[1px] bg-ind-accent"></span> How It Works
            </h2>
            <h3
                class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl"
            >
                The Path to Freedom
            </h3>
        </div>

        <!-- Timeline -->
        <div class="relative">
            <!-- Vertical progress line -->
            <div
                class="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-ind-border/20 md:-translate-x-1/2"
            >
                <div
                    bind:this={progressLine}
                    class="absolute top-0 left-0 w-full h-full bg-ind-accent origin-top scale-y-0"
                ></div>
            </div>

            <!-- Steps -->
            <div class="space-y-16 md:space-y-24">
                {#each steps as step, i}
                    <div
                        bind:this={stepRefs[i]}
                        class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pl-16 md:pl-0"
                    >
                        <!-- Dot on timeline -->
                        <div
                            class="absolute left-4 md:left-1/2 top-2 w-5 h-5 border-2 border-ind-accent bg-ind-bg rounded-full md:-translate-x-1/2 z-10"
                        ></div>

                        <!-- Content: alternates left/right on desktop -->
                        {#if i % 2 === 0}
                            <div class="md:text-right md:pr-16">
                                <div
                                    class="text-ind-accent font-black text-5xl lg:text-6xl tracking-tighter opacity-20 mb-2"
                                >
                                    {step.id}
                                </div>
                                <h4
                                    class="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3"
                                >
                                    {step.title}
                                </h4>
                                <p
                                    bind:this={descRefs[i]}
                                    class="text-ind-steel text-sm md:text-base leading-relaxed"
                                >
                                    {step.description}
                                </p>
                            </div>
                            <div class="hidden md:block"></div>
                        {:else}
                            <div class="hidden md:block"></div>
                            <div class="md:pl-16">
                                <div
                                    class="text-ind-accent font-black text-5xl lg:text-6xl tracking-tighter opacity-20 mb-2"
                                >
                                    {step.id}
                                </div>
                                <h4
                                    class="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3"
                                >
                                    {step.title}
                                </h4>
                                <p
                                    bind:this={descRefs[i]}
                                    class="text-ind-steel text-sm md:text-base leading-relaxed"
                                >
                                    {step.description}
                                </p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
