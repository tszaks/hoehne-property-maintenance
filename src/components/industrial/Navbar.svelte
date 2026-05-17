<script lang="ts">
    import { onMount } from "svelte";
    import { Phone, List, X } from "phosphor-svelte";

    let isScrolled = false;
    let isMenuOpen = false;

    const navLinks = [
        { label: "Services", href: "#services" },
        { label: "Contact",  href: "#contact"  },
    ];

    function scrollTo(href: string) {
        isMenuOpen = false;
        document.body.style.overflow = "";
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }

    onMount(() => {
        const handleScroll = () => { isScrolled = window.scrollY > 50; };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-ind-bg/95 backdrop-blur-md border-b border-ind-border/30' : 'bg-transparent'}">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        <!-- Logo -->
        <a href="/" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-ind-accent flex items-center justify-center">
                <span class="text-white font-black text-sm">H</span>
            </div>
            <div>
                <div class="text-white font-black text-sm uppercase tracking-tight leading-none">Hoehne</div>
                <div class="ind-metadata text-ind-steel" style="font-size:0.5rem">Property Maintenance & Remodeling</div>
            </div>
        </a>

        <!-- Desktop -->
        <div class="hidden md:flex items-center gap-8">
            {#each navLinks as link}
                <button on:click={() => scrollTo(link.href)}
                    class="ind-metadata text-ind-steel hover:text-white transition-colors cursor-pointer bg-transparent border-0">
                    {link.label}
                </button>
            {/each}
            <a href="tel:+16104126424"
                class="ind-button flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider">
                <Phone size={14} weight="bold" />(610) 412-6424
            </a>
        </div>

        <!-- Mobile toggle -->
        <button on:click={() => { isMenuOpen = !isMenuOpen; document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }}
            class="md:hidden text-white p-2">
            {#if isMenuOpen}<X size={22} weight="bold" />{:else}<List size={22} weight="bold" />{/if}
        </button>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
        <div class="md:hidden bg-ind-bg border-t border-ind-border/30 px-6 py-6 space-y-1">
            {#each navLinks as link}
                <button on:click={() => scrollTo(link.href)}
                    class="block w-full text-left text-white font-black uppercase tracking-wide text-lg py-4 border-b border-ind-border/20 bg-transparent">
                    {link.label}
                </button>
            {/each}
            <div class="pt-6">
                <a href="tel:+16104126424"
                    class="ind-button flex items-center justify-center gap-3 w-full py-4 text-sm font-black uppercase tracking-widest">
                    <Phone size={16} weight="bold" />(610) 412-6424
                </a>
            </div>
        </div>
    {/if}
</nav>
