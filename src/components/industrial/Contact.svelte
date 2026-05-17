<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { MapPin, Phone, Mail, ArrowRight } from "lucide-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let formRef: HTMLElement;
    let submitted = false;
    let submitting = false;

    let form = { name: "", company: "", email: "", phone: "", service: "", message: "" };

    async function handleSubmit(e: Event) {
        e.preventDefault();
        submitting = true;
        // Basic mailto fallback — can be replaced with a form backend
        const subject = encodeURIComponent(`Estimate Request from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.message}`);
        window.location.href = `mailto:aaron@hoehnepropertymaintenance.com?subject=${subject}&body=${body}`;
        submitting = false;
        submitted = true;
    }

    onMount(() => {
        gsap.from(".contact-header", {
            scrollTrigger: { trigger: sectionRef, start: "top 80%" },
            y: 50, opacity: 0, duration: 1, ease: "power3.out",
        });
        gsap.from(formRef, {
            scrollTrigger: { trigger: formRef, start: "top 85%" },
            y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        });
        gsap.from(".contact-info-item", {
            scrollTrigger: { trigger: sectionRef, start: "top 70%" },
            x: -30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="contact" class="py-24 lg:py-32 bg-ind-bg relative z-10">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="contact-header mb-16 lg:mb-24">
            <div class="ind-metadata mb-4">SEC. 07 // CONTACT</div>
            <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
                <span class="w-12 h-[1px] bg-ind-accent"></span> Get In Touch
            </h2>
            <h3 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase max-w-3xl">
                Ready to Get Started?
            </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <!-- Contact Info -->
            <div class="flex flex-col justify-between">
                <div class="space-y-8 mb-12">
                    <div class="contact-info-item flex items-start gap-4">
                        <div class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0">
                            <MapPin size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-tight mb-1 text-sm">Location</h4>
                            <p class="text-ind-steel text-sm">Pottstown, PA 19464<br />Serving Montgomery & Chester Counties</p>
                        </div>
                    </div>

                    <div class="contact-info-item flex items-start gap-4">
                        <div class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0">
                            <Phone size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-tight mb-1 text-sm">Phone / Text</h4>
                            <a href="tel:+16104126424" class="text-ind-steel text-sm hover:text-ind-accent transition-colors">(610) 412-6424</a>
                        </div>
                    </div>

                    <div class="contact-info-item flex items-start gap-4">
                        <div class="w-10 h-10 bg-ind-surface flex items-center justify-center border border-ind-border/30 shrink-0">
                            <Mail size={18} class="text-ind-accent" />
                        </div>
                        <div>
                            <h4 class="text-white font-bold uppercase tracking-tight mb-1 text-sm">Email</h4>
                            <a href="mailto:aaron@hoehnepropertymaintenance.com" class="text-ind-steel text-sm hover:text-ind-accent transition-colors">aaron@hoehnepropertymaintenance.com</a>
                        </div>
                    </div>
                </div>

                <!-- Credentials bar -->
                <div class="grid grid-cols-2 gap-4 border-t border-ind-border/20 pt-8">
                    {#each ["20+ YRS EXPERIENCE", "VETERAN OWNED", "FREE ESTIMATES", "LICENSED & INSURED"] as item}
                        <div class="text-[0.6rem] ind-metadata text-ind-steel/60 tracking-widest">{item}</div>
                    {/each}
                </div>
            </div>

            <!-- Form -->
            <div bind:this={formRef}>
                {#if submitted}
                    <div class="ind-steel-plate p-8 text-center">
                        <div class="text-ind-accent text-4xl font-black mb-4">✓</div>
                        <h4 class="text-white font-bold uppercase text-lg mb-2">Message Sent</h4>
                        <p class="text-ind-steel text-sm">Aaron will get back to you shortly. You can also call or text directly at (610) 412-6424.</p>
                    </div>
                {:else}
                    <form on:submit={handleSubmit} class="space-y-4">
                        <div class="ind-metadata text-ind-steel mb-6 opacity-70">Tell Us What You Need</div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="ind-metadata text-ind-steel block mb-2">01 // Name</label>
                                <input bind:value={form.name} required type="text" placeholder="Your name"
                                    class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent transition-colors" />
                            </div>
                            <div>
                                <label class="ind-metadata text-ind-steel block mb-2">02 // Phone</label>
                                <input bind:value={form.phone} type="tel" placeholder="(610) 000-0000"
                                    class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label class="ind-metadata text-ind-steel block mb-2">03 // Email</label>
                            <input bind:value={form.email} required type="email" placeholder="your@email.com"
                                class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent transition-colors" />
                        </div>

                        <div>
                            <label class="ind-metadata text-ind-steel block mb-2">04 // Service Needed</label>
                            <select bind:value={form.service}
                                class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent transition-colors">
                                <option value="">Select a service...</option>
                                <option>Home Remodeling</option>
                                <option>Handyman Services</option>
                                <option>Painting (Interior/Exterior)</option>
                                <option>Lawn Care & Landscaping</option>
                                <option>Snow Removal</option>
                                <option>Deck Building / Repair</option>
                                <option>Pressure Washing</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label class="ind-metadata text-ind-steel block mb-2">05 // Project Details</label>
                            <textarea bind:value={form.message} rows={4} placeholder="Tell us about your project. The more detail, the better."
                                class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent transition-colors resize-none"></textarea>
                        </div>

                        <button type="submit" disabled={submitting}
                            class="ind-button w-full flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wider disabled:opacity-50">
                            {submitting ? "Sending..." : "Request Free Estimate"} <ArrowRight size={16} />
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
</section>
