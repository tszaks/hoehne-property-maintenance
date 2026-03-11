<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    let sectionLabels = [
        { id: "01", name: "OVERVIEW" },
        { id: "02", name: "SERVICES" },
        { id: "03", name: "PROCESS" },
        { id: "04", name: "RESULTS" },
        { id: "05", name: "ABOUT" },
        { id: "06", name: "FAQ" },
        { id: "07", name: "CONTACT" },
    ];

    let currentIndex = 0;
    let indicatorRef: HTMLElement;

    onMount(() => {
        const sections = document.querySelectorAll("section, footer");
        const sectionCount = Math.min(sections.length, sectionLabels.length);

        sections.forEach((section, i) => {
            if (i >= sectionCount) return;

            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    currentIndex = i;
                },
                onEnterBack: () => {
                    currentIndex = i;
                },
            });
        });

        gsap.from(indicatorRef, {
            x: -30,
            opacity: 0,
            duration: 1,
            delay: 3,
            ease: "power3.out",
        });
    });
</script>

<div
    bind:this={indicatorRef}
    class="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3"
>
    {#each sectionLabels as label, i}
        <button
            class="group flex items-center gap-3 transition-all duration-500"
            on:click={() => {
                const sections = document.querySelectorAll("section, footer");
                if (sections[i])
                    sections[i].scrollIntoView({ behavior: "smooth" });
            }}
        >
            <div
                class="w-8 h-[2px] transition-all duration-500 {i ===
                currentIndex
                    ? 'bg-ind-accent w-12'
                    : 'bg-ind-border'}"
            ></div>
            <span
                class="ind-metadata transition-all duration-500 text-[0.6rem] {i ===
                currentIndex
                    ? '!text-white !opacity-100'
                    : 'opacity-40'}"
            >
                {label.id}
            </span>
        </button>
    {/each}
</div>
