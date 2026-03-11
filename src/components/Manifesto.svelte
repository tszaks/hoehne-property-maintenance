<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    let section: HTMLElement;
    let lines: HTMLElement[] = [];
    let separator: HTMLElement;

    onMount(() => {
        // Elegant Staggered Text Reveal
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "bottom center",
                toggleActions: "play none none reverse",
            },
        });

        // Separator Line Growth
        tl.fromTo(
            separator,
            { width: 0, opacity: 0 },
            { width: "60px", opacity: 1, duration: 1.5, ease: "power3.inOut" },
        );

        // Text Lines Reveal (Fade Up + Blur removal)
        tl.fromTo(
            lines,
            { y: 40, opacity: 0, filter: "blur(10px)" },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                stagger: 0.15,
                duration: 1.5,
                ease: "power2.out",
            },
            "-=1.0",
        );
    });
</script>

<section
    bind:this={section}
    class="relative py-32 lg:py-48 px-6 flex flex-col items-center justify-center text-center bg-[#fdfdfc]"
>
    <div class="max-w-4xl mx-auto space-y-12 flex flex-col items-center">
        <!-- Elegant Separator -->
        <div bind:this={separator} class="h-[1px] bg-black/80"></div>

        <!-- The Definition -->
        <div class="space-y-6 md:space-y-8">
            <h2
                bind:this={lines[0]}
                class="text-xs md:text-sm font-bold tracking-[0.6em] uppercase text-black/40"
            >
                The Architecture
            </h2>

            <p
                bind:this={lines[1]}
                class="text-2xl md:text-5xl leading-relaxed md:leading-tight font-serif italic text-black/90"
            >
                Executive reconstruction is the art of <span
                    class="bg-gradient-to-r from-accent to-[#b88a2d] bg-clip-text text-transparent"
                    >radical profit</span
                > applied to business.
            </p>

            <p
                bind:this={lines[2]}
                class="text-lg md:text-xl text-black/50 font-medium max-w-2xl mx-auto leading-loose"
            >
                We provide the structural foundations for restoration and
                construction owners to stop being the technician and start being
                the executive.
            </p>
        </div>
    </div>
</section>
