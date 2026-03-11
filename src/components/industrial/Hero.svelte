<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "lucide-svelte";
    import ThreeBackground from "./ThreeBackground.svelte";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let containerElement: HTMLElement;
    let imageContainer: HTMLElement;
    let statsElements: HTMLElement[] = [];
    let rulerRef: HTMLElement;
    let crosshairRefs: HTMLElement[] = [];

    // Character splitting helper
    function splitText(text: string): string {
        return text
            .split("")
            .map(
                (char) =>
                    `<span class="inline-block overflow-hidden"><span class="char-anim inline-block" style="transform:translateY(120%)">${char === " " ? "&nbsp;" : char}</span></span>`,
            )
            .join("");
    }

    // Counter animation
    function animateCounter(
        el: HTMLElement,
        target: number,
        suffix: string = "",
    ) {
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2.5,
            delay: 0.2,
            ease: "power2.out",
            snap: { val: 1 },
            onUpdate: () => {
                el.textContent = Math.round(obj.val) + suffix;
            },
        });
    }

    onMount(() => {
        const tl = gsap.timeline();

        // Subtle scale down of image container on load
        tl.fromTo(
            imageContainer,
            { scale: 1.1, opacity: 0, filter: "brightness(0.5)" },
            {
                scale: 1,
                opacity: 1,
                filter: "brightness(1)",
                duration: 2,
                ease: "power3.out",
            },
        )
            // Character stagger animation
            .to(
                ".char-anim",
                {
                    y: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: "power4.out",
                },
                "-=1.5",
            )
            // Fade in descriptive text and button
            .fromTo(
                ".hero-fade-up",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                },
                "-=0.3",
            )
            // Stagger stats
            .fromTo(
                statsElements,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                },
                "-=0.4",
            );

        // Parallax on background image
        gsap.to(imageContainer, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerElement,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Ruler parallax
        gsap.to(rulerRef, {
            yPercent: 60,
            ease: "none",
            scrollTrigger: {
                trigger: containerElement,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Crosshairs parallax (fastest layer — creates depth)
        crosshairRefs.forEach((ref) => {
            gsap.to(ref, {
                yPercent: -80,
                ease: "none",
                scrollTrigger: {
                    trigger: containerElement,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        });

        // Counter animations — fire after stats are visible
        const statValueEls = containerElement.querySelectorAll(".stat-counter");
        // Delay counters to fire AFTER the main timeline completes (~2.5s)
        setTimeout(() => {
            statValueEls.forEach((el) => {
                const target = parseInt(el.getAttribute("data-target") || "0");
                const suffix = el.getAttribute("data-suffix") || "";
                if (target > 0) {
                    animateCounter(el as HTMLElement, target, suffix);
                }
            });
        }, 2000);
    });
</script>

<section
    bind:this={containerElement}
    class="relative min-h-[100dvh] flex items-center pt-32 lg:pt-24 pb-16 lg:pb-12 overflow-hidden bg-ind-bg"
>
    <!-- Massive Background Image/Video Placeholder -->
    <div class="absolute inset-0 z-0 overflow-hidden">
        <div
            class="absolute inset-0 bg-gradient-to-t from-ind-bg via-ind-bg/80 to-ind-bg/30 z-20"
        ></div>
        <div
            bind:this={imageContainer}
            class="w-full h-full bg-cover bg-center origin-center filter grayscale opacity-20"
            style="background-image: url('https://images.unsplash.com/photo-1723367194881-fe2e53534170?auto=format&fit=crop&w=2000&q=80');"
        ></div>
        <div
            class="absolute inset-0 ind-blueprint opacity-20 z-30 mix-blend-screen pointer-events-none"
        ></div>
    </div>

    <div
        class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end"
    >
        <!-- Structural Aesthetics with Parallax Depth -->
        <div
            bind:this={rulerRef}
            class="ind-ruler-y absolute bottom-12 left-4 h-64 opacity-20 hidden lg:block"
        ></div>
        <div
            bind:this={crosshairRefs[0]}
            class="ind-crosshair -top-4 -left-4 hidden lg:flex"
        ></div>
        <div
            bind:this={crosshairRefs[1]}
            class="ind-crosshair -top-4 -right-4 hidden lg:flex"
        ></div>

        <!-- Main Content with Character Stagger -->
        <div class="lg:col-span-8 flex flex-col justify-end">
            <h1
                class="ind-hero-title text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] font-black text-white tracking-tighter uppercase mb-8"
            >
                <span class="block overflow-hidden pb-2"
                    ><span class="title-line block">BUILDING</span></span
                >
                <span class="block overflow-hidden pb-2"
                    ><span class="title-line block text-ind-accent">BETTER</span
                    ></span
                >
                <span class="block overflow-hidden pb-2"
                    ><span class="title-line block">LEADERS</span></span
                >
            </h1>

            <!-- Subtitle -->
            <p
                class="hero-fade text-lg md:text-xl text-ind-steel max-w-xl mx-auto lg:mx-0 mb-12 font-medium"
            >
                30 years. 300+ clients. One mission: turn restoration and
                construction owners into true leaders — and their businesses
                into machines that run without them.
            </p>

            <div class="hero-fade-up flex flex-wrap items-center gap-6">
                <a
                    href="#about"
                    class="ind-metadata text-white hover:text-ind-accent transition-colors flex items-center gap-2"
                >
                    MEET GREG NEIL <span
                        class="w-8 h-[1px] bg-ind-border group-hover:bg-ind-accent transition-colors"
                    ></span>
                </a>
            </div>
        </div>

        <!-- Right side stats with Counter Animation -->
        <div
            class="lg:col-span-4 flex lg:flex-col gap-8 lg:gap-12 justify-end pb-4 border-t lg:border-t-0 lg:border-l border-ind-border/50 pt-8 lg:pt-0 lg:pl-12"
        >
            <div bind:this={statsElements[0]}>
                <div
                    class="stat-counter text-3xl lg:text-5xl font-black tracking-tighter text-white mb-1"
                    data-target="300"
                    data-suffix="+"
                >
                    0
                </div>
                <div
                    class="text-xs uppercase tracking-widest text-ind-steel font-semibold"
                >
                    Clients Coached
                </div>
            </div>
            <div bind:this={statsElements[1]}>
                <div
                    class="stat-counter text-3xl lg:text-5xl font-black tracking-tighter text-white mb-1"
                    data-target="30"
                    data-suffix=""
                >
                    0
                </div>
                <div
                    class="text-xs uppercase tracking-widest text-ind-steel font-semibold"
                >
                    Years Experience
                </div>
            </div>
            <div bind:this={statsElements[2]}>
                <div
                    class="stat-counter text-3xl lg:text-5xl font-black tracking-tighter text-white mb-1"
                    data-target="8000"
                    data-suffix="+"
                >
                    0
                </div>
                <div
                    class="text-xs font-bold text-ind-steel tracking-widest uppercase mt-2"
                >
                    Weekly Meetings Led
                </div>
            </div>
        </div>
    </div>
</section>
