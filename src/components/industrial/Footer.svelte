<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let footerRef: HTMLElement;
    let ctaRef: HTMLElement;
    let footerRule: HTMLElement;

    onMount(() => {
        // Reveal text in footer
        gsap.from(".footer-reveal", {
            scrollTrigger: {
                trigger: footerRef,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
        });

        // Footer rule expansion
        ScrollTrigger.create({
            trigger: footerRule,
            start: "top 90%",
            onEnter: () => footerRule.classList.add("is-visible"),
        });

        // Reveal lines in footer
        const revealLines = footerRef.querySelectorAll(".ind-reveal-line");
        revealLines.forEach((el) => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 90%",
                onEnter: () => el.classList.add("is-visible"),
            });
        });
    });
</script>

<footer bind:this={footerRef} class="bg-black pt-24 pb-12 relative z-10">
    <!-- Animated top rule -->
    <div
        bind:this={footerRule}
        class="ind-footer-rule w-full h-[1px] bg-ind-accent absolute top-0 left-0"
    ></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div class="ind-ruler-x w-full absolute top-0 left-0 opacity-20"></div>
        <div class="ind-metadata absolute -top-12 left-6 lg:left-12 opacity-50">
            SEC. 06 // TERMINAL // FOOTER
        </div>

        <!-- Massive CTA -->
        <div
            bind:this={ctaRef}
            class="footer-reveal mb-24 pb-24 border-b border-ind-border/30 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        >
            <div>
                <h2
                    class="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-4"
                >
                    Ready to <span class="text-ind-accent">Grow.</span>
                </h2>
                <p
                    class="text-ind-steel text-lg md:text-xl font-medium max-w-xl"
                >
                    Stop running your business on willpower. Let's build the
                    team, the culture, and the systems that set you free.
                </p>
            </div>
            <a href="#contact" class="ind-button px-12 py-5 text-lg w-full md:w-auto">
                Apply for Coaching
            </a>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
            <div class="footer-reveal lg:col-span-1">
                <a href="/industrial" class="mb-6 inline-flex items-center">
                    <img
                        src="/gna-logo-light.png"
                        alt="GNA Inc — Breakthrough Performance"
                        class="h-8 w-auto object-contain"
                    />
                </a>
                <p class="text-ind-steel text-sm leading-relaxed max-w-xs">
                    Greg Neil has spent 30 years helping restoration and
                    construction owners build teams, grow profits, and take back
                    their lives.
                </p>
            </div>

            <div class="footer-reveal">
                <h4
                    class="text-white font-bold uppercase tracking-widest text-sm mb-6"
                >
                    Capabilities
                </h4>
                <ul class="space-y-4">
                    {#each ["One-to-One Coaching", "Mastermind Groups", "Succession & Exit", "Team & Culture"] as item}
                        <li>
                            <a
                                href="#"
                                class="text-ind-steel hover:text-ind-accent text-sm transition-colors"
                                >{item}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="footer-reveal">
                <h4
                    class="text-white font-bold uppercase tracking-widest text-sm mb-6"
                >
                    Company
                </h4>
                <ul class="space-y-4">
                    {#each ["About Greg", "Free Discovery Call", "Podcast", "Client Results"] as item}
                        <li>
                            <a
                                href="#"
                                class="text-ind-steel hover:text-ind-accent text-sm transition-colors"
                                >{item}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="footer-reveal">
                <h4
                    class="text-white font-bold uppercase tracking-widest text-sm mb-6"
                >
                    Contact
                </h4>
                <ul class="space-y-4 text-sm text-ind-steel">
                    <li>Redding, CA</li>
                    <li>
                        <a
                            href="tel:+14156998512"
                            class="hover:text-white transition-colors"
                            >(415) 699-8512</a
                        >
                    </li>
                    <li>
                        <a
                            href="mailto:greg@gnaworks.com"
                            class="hover:text-white transition-colors"
                            >greg@gnaworks.com</a
                        >
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="footer-reveal flex flex-col md:flex-row items-center justify-between text-xs text-ind-steel font-medium uppercase tracking-widest pt-8 border-t border-ind-border/30"
        >
            <p>
                &copy; {new Date().getFullYear()} GNA Inc. All rights reserved.
            </p>
            <div class="flex gap-6 mt-4 md:mt-0">
                <a href="#" class="hover:text-white transition-colors"
                    >Privacy Policy</a
                >
                <a href="#" class="hover:text-white transition-colors"
                    >Terms of Service</a
                >
            </div>
        </div>
    </div>
</footer>
