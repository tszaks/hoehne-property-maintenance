<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let submitted = false;
    let submitting = false;
    let form = { name: "", phone: "", message: "" };

    async function handleSubmit(e: Event) {
        e.preventDefault();
        submitting = true;
        const subject = encodeURIComponent(`Estimate Request — ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`);
        window.location.href = `mailto:aaron@hoehnepropertymaintenance.com?subject=${subject}&body=${body}`;
        submitting = false;
        submitted = true;
    }

    onMount(() => {
        gsap.from(".contact-inner", {
            scrollTrigger: { trigger: sectionRef, start: "top 85%" },
            y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="contact" class="py-20 bg-ind-bg relative z-10">
    <div class="max-w-lg mx-auto px-6 contact-inner">

        <div class="text-center mb-10">
            <div class="ind-metadata text-ind-steel mb-3 opacity-60">FREE ESTIMATE</div>
            <h2 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                Get In Touch
            </h2>
            <p class="text-ind-steel text-sm">Or just call/text: <a href="tel:+16104126424" class="text-ind-accent font-bold hover:underline">(610) 412-6424</a></p>
        </div>

        {#if submitted}
            <div class="text-center py-12 border border-ind-border/30">
                <div class="text-ind-accent text-5xl font-black mb-3">✓</div>
                <p class="text-white font-bold uppercase text-sm">Aaron will be in touch shortly.</p>
            </div>
        {:else}
            <form on:submit={handleSubmit} class="space-y-4">
                <input bind:value={form.name} required type="text" placeholder="Your name"
                    class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors placeholder:text-ind-steel/50" />

                <input bind:value={form.phone} required type="tel" placeholder="Phone number"
                    class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors placeholder:text-ind-steel/50" />

                <textarea bind:value={form.message} required rows={4} placeholder="What do you need done?"
                    class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors resize-none placeholder:text-ind-steel/50"></textarea>

                <button type="submit" disabled={submitting}
                    class="ind-button w-full flex items-center justify-center gap-3 py-4 text-sm font-black uppercase tracking-widest disabled:opacity-50">
                    {submitting ? "Sending..." : "Send Request"} <ArrowRight size={15} />
                </button>
            </form>
        {/if}

        <p class="text-center text-ind-steel/40 text-xs mt-6 ind-metadata">
            Licensed & Insured · Veteran Owned · Pottstown, PA 19464
        </p>
    </div>
</section>
