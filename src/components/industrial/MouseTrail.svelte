<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";

    let cursorDot: HTMLElement;
    let cursorRing: HTMLElement;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isHovering = false;
    let isVisible = false;
    let isTouchDevice = false;
    let animationFrame: number;

    // Magnetic pull state
    let magneticTarget: HTMLElement | null = null;
    let magneticStrength = 0.2;

    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) isVisible = true;

        // Magnetic pull: if hovering a magnetic element, pull it toward cursor
        if (magneticTarget) {
            const rect = magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (mouseX - centerX) * magneticStrength;
            const deltaY = (mouseY - centerY) * magneticStrength;

            gsap.to(magneticTarget, {
                x: deltaX,
                y: deltaY,
                duration: 0.22,
                ease: "power2.out",
            });
        }
    }

    function handleMouseEnterInteractive(e: Event) {
        isHovering = true;
        const el = e.currentTarget as HTMLElement;
        if (
            el.classList.contains("ind-button") ||
            el.classList.contains("ind-magnetic")
        ) {
            magneticTarget = el;
        }
    }

    function handleMouseLeaveInteractive(e: Event) {
        isHovering = false;
        if (magneticTarget) {
            gsap.to(magneticTarget, {
                x: 0,
                y: 0,
                duration: 0.38,
                ease: "elastic.out(1, 0.4)",
            });
            magneticTarget = null;
        }
    }

    function animate() {
        // Smooth lerp for the ring (trails behind the dot)
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;

        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${isHovering ? 0.88 : 1})`;
        }
        if (cursorRing) {
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${isHovering ? 0.82 : 1})`;
            cursorRing.style.borderColor = isHovering
                ? "rgba(255, 90, 0, 0.94)"
                : "rgba(255, 90, 0, 0.72)";
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function bindInteractives() {
        const interactives = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, .ind-button, .ind-magnetic',
        );
        interactives.forEach((el) => {
            el.removeEventListener("mouseenter", handleMouseEnterInteractive);
            el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
            el.addEventListener("mouseenter", handleMouseEnterInteractive);
            el.addEventListener("mouseleave", handleMouseLeaveInteractive);
        });
    }

    onMount(() => {
        isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        // Hide default cursor globally
        document.documentElement.style.cursor = "none";
        const style = document.createElement("style");
        style.id = "custom-cursor-override";
        style.textContent =
            "*, *::before, *::after { cursor: none !important; }";
        document.head.appendChild(style);

        window.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });

        bindInteractives();

        // Re-bind after Astro hydration / DOM updates
        const observer = new MutationObserver(() => {
            bindInteractives();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        animate();

        return () => {
            observer.disconnect();
        };
    });

    onDestroy(() => {
        if (typeof window === "undefined" || isTouchDevice) return;
        window.removeEventListener("mousemove", handleMouseMove);
        if (animationFrame) cancelAnimationFrame(animationFrame);
        document.documentElement.style.cursor = "";
        const override = document.getElementById("custom-cursor-override");
        if (override) override.remove();
    });
</script>

{#if !isTouchDevice}
    <!-- Precise dot -->
    <div
        bind:this={cursorDot}
        class="fixed top-0 left-0 h-[5px] w-[5px] rounded-full bg-ind-accent pointer-events-none z-[9999]"
        class:opacity-0={!isVisible}
        class:opacity-100={isVisible}
        style="transition: opacity 0.2s ease;"
    ></div>

    <!-- Trailing ring -->
    <div
        bind:this={cursorRing}
        class="fixed top-0 left-0 h-7 w-7 rounded-full border-[1.5px] border-ind-accent/70 pointer-events-none z-[9998]"
        class:opacity-0={!isVisible}
        class:opacity-100={isVisible}
        style="transition: opacity 0.2s ease, border-color 0.2s ease;"
    ></div>
{/if}
