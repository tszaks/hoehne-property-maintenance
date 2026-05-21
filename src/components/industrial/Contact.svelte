<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { Phone, ChatCircleText, Clock } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const smsBody = encodeURIComponent("Hi, I have a project I need help with.");
    const smsHref = "sms:+16104126424?&body=" + smsBody;

    onMount(() => {
        gsap.from(".contact-inner > *", {
            scrollTrigger: { trigger: sectionRef, start: "top 85%" },
            y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        });
        gsap.from(".contact-stamp", {
            scrollTrigger: { trigger: sectionRef, start: "top 75%" },
            scale: 1.6, opacity: 0, rotate: -16, duration: 0.7, ease: "back.out(1.6)",
            delay: 0.3,
        });
    });
</script>

<section bind:this={sectionRef} id="contact" class="py-24 lg:py-32 bg-paper relative z-10 overflow-hidden">

    <!-- Decorative grid -->
    <div class="absolute inset-0 ind-gridpaper opacity-60 pointer-events-none"></div>

    <div class="max-w-[1100px] mx-auto px-5 lg:px-10 relative z-10">

        <!-- Section header -->
        <div class="section-divider mb-8 contact-inner">
            <span class="marker">§ 04</span>
            <span class="line"></span>
            <span class="marker text-hivis-deep">Request work</span>
        </div>

        <div class="contact-inner grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">

            <!-- Left: headline + copy -->
            <div>
                <h2 class="font-display text-ink font-bold tracking-tight leading-[0.92] mb-6"
                    style="font-size: clamp(2.25rem, 5vw, 4.5rem); font-variation-settings: 'SOFT' 30, 'opsz' 144;">
                    Ready to<br/>
                    <span class="italic" style="font-weight: 500;">get it done?</span>
                </h2>
                <p class="text-ink-soft text-lg leading-relaxed mb-8 max-w-md">
                    Send photos, a quick description, and the address. We will review the details and give you a clear next step.
                </p>

                <!-- Hours table -->
                <div class="border-t border-ink/15">
                    <div class="flex items-baseline justify-between py-3 border-b border-ink/12">
                        <span class="font-mono text-[10px] tracking-widest uppercase text-steel flex items-center gap-2"><Clock size={12} weight="bold" /> Hours</span>
                        <span class="font-mono text-xs tracking-wide text-ink">Mon–Fri · 7am–6pm</span>
                    </div>
                    <div class="flex items-baseline justify-between py-3 border-b border-ink/12">
                        <span class="font-mono text-[10px] tracking-widest uppercase text-steel">Saturday</span>
                        <span class="font-mono text-xs tracking-wide text-ink">8am–4pm</span>
                    </div>
                    <div class="flex items-baseline justify-between py-3 border-b border-ink/12">
                        <span class="font-mono text-[10px] tracking-widest uppercase text-steel">Estimate</span>
                        <span class="font-mono text-xs tracking-wide text-ink">Free</span>
                    </div>
                </div>
            </div>

            <!-- Right: contact card with stamp -->
            <div class="relative">
                <!-- Decorative stamp -->
                <div class="contact-stamp absolute -top-6 -right-2 lg:-right-6 z-20">
                    <div class="stamp" style="font-size: 0.65rem; padding: 0.7rem 1rem;">
                        Free Estimate
                    </div>
                </div>

                <div class="bg-paper-deep border-2 border-ink relative p-7 lg:p-10" style="box-shadow: 6px 6px 0 0 rgba(20, 16, 10, 0.92);">
                    <span class="bracket-tl" style="top: 8px; left: 8px;"></span>
                    <span class="bracket-tr" style="top: 8px; right: 8px;"></span>
                    <span class="bracket-bl" style="bottom: 8px; left: 8px;"></span>
                    <span class="bracket-br" style="bottom: 8px; right: 8px;"></span>

                    <div class="font-mono text-[10px] tracking-widest uppercase text-steel mb-5">
                        Dispatch · Hoehne PM&R
                    </div>

                    <a href="tel:+16104126424" class="block no-min mb-7 group">
                        <div class="font-mono text-[10px] tracking-widest uppercase text-steel mb-1">Call</div>
                        <div class="font-display text-ink text-4xl lg:text-5xl font-bold tracking-tight leading-none group-hover:text-hivis-deep transition-colors">
                            (610)<br/>412-6424
                        </div>
                    </a>

                    <div class="flex flex-col gap-3">
                        <a href="tel:+16104126424"
                            class="ind-button flex items-center justify-center gap-3 py-4 text-sm font-semibold">
                            <Phone size={16} weight="bold" />
                            Call now
                        </a>
                        <a href={smsHref}
                            class="ind-button-outline flex items-center justify-center gap-3 py-4 text-sm font-semibold">
                            <ChatCircleText size={16} weight="bold" />
                            Text us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
