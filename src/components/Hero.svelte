<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    let title1: HTMLElement;
    let title2Wrapper: HTMLElement;
    let subtitle: HTMLElement;
    let scrollIndicator: HTMLElement;
    let chars: HTMLElement[] = [];
    let liquidDisplacements: SVGElement[] = [];
    let liquidTurbulences: SVGElement[] = [];

    const digitalChars = "EXECUTIVE".split("");
    const alchemyChars = "MASTERY".split("");
    const allChars = [...digitalChars, ...alchemyChars];

    onMount(() => {
        const tl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 2 },
        });

        tl.fromTo(
            title1,
            { y: 60, opacity: 0, scale: 0.98, filter: "blur(10px)" },
            { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", delay: 0.4 },
        )
            .fromTo(
                title2Wrapper,
                { y: 60, opacity: 0, scale: 0.98, filter: "blur(10px)" },
                { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
                "-=1.8",
            )
            .fromTo(
                subtitle,
                { opacity: 0, y: 20, filter: "blur(5px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 2 },
                "-=1.5",
            )
            .fromTo(
                scrollIndicator,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0 },
                "-=1",
            );

        // Parallax Glow
        gsap.to(".hero-glow", {
            y: 100,
            scale: 1.1,
            scrollTrigger: {
                trigger: "section",
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });
    });

    function handleMouseMove(e: MouseEvent) {
        if (!chars.length) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const radius = 125; // Interaction radius (Reduced by 50%)

        chars.forEach((char, i) => {
            if (!char) return;
            const rect = char.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;

            const dx = mouseX - charCenterX;
            const dy = mouseY - charCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                // Calculate repulsion
                const force = (radius - distance) / radius; // 0 to 1
                const angle = Math.atan2(dy, dx);

                // Liquid motion: Move AWAY from cursor but with a fluid feel
                const moveDist = force * 80;
                const moveX = -Math.cos(angle) * moveDist;
                const moveY = -Math.sin(angle) * moveDist;

                // Physical Distortion (Squish/Stretch)
                const scaleX = 1 + force * 0.2;
                const scaleY = 1 - force * 0.1;

                gsap.to(char, {
                    x: moveX,
                    y: moveY,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    color: "#C6A552",
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: "auto",
                });

                // Liquid Filter Distortion
                // We animate the 'scale' of displacement and 'baseFrequency' of turbulence
                if (liquidDisplacements[i] && liquidTurbulences[i]) {
                    gsap.to(liquidDisplacements[i], {
                        attr: { scale: force * 150 }, // Increased scale since blur softens the effect
                        duration: 0.8,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                    gsap.to(liquidTurbulences[i], {
                        attr: { baseFrequency: 0.015 + force * 0.02 }, // Much smaller frequency change
                        duration: 0.8,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                }
            } else {
                // Return to base
                gsap.to(char, {
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    color: "#0a0a0a",
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)",
                    overwrite: "auto",
                });

                if (liquidDisplacements[i] && liquidTurbulences[i]) {
                    gsap.to(liquidDisplacements[i], {
                        attr: { scale: 0 },
                        duration: 1.5,
                        ease: "power2.out", // Elastic looks weird on liquid return
                        overwrite: "auto",
                    });
                    gsap.to(liquidTurbulences[i], {
                        attr: { baseFrequency: 0.015 },
                        duration: 1.5,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                }
            }
        });
    }

    function handleMouseLeave() {
        // Reset all chars
        chars.forEach((char, i) => {
            if (!char) return;
            gsap.to(char, {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                color: "#0a0a0a",
                duration: 1.2,
                ease: "elastic.out(1, 0.3)",
            });
            if (liquidDisplacements[i] && liquidTurbulences[i]) {
                gsap.to(liquidDisplacements[i], {
                    attr: { scale: 0 },
                    duration: 1.5,
                    ease: "power2.out",
                });
                gsap.to(liquidTurbulences[i], {
                    attr: { baseFrequency: 0.015 },
                    duration: 1.5,
                    ease: "power2.out",
                });
            }
        });
    }
</script>

<section
    class="relative h-[110vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
>
    <div
        class="relative z-10 space-y-2 md:space-y-4 select-none pointer-events-none"
    >
        <!-- Liquid Filters -->
        <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
            <defs>
                {#each allChars as _, i}
                    <filter id="liquid-{i}">
                        <feTurbulence
                            bind:this={liquidTurbulences[i]}
                            type="fractalNoise"
                            baseFrequency="0.015"
                            numOctaves="1"
                            result="turbulence"
                        />
                        <feGaussianBlur
                            in="turbulence"
                            stdDeviation="6"
                            result="smoothedTurbulence"
                        />
                        <feDisplacementMap
                            bind:this={liquidDisplacements[i]}
                            in="SourceGraphic"
                            in2="smoothedTurbulence"
                            scale="0"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                {/each}
            </defs>
        </svg>

        <div class="overflow-visible uppercase">
            <div
                bind:this={title1}
                class="flex items-center justify-center pointer-events-auto"
            >
                {#each digitalChars as char, i}
                    <h1
                        bind:this={chars[i]}
                        class="text-5xl md:text-[8rem] lg:text-[10rem] font-extrabold tracking-tightest leading-[0.85] text-[#0a0a0a] drop-shadow-[0_10px_10px_rgba(0,0,0,0.02)] transition-colors cursor-default inline-block will-change-transform origin-center"
                        style="filter: url(#liquid-{i});"
                    >
                        {char}
                    </h1>
                {/each}
            </div>
        </div>
        <div
            class="overflow-visible uppercase flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        >
            <div
                bind:this={title2Wrapper}
                class="flex items-center justify-center pointer-events-auto"
            >
                {#each alchemyChars as char, i}
                    <h1
                        bind:this={chars[i + digitalChars.length]}
                        class="alchemy-char text-5xl md:text-[8rem] lg:text-[10rem] font-extrabold tracking-tightest leading-[0.85] text-[#0a0a0a] drop-shadow-[0_10px_10px_rgba(0,0,0,0.02)] transition-colors cursor-default inline-block will-change-transform origin-center"
                        style="filter: url(#liquid-{i + digitalChars.length});"
                    >
                        {char}
                    </h1>
                {/each}
            </div>
            <span
                class="serif text-4xl md:text-[6rem] text-accent mt-4 md:mt-0 font-normal low-tracking opacity-90 animate-bounce-slow"
            >
            </span>
        </div>

        <div
            bind:this={subtitle}
            class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pt-8 md:pt-24"
        >
            <p
                class="text-apple-500 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase"
            >
                EST. 1993 · GNA INC.
            </p>
            <div class="h-[1px] w-12 bg-apple-200 hidden md:block"></div>
            <p
                class="text-apple-500 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase"
            >
                Executive Consulting
            </p>
        </div>
    </div>

    <div
        bind:this={scrollIndicator}
        class="absolute bottom-12 flex flex-col items-center gap-4"
    >
        <span
            class="text-[9px] font-bold tracking-[0.5em] text-apple-600 uppercase"
            >Scroll to Explore</span
        >
        <div
            class="w-[1px] h-12 bg-gradient-to-b from-apple-600 to-transparent"
        ></div>
    </div>
</section>
