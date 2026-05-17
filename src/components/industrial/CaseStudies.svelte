<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const projects = [
        {
            type: "BATHROOM REMODEL",
            title: "Master Bath Renovation",
            description: "Full gut and rebuild — new tile, walk-in shower, vanity, and plumbing. Completed in under two weeks.",
            location: "Pottstown, PA",
        },
        {
            type: "NURSERY INSTALLATION",
            title: "Custom Wallpaper Mural",
            description: "A custom nursery mural installed and aligned perfectly. Owner surprised his wife when she got home.",
            location: "North Coventry, PA",
        },
        {
            type: "EXTERIOR WORK",
            title: "Deck Build & Stain",
            description: "New 400 sq ft deck with pressure-treated framing, composite decking, and full exterior stain.",
            location: "Boyertown, PA",
        },
    ];

    onMount(() => {
        gsap.from(".project-card", {
            scrollTrigger: { trigger: sectionRef, start: "top 80%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="work" class="py-24 lg:py-32 bg-ind-bg relative z-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
            <div>
                <div class="ind-metadata mb-4">SEC. 04 // RESULTS // FINISHED WORK</div>
                <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                    <span class="w-12 h-[1px] bg-ind-accent"></span> Completed Projects
                </h2>
                <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-2xl">
                    The Work Speaks For Itself
                </h3>
            </div>
            <a href="#contact" class="ind-button inline-flex items-center gap-3 px-6 py-3 text-xs font-bold uppercase tracking-wider self-start lg:self-auto shrink-0">
                Start Your Project <ArrowRight size={14} />
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each projects as project}
                <div class="project-card ind-steel-plate p-8 group hover:border-ind-accent/30 transition-colors duration-300">
                    <div class="text-xs font-bold text-ind-accent tracking-widest uppercase mb-4 opacity-70">{project.type}</div>
                    <h4 class="text-2xl font-bold text-white uppercase tracking-tight mb-4">{project.title}</h4>
                    <p class="text-ind-steel text-sm leading-relaxed mb-6">{project.description}</p>
                    <div class="flex items-center gap-2 text-ind-steel text-xs">
                        <span class="w-4 h-[1px] bg-ind-border"></span>
                        {project.location}
                    </div>
                    <!-- Rivets -->
                    <div class="ind-rivet top-3 left-3"></div>
                    <div class="ind-rivet top-3 right-3"></div>
                    <div class="ind-rivet bottom-3 left-3"></div>
                    <div class="ind-rivet bottom-3 right-3"></div>
                </div>
            {/each}
        </div>
    </div>
</section>
