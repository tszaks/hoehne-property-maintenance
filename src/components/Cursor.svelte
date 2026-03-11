<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";

    let cursor: HTMLElement;
    let follower: HTMLElement;

    onMount(() => {
        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", moveCursor);

        const links = document.querySelectorAll("a, button");
        links.forEach((link) => {
            link.addEventListener("mouseenter", () => {
                gsap.to(follower, { scale: 3, opacity: 0.1, duration: 0.3 });
                gsap.to(cursor, { scale: 0.5, duration: 0.3 });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    });
</script>

<div class="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
    <div
        bind:this={cursor}
        class="absolute w-2 h-2 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"
    />
    <div
        bind:this={follower}
        class="absolute w-8 h-8 border border-black/10 rounded-full -translate-x-1/2 -translate-y-1/2"
    />
</div>

<style>
    :global(body) {
        cursor: none;
    }
    :global(a, button) {
        cursor: none;
    }
</style>
