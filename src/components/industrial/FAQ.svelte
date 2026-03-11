<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ChevronDown } from "lucide-svelte";
    import { slide } from "svelte/transition";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    const faqs = [
        {
            question: "Who is your ideal client?",
            answer: "Restoration and construction business owners doing between $5M and $35M annually. You're good at the craft — but you're still stuck in the business, doing too much yourself, and not sure how to build a team that actually runs things without you.",
        },
        {
            question: "How quickly do clients see results?",
            answer: "Most clients see meaningful shifts in team accountability and owner workload within the first 90 days. Significant financial results — margins up, overhead tightening, productivity climbing — typically emerge within 6 to 12 months. The goal is 1,000% ROI. We've hit 3,000%.",
        },
        {
            question: "What makes your approach different from other business coaches?",
            answer: "Most coaches focus on what your employees are doing. Greg focuses on how they're being — the culture, the mindset, the accountability structures. That's what drives discretionary effort: people giving their best even when no one's watching. That's where the real gains come from.",
        },
        {
            question: "Do you work with companies preparing to sell?",
            answer: "Yes. Succession and exit strategy is one of Greg's specialties. In 2–3 years, we get your financials strong, your operations documented, and your management team running independently — which directly increases your sale price and makes you attractive to acquirers.",
        },
        {
            question: "What does the Mastermind Group program look like?",
            answer: "Monthly virtual meetings (2–2.5 hours) with 7 or fewer non-competing restoration owners and GMs. Each session covers financial facts, a deep dive on one member's business, and best-practice solutions to the group's biggest current challenges. Plus one-on-one coaching between sessions.",
        },
        {
            question: "How do I get started?",
            answer: "Start with a free 30-minute discovery call. Greg will walk through your specific situation, identify your biggest gaps, and tell you exactly which program is the right fit. No pressure, no pitch — just a straight conversation about what's possible for your business.",
        },
    ];

    let openIndex: number | null = null;
    let sectionRef: HTMLElement;

    function toggle(i: number) {
        openIndex = openIndex === i ? null : i;
    }

    onMount(() => {
        gsap.from(".faq-header", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(".faq-item", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 70%",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
        });
    });
</script>

<section
    bind:this={sectionRef}
    class="py-24 lg:py-32 bg-[#0a0a0a] relative z-10"
>
    <div class="max-w-4xl mx-auto px-6 lg:px-12">
        <div class="faq-header mb-16 lg:mb-24 text-center">
            <div class="ind-metadata mb-4">SEC. 06 // FAQ</div>
            <h2
                class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center justify-center gap-4"
            >
                <span class="w-12 h-[1px] bg-ind-accent"></span> Questions
                <span class="w-12 h-[1px] bg-ind-accent"></span>
            </h2>
            <h3
                class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase"
            >
                Common Questions
            </h3>
        </div>

        <div class="space-y-0">
            {#each faqs as faq, i}
                <div class="faq-item border-b border-ind-border/30">
                    <button
                        class="w-full py-6 md:py-8 flex items-center justify-between text-left group"
                        on:click={() => toggle(i)}
                    >
                        <div class="flex items-center gap-4 md:gap-6 pr-4">
                            <span
                                class="ind-metadata text-ind-accent text-xs shrink-0"
                                >{String(i + 1).padStart(2, "0")}</span
                            >
                            <h4
                                class="text-base md:text-lg font-bold text-white group-hover:text-ind-accent transition-colors uppercase tracking-tight"
                            >
                                {faq.question}
                            </h4>
                        </div>
                        <div
                            class="shrink-0 w-8 h-8 flex items-center justify-center border border-ind-border/30 transition-all duration-300 {openIndex ===
                            i
                                ? 'bg-ind-accent border-ind-accent rotate-180'
                                : 'group-hover:border-ind-accent'}"
                        >
                            <ChevronDown
                                size={16}
                                class={openIndex === i
                                    ? "text-black"
                                    : "text-ind-steel"}
                            />
                        </div>
                    </button>

                    {#if openIndex === i}
                        <div transition:slide={{ duration: 300 }}>
                            <div class="pb-8 pl-10 md:pl-14 pr-12">
                                <p
                                    class="text-ind-steel text-sm md:text-base leading-relaxed"
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
