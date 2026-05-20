<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { ArrowRight, Phone, ChatCircleText, CaretDown } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;
    let submitted = false;
    let submitting = false;
    let errorMsg = "";
    let formOpen = false;
    let form = { name: "", phone: "", message: "" };

    const smsBody = encodeURIComponent("Hi, I have a project I need help with.");
    const smsHref = `sms:+16104126424?&body=${smsBody}`;

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (submitting) return;
        submitting = true;
        errorMsg = "";
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) {
                submitted = true;
            } else {
                errorMsg = data?.error || "We could not send your message. Please call or text us at (610) 412-6424.";
            }
        } catch {
            errorMsg = "We could not send your message. Please call or text us at (610) 412-6424.";
        } finally {
            submitting = false;
        }
    }

    onMount(() => {
        gsap.from(".contact-inner", {
            scrollTrigger: { trigger: sectionRef, start: "top 85%" },
            y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
        });
    });
</script>

<section bind:this={sectionRef} id="contact" class="py-20 bg-ind-bg relative z-10">
    <div class="max-w-2xl mx-auto px-6 contact-inner">

        <div class="text-center mb-8">
            <div class="ind-metadata text-ind-steel mb-3 opacity-60">FREE ESTIMATE</div>
            <h2 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-3">
                Ready To Get It Done?
            </h2>
            <p class="text-ind-steel text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Call or text us with photos, a quick description, or the address. We can usually tell you the next step faster that way.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <a href="tel:+16104126424"
                class="ind-button group flex items-center justify-center gap-3 py-5 text-sm font-black uppercase tracking-widest">
                <Phone size={18} weight="fill" />
                Call Now
            </a>
            <a href={smsHref}
                class="group flex items-center justify-center gap-3 py-5 text-sm font-black uppercase tracking-widest border border-ind-accent text-ind-accent bg-ind-bg hover:bg-ind-accent hover:text-black transition-colors duration-200">
                <ChatCircleText size={18} weight="fill" />
                Text Us
            </a>
        </div>

        <p class="text-center text-ind-steel/70 text-xs ind-metadata mb-8">
            (610) 412-6424
        </p>

        {#if submitted}
            <div class="text-center py-10 border border-ind-border/30 bg-ind-surface/40">
                <div class="text-ind-accent text-5xl font-black mb-3">✓</div>
                <p class="text-white font-bold uppercase text-sm tracking-wide">Thanks. We will be in touch shortly.</p>
            </div>
        {:else}
            <div class="border-t border-ind-border/30 pt-6">
                <button type="button" on:click={() => (formOpen = !formOpen)}
                    aria-expanded={formOpen}
                    aria-controls="contact-form-panel"
                    class="w-full flex items-center justify-center gap-2 text-ind-steel hover:text-white text-xs uppercase tracking-widest font-bold transition-colors py-2">
                    {formOpen ? "Hide request form" : "Prefer to write details? Send a request"}
                    <span class="inline-flex transition-transform duration-200" style:transform={formOpen ? "rotate(180deg)" : "rotate(0deg)"}>
                        <CaretDown size={12} weight="bold" />
                    </span>
                </button>

                {#if formOpen}
                    <form id="contact-form-panel" on:submit={handleSubmit} class="space-y-4 mt-5">
                        <input bind:value={form.name} required type="text" placeholder="Your name"
                            class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors placeholder:text-ind-steel/50" />

                        <input bind:value={form.phone} required type="tel" placeholder="Phone number"
                            class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors placeholder:text-ind-steel/50" />

                        <textarea bind:value={form.message} required rows={4} placeholder="What do you need done?"
                            class="w-full bg-ind-surface border border-ind-border/30 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors resize-none placeholder:text-ind-steel/50"></textarea>

                        {#if errorMsg}
                            <p class="text-ind-accent text-xs text-center" role="alert">{errorMsg}</p>
                        {/if}

                        <button type="submit" disabled={submitting}
                            class="ind-button w-full flex items-center justify-center gap-3 py-4 text-sm font-black uppercase tracking-widest disabled:opacity-50">
                            {submitting ? "Sending..." : "Send Request"} <ArrowRight size={15} />
                        </button>
                    </form>
                {/if}
            </div>
        {/if}

        <p class="text-center text-ind-steel/40 text-xs mt-10 ind-metadata">
            Licensed & Insured · Veteran Owned · Pottstown, PA 19464
        </p>
    </div>
</section>
