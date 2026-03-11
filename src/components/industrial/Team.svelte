<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let sectionRef: HTMLElement;
    let portraitRef: HTMLElement;
    let bioRef: HTMLElement;

    const stats = [
        { value: "30+", label: "Years Coaching" },
        { value: "300+", label: "Clients Coached" },
        { value: "1000%", label: "Promised ROI" },
    ];

    onMount(() => {
        gsap.from(".about-header", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(portraitRef, {
            scrollTrigger: {
                trigger: portraitRef,
                start: "top 85%",
            },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(bioRef, {
            scrollTrigger: {
                trigger: bioRef,
                start: "top 85%",
            },
            x: 40,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
        });
    });
</script>

<section
    bind:this={sectionRef}
    id="about"
    class="py-24 lg:py-32 bg-ind-bg relative z-10 ind-gridpaper"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="about-header mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 05 // FOUNDER</div>
            <h2
                class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4"
            >
                <span class="w-12 h-[1px] bg-ind-accent"></span> The Man Behind the
                Work
            </h2>
            <h3
                class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl"
            >
                Greg Neil
            </h3>
        </div>

        <div
            class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start"
        >
            <!-- Portrait -->
            <div bind:this={portraitRef} class="lg:col-span-2 relative">
                <div class="ind-steel-plate overflow-hidden relative">
                    <div
                        class="aspect-[3/4] bg-cover bg-center bg-top filter grayscale hover:grayscale-0 transition-all duration-700"
                        style="background-image: url('/greg-headshot.png')"
                    ></div>

                    <!-- Rivets -->
                    <div class="ind-rivet top-3 left-3"></div>
                    <div class="ind-rivet top-3 right-3"></div>
                    <div class="ind-rivet bottom-3 left-3"></div>
                    <div class="ind-rivet bottom-3 right-3"></div>
                </div>

                <!-- Experience badge -->
                <div
                    class="ind-steel-plate absolute -bottom-4 -right-4 md:-right-6 px-5 py-3 z-10"
                >
                    <span
                        class="text-2xl font-black text-ind-accent tracking-tighter"
                        >30+</span
                    >
                    <span
                        class="block text-[0.6rem] uppercase tracking-widest text-ind-steel"
                        >Years</span
                    >
                </div>
            </div>

            <!-- Bio -->
            <div bind:this={bioRef} class="lg:col-span-3">
                <div class="space-y-6 mb-10">
                    <p
                        class="text-lg md:text-xl text-white/90 font-medium leading-relaxed"
                    >
                        Greg Neil has spent 30 years coaching restoration and
                        construction business owners to build high-performing
                        teams, break through revenue plateaus, and step into
                        the owner role they actually want.
                    </p>
                    <p class="text-ind-steel leading-relaxed">
                        He's worked with hundreds of companies — from $5M
                        owner-operated businesses to $35M+ firms preparing for
                        acquisition. His clients have doubled revenue, sold to
                        national buyers, and finally gotten out of the
                        day-to-day grind they were stuck in for years.
                    </p>
                    <p class="text-ind-steel leading-relaxed">
                        Greg's approach is simple: change the culture, and
                        everything else follows. Productivity, profits,
                        accountability — they all flow from an environment
                        where people are empowered to give their best.
                    </p>
                </div>

                <!-- Stats row -->
                <div
                    class="grid grid-cols-3 gap-6 border-t border-ind-border/30 pt-8"
                >
                    {#each stats as stat}
                        <div>
                            <div
                                class="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1"
                            >
                                {stat.value}
                            </div>
                            <div
                                class="text-[0.65rem] uppercase tracking-widest text-ind-steel"
                            >
                                {stat.label}
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Certifications as stamps -->
                <div class="flex flex-wrap items-center gap-3 mt-8">
                    {#each ["30 YRS EXPERIENCE", "300+ CLIENTS", "RESTORATION SPECIALIST"] as cert}
                        <div
                            class="px-3 py-1.5 border border-ind-border/30 text-[0.55rem] ind-metadata text-ind-steel/50 tracking-[0.15em] transform -rotate-1 hover:border-ind-accent/50 hover:text-ind-accent transition-all duration-300"
                        >
                            {cert}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>
