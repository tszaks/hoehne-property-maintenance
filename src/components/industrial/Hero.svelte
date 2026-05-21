<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { Phone, ArrowRight } from "phosphor-svelte";

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

    <!-- Photo grid background. Brighter real work, less moody texture. -->
    <div class="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 opacity-40">
        <div class="bg-cover bg-center" style="background-image:url('/work/project-3.jpg')"></div>
        <div class="bg-cover bg-center" style="background-image:url('/work/project-4.jpg')"></div>
        <div class="bg-cover bg-top"   style="background-image:url('/work/project-2.jpg')"></div>
        <div class="bg-cover bg-top"   style="background-image:url('/work/project-1.jpg')"></div>
    </div>
    <!-- Dark overlay -->
    <div class="absolute inset-0 z-10 bg-gradient-to-b from-ind-bg/65 via-ind-bg/58 to-ind-bg"></div>

    <!-- Content -->
    <div class="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">

        <div class="hero-fade ind-metadata text-ind-steel mb-5">
            Veteran owned · Pottstown, PA · Licensed and insured
        </div>

        <h1 class="hero-fade text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[0.95] mb-6 max-w-3xl">
            Your home, <span class="text-ind-accent">done right.</span>
        </h1>

        <p class="hero-fade text-ind-steel text-base sm:text-lg max-w-lg leading-relaxed mb-10">
            Honest remodels and repairs for homeowners in Pottstown, Spring City, Royersford, and across the OJR school district.
        </p>

        <div class="hero-fade flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <a href="tel:+16104126424"
                class="ind-button flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-wide">
                <Phone size={16} />(610) 412-6424
            </a>
            <button on:click={scrollToContact}
                class="ind-button-outline flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-wide">
                Free estimate <ArrowRight size={16} />
            </button>
        </div>
    </div>

    <!-- Scroll hint -->
    <div class="relative z-20 flex justify-center pb-8">
        <div class="w-[1px] h-10 bg-gradient-to-b from-ind-steel/40 to-transparent"></div>
    </div>
</section>
