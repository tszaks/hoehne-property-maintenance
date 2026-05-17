<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { Wrench, Home, Paintbrush, Leaf, Snowflake, Hammer, ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const services = [
        {
            id: "01",
            title: "Home Remodeling",
            description: "Kitchens, bathrooms, basements, and full-scale home renovations built to last. No job too big.",
            icon: Home,
        },
        {
            id: "02",
            title: "Handyman Services",
            description: "Honey-do lists, drywall, doors, fixtures, carpentry — the small stuff done properly, on schedule.",
            icon: Wrench,
        },
        {
            id: "03",
            title: "Interior & Exterior Painting",
            description: "Clean prep, quality product, clean finish. Walls, trim, ceilings, decks, siding — inside and out.",
            icon: Paintbrush,
        },
        {
            id: "04",
            title: "Lawn Care & Landscaping",
            description: "Mowing, trimming, cleanups, and seasonal yard maintenance to keep your property looking sharp.",
            icon: Leaf,
        },
        {
            id: "05",
            title: "Snow Removal",
            description: "Driveways, walkways, and commercial lots cleared fast. Don't get stuck — call before the storm.",
            icon: Snowflake,
        },
        {
            id: "06",
            title: "Decks & Outdoor Structures",
            description: "New deck builds, repairs, pressure washing, and staining. Outdoor spaces built to enjoy.",
            icon: Hammer,
        },
    ];

    onMount(() => {
        gsap.from(".service-card", {
            scrollTrigger: { trigger: sectionRef, start: "top 80%" },
            y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="services" class="py-24 lg:py-32 bg-ind-bg relative z-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 02 // SERVICES</div>
            <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-ind-accent"></span> What We Handle
            </h2>
            <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl">
                No Job Too Small. No Job Too Big.
            </h3>
            <p class="text-ind-steel mt-4 max-w-xl leading-relaxed">
                From a leaky faucet to a full basement finish — we handle it all. One number, one crew, one standard of quality.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ind-border/20">
            {#each services as service}
                <div class="service-card bg-ind-bg p-8 group hover:bg-ind-surface transition-colors duration-300 relative overflow-hidden">
                    <div class="ind-metadata text-ind-accent mb-6 opacity-40">{service.id}</div>
                    <div class="w-10 h-10 border border-ind-border/30 flex items-center justify-center mb-6 group-hover:border-ind-accent transition-colors duration-300">
                        <svelte:component this={service.icon} size={18} class="text-ind-accent" />
                    </div>
                    <h4 class="text-xl font-bold text-white uppercase tracking-tight mb-3">{service.title}</h4>
                    <p class="text-ind-steel text-sm leading-relaxed">{service.description}</p>
                    <div class="absolute bottom-0 left-0 w-0 h-[2px] bg-ind-accent group-hover:w-full transition-all duration-500"></div>
                </div>
            {/each}
        </div>

        <div class="mt-12 flex justify-center">
            <a href="#contact" class="ind-button inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider">
                Get a Free Estimate <ArrowRight size={16} />
            </a>
        </div>
    </div>
</section>
