<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let progressBar: HTMLElement;

    onMount(() => {
        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            },
        });
    });
</script>

<div
    bind:this={progressBar}
    class="fixed top-0 left-0 w-full h-[3px] bg-ind-accent z-[9999] origin-left scale-x-0"
    style="box-shadow: 0 0 10px rgba(111, 158, 206, 0.35), 0 0 20px rgba(111, 158, 206, 0.15);"
></div>
