<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let openIndex: number | null = null;

    const faqs = [
        {
            q: "What areas do you serve?",
            a: "We serve Pottstown and the surrounding areas including Boyertown, Phoenixville, Limerick, Collegeville, Royersford, and most of Montgomery and Chester Counties in Pennsylvania.",
        },
        {
            q: "Are you licensed and insured?",
            a: "Yes. Hoehne Property Maintenance & Remodeling LLC is fully insured. We carry general liability insurance on every job, giving you complete peace of mind.",
        },
        {
            q: "How do I get an estimate?",
            a: "Call or text us at (610) 412-6424, or fill out the contact form below. We'll schedule a free on-site visit and provide a written estimate with no obligation.",
        },
        {
            q: "How soon can you start?",
            a: "It depends on the current schedule, but we always try to be upfront about availability. For urgent repairs, we do our best to get to you quickly. Call us and we'll give you an honest timeline.",
        },
        {
            q: "What types of remodeling do you do?",
            a: "We handle kitchens, bathrooms, basements, decks, interior and exterior painting, flooring, drywall, and full-room renovations. If you're not sure if we do it, just ask.",
        },
        {
            q: "Do you offer snow removal contracts?",
            a: "Yes. We offer seasonal snow removal for both residential and commercial properties in the Pottstown area. Reach out before the season starts to lock in your spot.",
        },
    ];

    onMount(() => {
        gsap.from(".faq-item", {
            scrollTrigger: { trigger: sectionRef, start: "top 80%" },
            y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        });
    });

    function toggle(i: number) {
        openIndex = openIndex === i ? null : i;
    }
</script>

<section bind:this={sectionRef} id="faq" class="py-24 lg:py-32 bg-ind-surface relative z-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 06 // FAQ</div>
            <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-ind-accent"></span> Common Questions
            </h2>
            <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl">
                Straight Answers
            </h3>
        </div>

        <div class="max-w-3xl space-y-2">
            {#each faqs as faq, i}
                <div class="faq-item border border-ind-border/30 hover:border-ind-accent/30 transition-colors duration-300">
                    <button
                        on:click={() => toggle(i)}
                        class="w-full text-left px-6 py-5 flex items-center justify-between gap-4 bg-transparent"
                    >
                        <span class="font-bold text-white uppercase tracking-tight text-sm">{String(i+1).padStart(2,'0')} {faq.q}</span>
                        <span class="text-ind-accent text-xl font-bold shrink-0 transition-transform duration-300 {openIndex === i ? 'rotate-45' : ''}">+</span>
                    </button>
                    {#if openIndex === i}
                        <div class="px-6 pb-5 text-ind-steel text-sm leading-relaxed border-t border-ind-border/20 pt-4">
                            {faq.a}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
