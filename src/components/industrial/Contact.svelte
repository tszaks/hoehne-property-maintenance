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
                Apply for Coaching
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
                class="bg-ind-surface p-8 md:p-10 relative"
            >
                <!-- Fasteners -->
                <div class="ind-fastener top-3 left-3"></div>
                <div class="ind-fastener top-3 right-3"></div>
                <div class="ind-fastener bottom-3 left-3"></div>
                <div class="ind-fastener bottom-3 right-3"></div>

                <form class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                for="name"
                                class="block text-xs uppercase tracking-widest text-ind-steel font-semibold mb-2"
                                >Full Name</label
                            >
                            <input
                                id="name"
                                type="text"
                                class="w-full bg-ind-bg border border-ind-border/30 px-4 py-3 text-white text-sm focus:border-ind-accent focus:outline-none transition-colors placeholder:text-ind-steel/30"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label
                                for="company"
                                class="block text-xs uppercase tracking-widest text-ind-steel font-semibold mb-2"
                                >Company</label
                            >
                            <input
                                id="company"
                                type="text"
                                class="w-full bg-ind-bg border border-ind-border/30 px-4 py-3 text-white text-sm focus:border-ind-accent focus:outline-none transition-colors placeholder:text-ind-steel/30"
                                placeholder="Company Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="email"
                            class="block text-xs uppercase tracking-widest text-ind-steel font-semibold mb-2"
                            >Email</label
                        >
                        <input
                            id="email"
                            type="email"
                            class="w-full bg-ind-bg border border-ind-border/30 px-4 py-3 text-white text-sm focus:border-ind-accent focus:outline-none transition-colors placeholder:text-ind-steel/30"
                            placeholder="john@company.com"
                        />
                    </div>

                    <div>
                        <label
                            for="program"
                            class="block text-xs uppercase tracking-widest text-ind-steel font-semibold mb-2"
                            >Interested In</label
                        >
                        <select
                            id="program"
                            class="w-full bg-ind-bg border border-ind-border/30 px-4 py-3 text-white text-sm focus:border-ind-accent focus:outline-none transition-colors"
                        >
                            <option value="">Select a program</option>
                            <option value="one-to-one">One-to-One Coaching</option>
                            <option value="mastermind">Mastermind Group</option>
                            <option value="exit">Succession &amp; Exit Strategy</option>
                            <option value="team">Team &amp; Culture</option>
                            <option value="discovery">Free Discovery Call</option>
                        </select>
                    </div>

                    <div>
                        <label
                            for="message"
                            class="block text-xs uppercase tracking-widest text-ind-steel font-semibold mb-2"
                            >Your Situation</label
                        >
                        <textarea
                            id="message"
                            rows="4"
                            class="w-full bg-ind-bg border border-ind-border/30 px-4 py-3 text-white text-sm focus:border-ind-accent focus:outline-none transition-colors resize-none placeholder:text-ind-steel/30"
                            placeholder="Tell Greg about your business, your biggest challenge, and what you want to change..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        class="ind-button px-8 py-4 w-full text-sm font-bold flex items-center justify-center gap-2 group"
                    >
                        Apply for Coaching
                        <ArrowRight
                            size={16}
                            class="transform transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
