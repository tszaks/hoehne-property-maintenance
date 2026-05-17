<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { Phone, ArrowRight } from "lucide-svelte";

    let containerElement: HTMLElement;

    function scrollToContact() {
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }

    onMount(() => {
        gsap.fromTo(".hero-fade",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out", delay: 0.1 }
        );
    });
</script>

<!-- HERO -->
<section bind:this={containerElement} class="relative min-h-[100dvh] flex flex-col bg-ind-bg overflow-hidden">

    <!-- Photo grid background — 2x2 on desktop, stacked on mobile -->
    <div class="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 opacity-30">
        <div class="bg-cover bg-center" style="background-image:url('/work/project-3.jpg')"></div>
        <div class="bg-cover bg-center" style="background-image:url('/work/project-4.jpg')"></div>
        <div class="bg-cover bg-top"   style="background-image:url('/work/project-2.jpg')"></div>
        <div class="bg-cover bg-top"   style="background-image:url('/work/project-1.jpg')"></div>
    </div>
    <!-- Dark overlay -->
    <div class="absolute inset-0 z-10 bg-gradient-to-b from-ind-bg/70 via-ind-bg/60 to-ind-bg"></div>

    <!-- Content -->
    <div class="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">

        <div class="hero-fade ind-metadata text-ind-accent mb-4 tracking-widest">
            VETERAN OWNED — POTTSTOWN, PA — 20 YEARS
        </div>

        <h1 class="hero-fade text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.88] mb-6 max-w-3xl">
            Your Home.<br /><span class="text-ind-accent">Done Right.</span>
        </h1>

        <p class="hero-fade text-ind-steel text-base sm:text-lg max-w-md leading-relaxed mb-10">
            Property maintenance & remodeling — from a leaky faucet to a full kitchen. One call handles it all.
        </p>

        <div class="hero-fade flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <a href="tel:+16104126424"
                class="ind-button flex items-center justify-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest">
                <Phone size={16} />(610) 412-6424
            </a>
            <button on:click={scrollToContact}
                class="flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-widest border border-ind-border/50 text-white hover:border-ind-accent hover:text-ind-accent transition-all duration-300">
                Free Estimate <ArrowRight size={16} />
            </button>
        </div>
    </div>

    <!-- Scroll hint -->
    <div class="relative z-20 flex justify-center pb-8">
        <div class="w-[1px] h-12 bg-gradient-to-b from-ind-accent to-transparent"></div>
    </div>
</section>
