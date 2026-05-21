<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const projects = [
        {
            type: "Kitchen remodel",
            title: "Full kitchen renovation",
            description: "Complete gut and rebuild. New cabinetry, quartz counters, subway tile backsplash, LVP flooring, and a full appliance suite.",
            location: "Pottstown, PA",
            img: "/work/project-3.jpg",
        },
        {
            type: "Bathroom remodel",
            title: "Master bath vanity",
            description: "Custom double-sink vanity, quartz counters, new lighting and mirrors, and full tile work. Clean, modern, built to last.",
            location: "Montgomery County, PA",
            img: "/work/project-4.jpg",
        },
        {
            type: "Interior work",
            title: "Attic conversion and flooring",
            description: "Full attic conversion with LVP flooring and fresh paint throughout.",
            location: "Pottstown, PA",
            img: "/work/project-2.jpg",
        },
        {
            type: "Custom finish",
            title: "Nursery mural install",
            description: "Custom wallpaper mural for a nursery, installed perfectly and aligned to the room. Surprised the homeowner's wife when she got home.",
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
                <div class="ind-metadata mb-4">Finished work</div>
                <h2 class="text-ind-accent font-semibold tracking-wide text-sm mb-4 flex items-center gap-4">
                    <span class="w-10 h-[1px] bg-ind-accent"></span> Recent projects
                </h2>
                <h3 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-2xl">
                    Clean work, handled start to finish.
                </h3>
            </div>
            <a href="#contact" class="ind-button inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold self-start lg:self-auto shrink-0">
                Start your project <ArrowRight size={14} />
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each projects as project}
                <div class="project-card group relative overflow-hidden ind-steel-plate hover:border-ind-accent/30 transition-colors duration-300 cursor-pointer">
                    <div
                        class="aspect-[4/3] bg-cover bg-center relative"
                        style="background-image: url('{project.img}');"
                    >
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/55 transition-all duration-300"></div>
                    </div>
                    <div class="p-5">
                        <div class="text-xs font-semibold text-ind-accent tracking-wide mb-2">{project.type}</div>
                        <h4 class="text-lg font-semibold text-white tracking-tight mb-2 leading-tight">{project.title}</h4>
                        <p class="text-ind-steel text-sm leading-relaxed mb-4">{project.description}</p>
                        <div class="flex items-center gap-2 text-ind-steel/75 text-xs">
                            <span class="w-4 h-[1px] bg-ind-border"></span>
                            {project.location}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
