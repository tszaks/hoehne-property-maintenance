<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { Phone, ArrowRight, ShieldCheck, MapPin } from "phosphor-svelte";

    let containerElement: HTMLElement;

    function scrollToContact() {
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }

    onMount(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-meta",    { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.15)
          .from(".hero-line",    { y: 30, opacity: 0, duration: 0.7, stagger: 0.10 }, 0.25)
          .from(".hero-sub",     { y: 16, opacity: 0, duration: 0.6 }, 0.5)
          .from(".hero-cta",     { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.65)
          .from(".hero-photo",   { scale: 1.04, opacity: 0, duration: 0.9, ease: "power2.out" }, 0.3)
          .from(".hero-stamp",   { scale: 1.6, opacity: 0, rotate: -12, duration: 0.7, ease: "back.out(1.7)" }, 0.85)
          .from(".hero-callout", { y: 8, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.95);
    });
</script>

<section bind:this={containerElement} class="relative min-h-[100dvh] bg-paper overflow-hidden ind-gridpaper">

    <!-- Decorative giant backdrop wordmark -->
    <div aria-hidden="true" class="absolute -bottom-6 lg:-bottom-12 -left-4 lg:left-0 right-0 backdrop-wordmark text-[28vw] lg:text-[20vw] whitespace-nowrap z-0 overflow-hidden">
        HOEHNE
    </div>

    <!-- Corner registration crosshairs -->
    <span class="ind-crosshair" style="top: 88px; left: 24px;"></span>
    <span class="ind-crosshair" style="top: 88px; right: 24px;"></span>

    <!-- Content -->
    <div class="relative z-10 max-w-[1440px] mx-auto px-5 lg:px-10 pt-28 lg:pt-32 pb-20 lg:pb-24">

        <!-- Top meta bar: ticket number + meta -->
        <div class="hero-meta flex items-center gap-3 lg:gap-5 mb-8 lg:mb-12 flex-wrap">
            <span class="ticket-num">JOB TICKET · 001</span>
            <span class="hidden sm:block w-8 h-px bg-ink/40"></span>
            <span class="ind-metadata flex items-center gap-2"><MapPin size={11} weight="bold" /> Pottstown, PA</span>
            <span class="hidden sm:block w-8 h-px bg-ink/40"></span>
            <span class="ind-metadata flex items-center gap-2"><ShieldCheck size={11} weight="bold" /> Lic. & Ins.</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

            <!-- Left: Headline + sub + CTAs -->
            <div class="lg:col-span-7 relative">

                <!-- Hi-vis vertical mark -->
                <div class="hidden lg:block absolute -left-10 top-2 bottom-2 w-1 bg-hivis"></div>

                <h1 class="hero-line ind-hero-title font-display text-ink leading-[0.92] tracking-tight font-bold mb-2"
                    style="font-size: clamp(3rem, 7vw, 6.5rem); font-variation-settings: 'SOFT' 30, 'opsz' 144, 'WONK' 0;">
                    <span class="block">Your home,</span>
                    <span class="hero-line block italic font-display" style="font-weight: 500;">
                        done <span class="text-hivis-deep relative inline-block">
                            right
                            <svg class="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M 4 9 Q 50 2 100 7 T 196 6" stroke="var(--hivis)" stroke-width="4" fill="none" stroke-linecap="round" />
                            </svg>
                        </span>.
                    </span>
                </h1>

                <div class="hero-sub mt-10 max-w-xl">
                    <p class="text-ink-soft text-lg lg:text-xl leading-relaxed font-medium">
                        Honest remodels and repairs for homeowners in Pottstown, Spring City, Royersford, and across the OJR school district.
                    </p>
                </div>

                <!-- CTAs -->
                <div class="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a href="tel:+16104126424"
                        class="hero-cta ind-button flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold">
                        <Phone size={18} weight="bold" />
                        <span class="font-mono tracking-wider">(610) 412-6424</span>
                    </a>
                    <button on:click={scrollToContact}
                        class="hero-cta ind-button-outline flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold">
                        Free estimate <ArrowRight size={16} />
                    </button>
                </div>

                <!-- Trust callouts -->
                <div class="mt-12 grid grid-cols-3 gap-4 lg:gap-6 max-w-xl">
                    <div class="hero-callout">
                        <div class="font-display text-3xl lg:text-4xl text-ink font-bold leading-none">20<span class="text-hivis">+</span></div>
                        <div class="font-mono text-[10px] tracking-widest uppercase text-steel mt-2">Years on the tools</div>
                    </div>
                    <div class="hero-callout">
                        <div class="font-display text-3xl lg:text-4xl text-ink font-bold leading-none">100<span class="text-hivis">%</span></div>
                        <div class="font-mono text-[10px] tracking-widest uppercase text-steel mt-2">Veteran owned</div>
                    </div>
                    <div class="hero-callout">
                        <div class="font-display text-3xl lg:text-4xl text-ink font-bold leading-none">A–Z</div>
                        <div class="font-mono text-[10px] tracking-widest uppercase text-steel mt-2">No job too small</div>
                    </div>
                </div>
            </div>

            <!-- Right: Photo card with tape, stamp, and field annotations -->
            <div class="lg:col-span-5 relative mt-4 lg:mt-0">
                <div class="hero-photo relative aspect-[4/5] lg:aspect-[3/4] w-full ind-steel-plate overflow-hidden">
                    <!-- Brackets -->
                    <span class="bracket-tl" style="top: -2px; left: -2px;"></span>
                    <span class="bracket-tr" style="top: -2px; right: -2px;"></span>
                    <span class="bracket-bl" style="bottom: -2px; left: -2px;"></span>
                    <span class="bracket-br" style="bottom: -2px; right: -2px;"></span>

                    <!-- Photo -->
                    <div class="absolute inset-0 bg-cover bg-center"
                         style="background-image: url('/work/project-3.jpg'); filter: contrast(1.05) saturate(0.92);"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"></div>

                    <!-- Tape (top-left + top-right) -->
                    <div class="tape" style="top: -8px; left: 24px; transform: rotate(-6deg);"></div>
                    <div class="tape tape-orange" style="top: -10px; right: 18px; transform: rotate(8deg); width: 70px;"></div>

                    <!-- Annotation: project label at bottom -->
                    <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div>
                            <div class="font-mono text-[10px] tracking-widest uppercase text-paper/80 mb-1">Project · 03/24</div>
                            <div class="font-display text-paper text-xl font-bold tracking-tight leading-tight">Full kitchen<br/>renovation</div>
                        </div>
                        <div class="font-mono text-[10px] tracking-widest uppercase text-paper/80 text-right">
                            <span class="block">Pottstown</span>
                            <span class="block">PA · 19464</span>
                        </div>
                    </div>
                </div>

                <!-- Floating stamp: VETERAN OWNED -->
                <div class="hero-stamp absolute -bottom-5 -left-3 lg:-left-8 z-10">
                    <div class="stamp" style="font-size: 0.62rem; padding: 0.6rem 0.85rem;">
                        <span class="leading-tight text-center">Veteran<br/>Owned</span>
                    </div>
                </div>

                <!-- Floating EST. 2004 chip -->
                <div class="hero-stamp absolute -top-4 -right-2 lg:-right-6 z-10">
                    <div class="stamp stamp-ink" style="transform: rotate(6deg); font-size: 0.6rem; padding: 0.5rem 0.7rem;">
                        Est. 2004
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom ticker rail -->
        <div class="mt-16 lg:mt-24 border-y border-ink/20 py-4 relative ticker">
            <div class="ticker-track text-ink font-mono text-xs tracking-widest uppercase">
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Free estimates</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Licensed & insured</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> 20 years experience</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Veteran owned & operated</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Serving Montgomery & Chester counties</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> No job too small. No job too big.</span>
                <!-- Duplicate for seamless loop -->
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Free estimates</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Licensed & insured</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> 20 years experience</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Veteran owned & operated</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> Serving Montgomery & Chester counties</span>
                <span class="flex items-center gap-3"><span class="text-hivis">●</span> No job too small. No job too big.</span>
            </div>
        </div>
    </div>
</section>
