<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const projects = [
        {
            id: "01",
            title: "Phoenix Restoration Co.",
            category: "EXIT STRATEGY",
            metric: "Owner writing half the revenue himself — Greg installed a GM, built the team, and they scaled to $25M before selling to a national acquirer.",
            value: "$7M → $25M",
            image: "/phoenix-skyline.jpg",
        },
        {
            id: "02",
            title: "Carolina Restoration Group",
            category: "SUCCESSION PLANNING",
            metric: "Owner exhausted after 20+ years as sole driver. Greg built a management team around a promoted GM, doubled revenue, and helped make the company strong enough to sell to a national firm.",
            value: "$7M → $14M",
            image: "https://images.unsplash.com/photo-1768321917806-b4b6fbbef837?auto=format&fit=crop&q=80",
        },
        {
            id: "03",
            title: "Highland Construction",
            category: "EXIT-READY OPERATIONS",
            metric: "Kenny was working 7 days a week with every decision flowing through him. Greg installed a GM, rebuilt the team structure, and created the kind of operating depth that lifted margins and opened two new branches.",
            value: "2 New Branches",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
        },
    ];

    let sectionRef: HTMLElement;
    let cardRefs: HTMLElement[] = [];

    onMount(() => {
        gsap.from(".cases-header", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        cardRefs.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                y: 80,
                opacity: 0,
                duration: 0.9,
                delay: i * 0.15,
                ease: "power3.out",
            });
        });
    });
</script>

<section
    bind:this={sectionRef}
    id="projects"
    class="py-24 lg:py-32 bg-[#0a0a0a] relative z-10"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
            class="cases-header mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ind-border pb-8"
        >
            <div>
                <div class="ind-metadata mb-4">
                    SEC. 04 // RESULTS // CLIENT WINS
                </div>
                <h2
                    class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4"
                >
                    <span class="w-12 h-[1px] bg-ind-accent"></span> Track Record
                </h2>
                <h3
                    class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase"
                >
                    Exit-Focused Results
                </h3>
            </div>
            <a
                href="#contact"
                class="text-ind-fg hover:text-white font-semibold uppercase tracking-wider text-sm flex items-center gap-2 group transition-colors"
            >
                Start Your Exit Plan
                <ArrowRight
                    size={16}
                    class="transform transition-transform group-hover:translate-x-1"
                />
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {#each projects as project, i}
                <div
                    bind:this={cardRefs[i]}
                    class="group relative bg-ind-surface overflow-hidden"
                >
                    <!-- Image -->
                    <div class="aspect-[4/3] overflow-hidden">
                        <div
                            class="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                            style="background-image: url('{project.image}')"
                        ></div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 md:p-8">
                        <div class="flex items-center justify-between mb-4">
                            <span class="ind-metadata text-ind-accent text-xs"
                                >{project.category}</span
                            >
                            <span
                                class="text-2xl font-black tracking-tighter text-white"
                                >{project.value}</span
                            >
                        </div>
                        <h4
                            class="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-3"
                        >
                            {project.title}
                        </h4>
                        <p class="text-ind-steel text-sm leading-relaxed">
                            {project.metric}
                        </p>
                    </div>

                    <!-- Bottom accent line -->
                    <div
                        class="absolute bottom-0 left-0 w-full h-[2px] bg-ind-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    ></div>

                    <!-- Fasteners -->
                    <div class="ind-fastener top-3 right-3"></div>
                    <div class="ind-fastener bottom-3 left-3"></div>
                </div>
            {/each}
        </div>
    </div>
</section>
