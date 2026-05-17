<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight, Phone } from "lucide-svelte";
    import ThreeBackground from "./ThreeBackground.svelte";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let containerElement: HTMLElement;
    let imageContainer: HTMLElement;
    let statsElements: HTMLElement[] = [];
    let rulerRef: HTMLElement;
    let crosshairRefs: HTMLElement[] = [];

    function splitText(text: string): string {
        return text.split("").map((char) =>
            `<span class="inline-block overflow-hidden"><span class="char-anim inline-block" style="transform:translateY(120%)">${char === " " ? "&nbsp;" : char}</span></span>`
        ).join("");
    }

    function animateCounter(el: HTMLElement, target: number, suffix: string = "") {
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target, duration: 2.5, delay: 0.2, ease: "power2.out",
            snap: { val: 1 },
            onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
        });
    }

    onMount(() => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const tl = gsap.timeline();

        tl.fromTo(imageContainer,
            { scale: 1.1, opacity: 0, filter: "brightness(0.5)" },
            { scale: 1, opacity: 1, filter: "brightness(1)", duration: 2, ease: "power3.out" }
        )
        .to(".char-anim", { y: 0, duration: 0.8, stagger: 0.03, ease: "power4.out" }, "-=1.5")
        .fromTo(".hero-fade-up", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3")
        .fromTo(statsElements, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4");

        gsap.to(imageContainer, {
            yPercent: isMobile ? 52 : 30, ease: "none",
            scrollTrigger: { trigger: containerElement, start: "top top", end: "bottom top", scrub: true },
        });

        gsap.to(rulerRef, {
            yPercent: 60, ease: "none",
            scrollTrigger: { trigger: containerElement, start: "top top", end: "bottom top", scrub: true },
        });

        crosshairRefs.forEach((ref) => {
            gsap.to(ref, {
                yPercent: -80, ease: "none",
                scrollTrigger: { trigger: containerElement, start: "top top", end: "bottom top", scrub: true },
            });
        });

        setTimeout(() => {
            const statValueEls = containerElement.querySelectorAll(".stat-counter");
            statValueEls.forEach((el) => {
                const target = parseInt(el.getAttribute("data-target") || "0");
                const suffix = el.getAttribute("data-suffix") || "";
                if (target > 0) animateCounter(el as HTMLElement, target, suffix);
            });
        }, 2000);
    });
</script>

<section bind:this={containerElement}
    class="relative min-h-[100dvh] flex items-center pt-32 lg:pt-24 pb-16 lg:pb-12 overflow-hidden bg-ind-bg">
    
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-ind-bg via-ind-bg/80 to-ind-bg/30 z-20"></div>
        <div bind:this={imageContainer}
            class="w-full h-full bg-cover bg-center origin-center filter grayscale opacity-20"
            style="background-image: url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=80');">
        </div>
        <div class="absolute inset-0 ind-blueprint opacity-20 z-30 mix-blend-screen pointer-events-none"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
        <!-- Structural Aesthetics -->
        <div bind:this={rulerRef} class="ind-ruler-y absolute bottom-12 left-4 h-64 opacity-20 hidden lg:block"></div>
        <div bind:this={crosshairRefs[0]} class="ind-crosshair -top-4 -left-4 hidden lg:flex"></div>
        <div bind:this={crosshairRefs[1]} class="ind-crosshair -top-4 -right-4 hidden lg:flex"></div>

        <!-- Main Content -->
        <div class="lg:col-span-8 flex flex-col justify-end">
            <div class="hero-fade-up ind-metadata text-ind-accent mb-4">
                VETERAN OWNED & OPERATED — POTTSTOWN, PA
            </div>
            <h1 class="ind-hero-title text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] font-black text-white tracking-tighter uppercase mb-8">
                <span class="block overflow-hidden pb-2">
                    {@html splitText("YOUR HOME,")}
                </span>
                <span class="block overflow-hidden pb-2 text-ind-accent">
                    {@html splitText("DONE RIGHT.")}
                </span>
            </h1>

            <p class="hero-fade-up text-lg md:text-xl text-ind-steel max-w-xl leading-relaxed mb-8">
                From small repairs to full home renovations — Hoehne Property Maintenance & Remodeling brings 20 years of hands-on experience to every job in Pottstown and surrounding Montgomery & Chester Counties.
            </p>

            <div class="hero-fade-up flex flex-col sm:flex-row gap-4">
                <a href="tel:+16104126424"
                    class="ind-button inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider">
                    <Phone size={16} /> Call (610) 412-6424
                </a>
                <a href="#contact"
                    class="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider border border-ind-border/50 text-white hover:border-ind-accent hover:text-ind-accent transition-all duration-300">
                    Free Estimate <ArrowRight size={16} />
                </a>
            </div>
        </div>

        <!-- Stats -->
        <div class="lg:col-span-4 flex flex-col gap-6 lg:pb-4">
            {#each [
                { target: 20, suffix: "+", label: "Years Experience" },
                { target: 500, suffix: "+", label: "Jobs Completed" },
                { target: 100, suffix: "%", label: "Veteran Owned" },
            ] as stat, i}
                <div bind:this={statsElements[i]} class="border-l-2 border-ind-accent pl-4">
                    <div class="text-3xl lg:text-4xl font-black text-white tracking-tighter">
                        <span class="stat-counter" data-target={stat.target} data-suffix={stat.suffix}>0{stat.suffix}</span>
                    </div>
                    <div class="ind-metadata text-ind-steel mt-1">{stat.label}</div>
                </div>
            {/each}
        </div>
    </div>
</section>
