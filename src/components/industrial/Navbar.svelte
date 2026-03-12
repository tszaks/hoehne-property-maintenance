<script lang="ts">
    import { onMount } from "svelte";
    import { Menu, X } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { backOut } from "svelte/easing";

    let isScrolled = false;
    let isMenuOpen = false;
    let navElement: HTMLElement;
    let menuElement: HTMLElement;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (typeof window !== "undefined") {
            document.body.style.overflow = isMenuOpen ? "hidden" : "";
        }
    };

    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 50;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<nav
    bind:this={navElement}
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 py-4 lg:px-12 nav-entrance {isScrolled
        ? 'ind-glass py-4'
        : 'bg-transparent py-6'}"
>
    <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center group">
            <img
                src="/gna-logo-light.png"
                alt="GNA Inc — Breakthrough Performance"
                class="h-9 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
        </a>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center gap-8">
            {#each [["Services", "services"], ["Process", "process"], ["About", "about"], ["Contact", "contact"]] as [label, anchor]}
                <a
                    href="#{anchor}"
                    class="text-sm font-semibold text-ind-fg/80 hover:text-white uppercase tracking-wider transition-colors relative group"
                >
                    {label}
                    <span
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-ind-accent transition-all duration-300 group-hover:w-full"
                    ></span>
                </a>
            {/each}

            <a href="#contact" class="ind-button px-6 py-2.5 text-sm"> Apply Now </a>
        </div>

        <!-- Mobile Toggle -->
        <button
            class="md:hidden text-white z-50 relative"
            on:click={toggleMenu}
        >
            {#if isMenuOpen}
                <X size={24} />
            {:else}
                <Menu size={24} />
            {/if}
        </button>
    </div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
    <div
        transition:fade={{ duration: 300 }}
        class="fixed inset-0 bg-ind-bg z-40 flex flex-col items-center justify-center touch-none overscroll-none"
    >
        <div
            class="flex flex-col items-center gap-10 text-3xl md:text-4xl font-black uppercase tracking-widest w-full px-6"
        >
            {#each [["Services", "services"], ["Process", "process"], ["About", "about"], ["Contact", "contact"]] as [link, anchor], i}
                <a
                    href="#{anchor}"
                    transition:fly={{
                        y: 20,
                        duration: 500,
                        delay: 100 + i * 100,
                        easing: backOut,
                    }}
                    class="hover:text-ind-accent transition-colors py-4 block w-full text-center"
                    on:click={toggleMenu}
                >
                    {link}
                </a>
            {/each}
            <div
                transition:fly={{
                    y: 20,
                    duration: 500,
                    delay: 500,
                    easing: backOut,
                }}
                class="w-full"
            >
                <a
                    href="#contact"
                    class="ind-button px-8 py-4 mt-8 w-full block text-center"
                    on:click={toggleMenu}
                >
                    Apply Now
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes nav-slide-down {
        from { transform: translateY(-100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
    }
    :global(.nav-entrance) {
        animation: nav-slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
    }
</style>
