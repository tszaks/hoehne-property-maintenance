<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let portraitRef: HTMLElement;
    let bioRef: HTMLElement;

    const stats = [
        { value: "20+", label: "Years Experience" },
        { value: "500+", label: "Jobs Completed" },
        { value: "U.S.", label: "Military Veteran" },
    ];

    onMount(() => {
        gsap.from(".about-header", {
            scrollTrigger: { trigger: sectionRef, start: "top 80%" },
            y: 50, opacity: 0, duration: 1, ease: "power3.out",
        });
        gsap.from(portraitRef, {
            scrollTrigger: { trigger: portraitRef, start: "top 85%" },
            x: -40, opacity: 0, duration: 1, ease: "power3.out",
        });
        gsap.from(bioRef, {
            scrollTrigger: { trigger: bioRef, start: "top 85%" },
            x: 40, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="about" class="py-24 lg:py-32 bg-ind-bg relative z-10 ind-gridpaper">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="about-header mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 05 // OWNER</div>
            <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-ind-accent"></span> About Aaron
            </h2>
            <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl">
                Aaron Hoehne
            </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <!-- Portrait -->
            <div bind:this={portraitRef} class="lg:col-span-2 relative">
                <div class="ind-steel-plate overflow-hidden relative">
                    <div class="aspect-[3/4] bg-cover bg-center bg-top filter grayscale hover:grayscale-0 transition-all duration-700"
                        style="background-image: url('/aaron-hoehne.jpg'); background-color: #171717;">
                        <!-- Fallback if no photo -->
                        <div class="absolute inset-0 flex items-center justify-center bg-ind-surface">
                            <div class="text-center">
                                <div class="text-6xl font-black text-ind-accent opacity-20">AH</div>
                                <div class="ind-metadata text-ind-steel mt-2">Aaron Hoehne</div>
                            </div>
                        </div>
                    </div>
                    <div class="ind-rivet top-3 left-3"></div>
                    <div class="ind-rivet top-3 right-3"></div>
                    <div class="ind-rivet bottom-3 left-3"></div>
                    <div class="ind-rivet bottom-3 right-3"></div>
                </div>
                <div class="ind-steel-plate absolute -bottom-4 -right-4 md:-right-6 px-5 py-3 z-10">
                    <span class="text-2xl font-black text-ind-accent tracking-tighter">20+</span>
                    <span class="block text-[0.6rem] uppercase tracking-widest text-ind-steel">Years</span>
                </div>
            </div>

            <!-- Bio -->
            <div bind:this={bioRef} class="lg:col-span-3">
                <div class="space-y-6 mb-10">
                    <p class="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
                        Aaron Hoehne is a U.S. Military veteran who has spent over 20 years turning his service-built work ethic into quality craftsmanship for homeowners across Pottstown and Montgomery County.
                    </p>
                    <p class="text-ind-steel leading-relaxed">
                        After serving, Aaron put his hands to work building a business rooted in one principle: do the job right, show up when you say you will, and treat every home like it's your own. That standard hasn't changed since day one.
                    </p>
                    <p class="text-ind-steel leading-relaxed">
                        Whether it's a bathroom remodel, a fresh coat of paint, or your driveway after a snowstorm, Hoehne Property Maintenance & Remodeling is the one call that handles it all.
                    </p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-6 border-t border-ind-border/30 pt-8">
                    {#each stats as stat}
                        <div>
                            <div class="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                            <div class="text-[0.65rem] uppercase tracking-widest text-ind-steel">{stat.label}</div>
                        </div>
                    {/each}
                </div>

                <!-- Certifications / Stamps -->
                <div class="flex flex-wrap items-center gap-3 mt-8">
                    {#each ["VETERAN OWNED", "POTTSTOWN PA", "LICENSED & INSURED", "FREE ESTIMATES"] as cert}
                        <div class="px-3 py-1.5 border border-ind-border/30 text-[0.55rem] ind-metadata text-ind-steel/50 tracking-[0.15em] transform -rotate-1 hover:border-ind-accent/50 hover:text-ind-accent transition-all duration-300">
                            {cert}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>
