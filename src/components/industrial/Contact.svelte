<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    import { Phone, ChatCircleText } from "phosphor-svelte";

    if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

    let sectionRef: HTMLElement;

    const smsBody = encodeURIComponent("Hi, I have a project I need help with.");
    const smsHref = `sms:+16104126424?&body=${smsBody}`;

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

        <p class="text-center text-ind-steel/70 text-xs ind-metadata">
            (610) 412-6424
        </p>
    </div>
</section>
