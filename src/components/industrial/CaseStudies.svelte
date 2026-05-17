<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const projects = [
        {
            type: "KITCHEN REMODEL",
            title: "Full Kitchen Renovation",
            description: "Complete gut and rebuild — new cabinetry, quartz countertops, subway tile backsplash, LVP flooring, and full appliance suite.",
            location: "Pottstown, PA",
            img: "/work/project-3.jpg",
        },
        {
            type: "BATHROOM REMODEL",
            title: "Master Bathroom Vanity",
            description: "Custom double-sink vanity, quartz countertops, new lighting, mirrors, and full tile work. Clean, modern, built to last.",
            location: "Montgomery County, PA",
            img: "/work/project-4.jpg",
        },
        {
            type: "INTERIOR WORK",
            title: "Attic Conversion & Flooring",
            description: "Full attic conversion with LVP flooring installation and fresh paint throughout.",
            location: "Pottstown, PA",
            img: "/work/project-2.jpg",
        },
        {
            type: "CUSTOM FINISH",
            title: "Nursery Mural Installation",
            description: "Custom wallpaper mural for a nursery — installed perfectly, aligned to the room. Owner surprised his wife when she got home.",
            location: "North Coventry, PA",
            img: "/work/project-1.jpg",
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each projects as project}
                <div class="project-card group relative overflow-hidden ind-steel-plate hover:border-ind-accent/30 transition-colors duration-300 cursor-pointer">
                    <!-- Image with overlay -->
                    <div
                        class="aspect-[4/3] bg-cover bg-center relative"
                        style="background-image: url('{project.img}');"
                    >
                        <!-- Dark gradient overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-all duration-300"></div>

                        <!-- Text content -->
                        <div class="absolute inset-0 flex flex-col justify-end p-5">
                            <div class="text-xs font-bold text-ind-accent tracking-widest uppercase mb-2 opacity-80">{project.type}</div>
                            <h4 class="text-lg font-black text-white uppercase tracking-tight mb-2 leading-tight">{project.title}</h4>
                            <p class="text-ind-steel text-xs leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{project.description}</p>
                            <div class="flex items-center gap-2 text-ind-steel text-xs">
                                <span class="w-4 h-[1px] bg-ind-border"></span>
                                {project.location}
                            </div>
                        </div>
                    </div>

                    <!-- Rivets -->
                    <div class="ind-rivet top-3 left-3"></div>
                    <div class="ind-rivet top-3 right-3"></div>
                </div>
            {/each}
        </div>
    </div>
</section>
