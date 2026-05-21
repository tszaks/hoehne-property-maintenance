<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight, MapPin } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const projects = [
        {
            ticket: "03/24",
            type: "Kitchen remodel",
            title: "Full kitchen renovation",
            description: "Complete gut and rebuild. New cabinetry, quartz counters, subway tile backsplash, LVP flooring, and a full appliance suite.",
            location: "Pottstown, PA",
            img: "/work/project-3.jpg",
        },
        {
            ticket: "05/24",
            type: "Bathroom remodel",
            title: "Master bath vanity",
            description: "Custom double-sink vanity, quartz counters, new lighting and mirrors, and full tile work. Clean, modern, built to last.",
            location: "Montgomery County, PA",
            img: "/work/project-4.jpg",
        },
        {
            ticket: "08/24",
            type: "Interior work",
            title: "Attic conversion + flooring",
            description: "Full attic conversion with LVP flooring and fresh paint throughout.",
            location: "Pottstown, PA",
            img: "/work/project-2.jpg",
        },
        {
            ticket: "11/24",
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
            y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="work" class="py-24 lg:py-32 bg-paper-deep relative z-10 overflow-hidden">

    <!-- Decorative backdrop wordmark -->
    <div aria-hidden="true" class="absolute -top-2 -right-2 backdrop-wordmark text-[14vw] whitespace-nowrap z-0 hidden lg:block">
        Recent · Recent
    </div>

    <div class="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">

        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-20">
            <div class="max-w-2xl">
                <div class="section-divider mb-6">
                    <span class="marker">§ 03</span>
                    <span class="line"></span>
                    <span class="marker text-hivis-deep">From the field</span>
                </div>
                <h2 class="font-display text-ink font-bold tracking-tight leading-[0.92]"
                    style="font-size: clamp(2.25rem, 5vw, 4.5rem); font-variation-settings: 'SOFT' 30, 'opsz' 144;">
                    Clean work,<br/>
                    <span class="italic" style="font-weight: 500;">handled start to finish.</span>
                </h2>
            </div>
            <a href="#contact" class="ind-button inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold self-start lg:self-auto shrink-0">
                Start your project <ArrowRight size={14} weight="bold" />
            </a>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {#each projects as project, i}
                <div class="project-card group relative">
                    <!-- Card: tape + photo + caption -->
                    <div class="relative bg-paper border border-ink/15 shadow-[0_8px_24px_-6px_rgba(20,16,10,0.18)] p-3 lg:p-4">
                        <!-- Tape decoration -->
                        <div class="tape" style="top: -12px; left: 32px; transform: rotate({i % 2 === 0 ? '-4deg' : '5deg'});"></div>

                        <!-- Photo -->
                        <div class="relative aspect-[4/3] overflow-hidden">
                            <span class="bracket-tl" style="top: 6px; left: 6px;"></span>
                            <span class="bracket-tr" style="top: 6px; right: 6px;"></span>
                            <span class="bracket-bl" style="bottom: 6px; left: 6px;"></span>
                            <span class="bracket-br" style="bottom: 6px; right: 6px;"></span>
                            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                                 style="background-image: url('{project.img}'); filter: contrast(1.04) saturate(0.95);"></div>
                            <div class="absolute inset-0 bg-gradient-to-t from-ink/40 via-ink/0 to-transparent"></div>

                            <!-- Photo number stamp -->
                            <div class="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase bg-paper/95 text-ink px-2 py-1 rounded-sm border border-ink/15">
                                № {String(i + 1).padStart(2, '0')}
                            </div>
                        </div>

                        <!-- Caption -->
                        <div class="pt-4 lg:pt-5 pb-1 px-1">
                            <div class="flex items-center justify-between mb-2 gap-3">
                                <span class="font-mono text-[10px] tracking-widest uppercase text-hivis-deep">{project.type}</span>
                                <span class="font-mono text-[10px] tracking-widest uppercase text-steel">{project.ticket}</span>
                            </div>
                            <h3 class="font-display text-ink text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-3">
                                {project.title}
                            </h3>
                            <p class="text-ink-soft text-[15px] leading-relaxed mb-4">{project.description}</p>
                            <div class="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-steel pt-3 border-t border-ink/12">
                                <MapPin size={12} weight="bold" />
                                {project.location}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
