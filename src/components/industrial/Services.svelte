<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let servicesContainer: HTMLElement;
    let cards: HTMLElement[] = [];
    let headerRef: HTMLElement;

    const services = [
        {
            id: "01",
            title: "One-to-One Coaching",
            description:
                "Full-service business coaching that touches every area of your company. Unlimited support for ownership, leadership, accountability, sales, financial management, and team performance.",
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80",
        },
        {
            id: "02",
            title: "Succession & Exit",
            description:
                "You've built it for years — now cash out. In 2–3 years we get your financials strong and operations buttoned up to attract the best possible sale price.",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
        },
        {
            id: "03",
            title: "Mastermind Groups",
            description:
                "Monthly peer-to-peer sessions for restoration owners and GMs. Share challenges, get perspective from non-competing peers, and accelerate results faster than you can alone.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
        },
        {
            id: "04",
            title: "Team & Culture",
            description:
                "Build a management team that becomes the driving force of your business. Hire right, coach effectively, and create a culture where every employee gives their best — every day.",
            image: "https://images.unsplash.com/photo-1714974528737-3e6c7e4d11af?auto=format&fit=crop&q=80",
        },
    ];

    onMount(() => {
        // Header reveal
        gsap.from(headerRef, {
            scrollTrigger: {
                trigger: headerRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        // Waterfall cascade — each card gets delay based on grid position
        cards.forEach((card, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const delay = row * 0.2 + col * 0.15;

            gsap.from(card, {
                scrollTrigger: {
                    trigger: servicesContainer,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                scale: 0.92,
                filter: "blur(4px)",
                duration: 0.9,
                delay: delay,
                ease: "power3.out",
            });
        });

    });
</script>

<section id="services" class="py-24 lg:py-32 bg-[#0a0a0a] relative z-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
            bind:this={headerRef}
            class="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ind-border pb-8"
        >
            <div>
                <div class="ind-metadata mb-4">
                    SEC. 02 // SERVICES // PROGRAMS
                </div>
                <h2
                    class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4"
                >
                    <span class="w-12 h-[1px] bg-ind-accent"></span> Coaching Programs
                </h2>
                <h3
                    class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl"
                >
                    Built for Restoration Owners
                </h3>
            </div>
            <p class="text-ind-steel max-w-md text-sm md:text-base font-medium">
                Every program is built around one goal: getting you out of
                the day-to-day so your business runs without you holding
                it together.
            </p>
        </div>

        <div
            bind:this={servicesContainer}
            class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
            {#each services as service, i}
                <div
                    bind:this={cards[i]}
                    class="group relative overflow-hidden bg-ind-surface aspect-[4/3] md:aspect-square lg:aspect-[4/3]"
                >
                    <!-- Background Image with Curtain Reveal -->
                    <div
                        class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-90"
                        style="background-image: url('{service.image}')"
                    ></div>

                    <!-- Gradient overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"
                    ></div>

                    <!-- Content -->
                    <div
                        class="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10"
                    >
                        <div
                            class="text-ind-accent font-black text-2xl tracking-tighter mix-blend-screen"
                        >
                            {service.id}
                        </div>

                        <div
                            class="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                        >
                            <h4
                                class="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tight"
                            >
                                {service.title}
                            </h4>
                            <p
                                class="text-ind-steel text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                            >
                                {service.description}
                            </p>
                        </div>
                    </div>

                    <!-- Hover reveal border -->
                    <div
                        class="absolute inset-0 border-2 border-ind-accent scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 pointer-events-none"
                    ></div>

                    <!-- Fasteners Details -->
                    <div class="ind-fastener top-3 left-3"></div>
                    <div class="ind-fastener top-3 right-3"></div>
                    <div class="ind-fastener bottom-3 left-3"></div>
                    <div class="ind-fastener bottom-3 right-3"></div>
                </div>
            {/each}
        </div>
    </div>
</section>
