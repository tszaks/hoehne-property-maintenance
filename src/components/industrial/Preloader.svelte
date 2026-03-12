<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";

    let preloaderRef: HTMLElement;
    let logoRef: HTMLElement;
    let progressRef: HTMLElement;
    let counterRef: HTMLElement;

    onMount(() => {
        const tl = gsap.timeline();

        // Animate the counter from 0 to 100
        const counter = { val: 0 };
        gsap.to(counter, {
            val: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                if (counterRef) {
                    counterRef.textContent = Math.round(counter.val) + "%";
                }
            },
        });

        // Progress bar fill
        gsap.to(progressRef, {
            scaleX: 1,
            duration: 2,
            ease: "power2.inOut",
        });

        // After loading, wipe away
        tl.to(logoRef, {
            y: -30,
            opacity: 0,
            duration: 0.5,
            delay: 2.2,
            ease: "power2.in",
        })
            .to(
                counterRef,
                {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                },
                "-=0.3",
            )
            .to(
                progressRef,
                {
                    opacity: 0,
                    duration: 0.3,
                },
                "-=0.2",
            )
            .to(preloaderRef, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut",
            })
            .set(preloaderRef, { display: "none" });
    });
</script>

<div
    bind:this={preloaderRef}
    class="fixed inset-0 z-[10000] bg-ind-bg flex flex-col items-center justify-center"
>
    <!-- Logo -->
    <div bind:this={logoRef} class="mb-12">
        <img
            src="/gna-logo-light.png"
            alt="GNA Inc — Breakthrough Performance"
            class="w-[220px] md:w-[300px] h-auto object-contain"
        />
    </div>

    <!-- Progress bar -->
    <div class="w-48 md:w-64 h-[2px] bg-ind-border/30 relative mb-4">
        <div
            bind:this={progressRef}
            class="absolute inset-0 bg-ind-accent origin-left scale-x-0"
        ></div>
    </div>

    <!-- Counter -->
    <div
        bind:this={counterRef}
        class="ind-metadata text-ind-accent text-sm tracking-widest"
    >
        0%
    </div>
</div>
