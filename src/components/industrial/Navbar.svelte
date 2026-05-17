<script lang="ts">
    import { onMount } from "svelte";
    import { Menu, X, Phone } from "lucide-svelte";

    let isScrolled = false;
    let isMenuOpen = false;

    const navLinks = [
        { label: "Services", href: "#services" },
        { label: "Process", href: "#process" },
        { label: "Work", href: "#work" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
    ];

    function scrollTo(href: string) {
        isMenuOpen = false;
        document.body.style.overflow = "";
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    onMount(() => {
        const handleScroll = () => { isScrolled = window.scrollY > 50; };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-ind-bg/95 backdrop-blur-md border-b border-ind-border/30' : 'bg-transparent'}">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group">
            <div class="w-8 h-8 bg-ind-accent flex items-center justify-center">
                <span class="text-black font-black text-sm">H</span>
            </div>
            <div>
                <div class="text-white font-black text-sm uppercase tracking-tight leading-none">Hoehne</div>
                <div class="ind-metadata text-ind-steel" style="font-size:0.5rem">Property Maintenance & Remodeling</div>
            </div>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
            {#each navLinks as link}
                <button on:click={() => scrollTo(link.href)}
                    class="ind-metadata text-ind-steel hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-0">
                    {link.label}
                </button>
            {/each}
        </div>

        <!-- CTA -->
        <div class="hidden md:flex items-center gap-4">
            <a href="tel:+16104126424" class="flex items-center gap-2 text-ind-accent font-bold text-sm hover:text-white transition-colors">
                <Phone size={14} />(610) 412-6424
            </a>
            <button on:click={() => scrollTo("#contact")} class="ind-button px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Free Estimate
            </button>
        </div>

        <!-- Mobile Toggle -->
        <button on:click={() => { isMenuOpen = !isMenuOpen; document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }} class="md:hidden text-white p-2">
            {#if isMenuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
        </button>
    </div>

    {#if isMenuOpen}
        <div class="md:hidden bg-ind-bg border-t border-ind-border/30 px-6 py-6 space-y-4">
            {#each navLinks as link}
                <button on:click={() => scrollTo(link.href)} class="block w-full text-left text-white font-bold uppercase tracking-wide text-sm py-3 border-b border-ind-border/20 bg-transparent border-l-0 border-r-0 border-t-0">
                    {link.label}
                </button>
            {/each}
            <a href="tel:+16104126424" class="flex items-center gap-2 text-ind-accent font-bold text-sm pt-2">
                <Phone size={14} />(610) 412-6424
            </a>
        </div>
    {/if}
</nav>
