<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { MapPin, Phone, Mail, ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let sectionRef: HTMLElement;
    let formRef: HTMLElement;

    onMount(() => {
        gsap.from(".contact-header", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(formRef, {
            scrollTrigger: {
                trigger: formRef,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
        });

        gsap.from(".contact-info-item", {
            scrollTrigger: {
                trigger: sectionRef,
                start: "top 70%",
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
        });
    });
</script>

<section
    bind:this={sectionRef}
    id="contact"
    class="py-24 lg:py-32 bg-ind-bg relative z-10"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="contact-header mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 07 // CONTACT</div>
            <h2
                class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4"
            >
                <span class="w-12 h-[1px] bg-ind-accent"></span> Get In Touch
            </h2>
            <h3
                class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl"
            >
                Talk Through the Next Phase
            </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <!-- Contact Info -->
            <div class="flex flex-col justify-between">
                <div class="space-y-8 mb-12">
                    <div class="contact-info-item flex items-start gap-4">
                        <div
                            class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0"
                        >
                            <MapPin size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4
                                class="text-white font-bold uppercase tracking-tight mb-1 text-sm"
                            >
                                Location
                            </h4>
                            <p class="text-ind-steel text-sm">
                                Redding, CA<br />Serving clients nationwide
                            </p>
                        </div>
                    </div>

                    <div class="contact-info-item flex items-start gap-4">
                        <div
                            class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0"
                        >
                            <Phone size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4
                                class="text-white font-bold uppercase tracking-tight mb-1 text-sm"
                            >
                                Phone
                            </h4>
                            <p class="text-ind-steel text-sm">(415) 699-8512</p>
                        </div>
                    </div>

                    <div class="contact-info-item flex items-start gap-4">
                        <div
                            class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0"
                        >
                            <Mail size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4
                                class="text-white font-bold uppercase tracking-tight mb-1 text-sm"
                            >
                                Email
                            </h4>
                            <p class="text-ind-steel text-sm">
                                greg@gnaworks.com
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Certifications / stamps -->
                <div
                    class="hidden lg:flex items-center gap-6 border-t border-ind-border/20 pt-8"
                >
                    {#each ["30 YRS EXPERIENCE", "300+ CLIENTS", "8,000+ MTG SESSIONS", "1,000% ROI"] as cert}
                        <div
                            class="px-3 py-2 border border-ind-border/30 text-[0.6rem] ind-metadata text-ind-steel/50 tracking-[0.15em] transform -rotate-1 hover:border-ind-accent/50 hover:text-ind-accent transition-all duration-300"
                        >
                            {cert}
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Form -->
            <div
                bind:this={formRef}
                class="relative overflow-hidden border border-white/6 bg-ind-surface/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8"
            >
                <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ind-accent/60 to-transparent"></div>
                <div class="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>
                <div class="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>

                <div class="ind-fastener top-3 left-3"></div>
                <div class="ind-fastener top-3 right-3"></div>
                <div class="ind-fastener bottom-3 left-3"></div>
                <div class="ind-fastener bottom-3 right-3"></div>

                <div class="mb-6 border-b border-ind-border/40 pb-4">
                    <div class="ind-metadata mb-2 text-ind-accent">Direct Intake</div>
                    <h4 class="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                        Tell Greg Where You Want to Go
                    </h4>
                    <p class="mt-2 max-w-xl text-sm leading-relaxed text-ind-steel">
                        Give him a clear read on the business, where owner dependence is still showing up, and whether your goal is succession, more freedom, or an eventual sale.
                    </p>
                </div>

                <form class="space-y-5">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div class="group">
                            <label
                                for="name"
                                class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ind-steel/90 transition-colors group-focus-within:text-ind-accent"
                            >
                                <span aria-hidden="true">01 // </span>Full Name
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 w-[2px] bg-ind-accent/20 transition-colors group-focus-within:bg-ind-accent"></div>
                                <input
                                    id="name"
                                    type="text"
                                    class="block w-full border border-ind-border/50 bg-black/50 px-4 py-3 pl-5 text-sm text-white outline-none transition-all placeholder:text-ind-steel/25 focus:border-ind-accent/60 focus:bg-black/65"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div class="group">
                            <label
                                for="company"
                                class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ind-steel/90 transition-colors group-focus-within:text-ind-accent"
                            >
                                <span aria-hidden="true">02 // </span>Company
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 w-[2px] bg-ind-accent/20 transition-colors group-focus-within:bg-ind-accent"></div>
                                <input
                                    id="company"
                                    type="text"
                                    class="block w-full border border-ind-border/50 bg-black/50 px-4 py-3 pl-5 text-sm text-white outline-none transition-all placeholder:text-ind-steel/25 focus:border-ind-accent/60 focus:bg-black/65"
                                    placeholder="Company Name"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <div class="group">
                            <label
                                for="email"
                                class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ind-steel/90 transition-colors group-focus-within:text-ind-accent"
                            >
                                <span aria-hidden="true">03 // </span>Email
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 w-[2px] bg-ind-accent/20 transition-colors group-focus-within:bg-ind-accent"></div>
                                <input
                                    id="email"
                                    type="email"
                                    class="block w-full border border-ind-border/50 bg-black/50 px-4 py-3 pl-5 text-sm text-white outline-none transition-all placeholder:text-ind-steel/25 focus:border-ind-accent/60 focus:bg-black/65"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>

                        <div class="group">
                            <label
                                for="program"
                                class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ind-steel/90 transition-colors group-focus-within:text-ind-accent"
                            >
                                <span aria-hidden="true">04 // </span>Interested In
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 w-[2px] bg-ind-accent/20 transition-colors group-focus-within:bg-ind-accent"></div>
                                <select
                                    id="program"
                                    class="block w-full appearance-none border border-ind-border/50 bg-black/50 px-4 py-3 pl-5 pr-12 text-sm text-white outline-none transition-all focus:border-ind-accent/60 focus:bg-black/65"
                                >
                                    <option value="">Select a program</option>
                                    <option value="one-to-one">One-to-One Coaching</option>
                                    <option value="mastermind">Mastermind Group</option>
                                    <option value="exit">Succession &amp; Exit Strategy</option>
                                    <option value="team">Team &amp; Culture</option>
                                    <option value="discovery">Free Discovery Call</option>
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ind-steel/60">
                                    <ArrowRight size={14} class="rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="group">
                        <label
                            for="message"
                            class="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ind-steel/90 transition-colors group-focus-within:text-ind-accent"
                        >
                            <span aria-hidden="true">05 // </span>Your Situation
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 w-[2px] bg-ind-accent/20 transition-colors group-focus-within:bg-ind-accent"></div>
                            <textarea
                                id="message"
                                rows="4"
                                aria-describedby="message-helper"
                                class="block w-full resize-none border border-ind-border/50 bg-black/50 px-4 py-3 pl-5 text-sm leading-relaxed text-white outline-none transition-all placeholder:text-ind-steel/25 focus:border-ind-accent/60 focus:bg-black/65"
                                placeholder="Tell Greg about the business, what is still landing on you, and what you want the company to look like as it gets stronger and less dependent on you."
                            ></textarea>
                        </div>
                        <p
                            id="message-helper"
                            class="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-ind-steel/70"
                        >
                            The clearer the goal, the better Greg can prep.
                        </p>
                    </div>

                    <button
                        type="submit"
                        class="group relative flex w-full items-center justify-center gap-3 overflow-hidden border border-ind-accent bg-ind-accent px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-black transition-all duration-300 hover:border-white hover:bg-white"
                    >
                        <span class="relative z-10">Start the Conversation</span>
                        <ArrowRight
                            size={16}
                            class="relative z-10 transform transition-transform group-hover:translate-x-1"
                        />
                        <div class="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
