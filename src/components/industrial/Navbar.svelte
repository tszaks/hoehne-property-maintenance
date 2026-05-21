<script lang="ts">
    import { onMount } from "svelte";
    import { Phone, List, X } from "phosphor-svelte";

    let isScrolled = false;
    let isMenuOpen = false;

    const navLinks = [
        { label: "Services", href: "/#services" },
        { label: "Estimate", href: "/estimate" },
        { label: "Contact",  href: "/#contact"  },
    ];

    function closeMenu() {
        isMenuOpen = false;
        document.body.style.overflow = "";
    }

    onMount(() => {
        const handleScroll = () => { isScrolled = window.scrollY > 50; };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-ind-bg/95 backdrop-blur-md border-b border-ind-border/40' : 'bg-transparent'}">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        <!-- Logo -->
        <a href="/" class="flex min-w-0 items-center gap-3">
            <div class="w-8 h-8 border border-ind-accent/70 text-ind-accent flex items-center justify-center rounded">
                <span class="font-bold text-sm">H</span>
            </div>
            <div class="min-w-0">
                <div class="text-white font-semibold text-sm tracking-tight leading-none">Hoehne</div>
                <div class="text-ind-steel/70 max-w-[220px] truncate sm:max-w-none mt-0.5" style="font-size:0.65rem; letter-spacing:0.02em;">Property Maintenance & Remodeling</div>
            </div>
        </a>

        <!-- Desktop -->
        <div class="hidden md:flex items-center gap-7 pl-8 ml-6">
            {#each navLinks as link}
                <a href={link.href}
                    class="text-ind-steel hover:text-white transition-colors text-sm font-medium">
                    {link.label}
                </a>
            {/each}
            <a href="tel:+16104126424"
                class="ind-button flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide">
                <Phone size={14} weight="bold" />(610) 412-6424
            </a>
        </div>

        <!-- Mobile toggle -->
        <button onclick={() => { isMenuOpen = !isMenuOpen; document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }}
            class="md:hidden text-white p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {#if isMenuOpen}<X size={22} weight="bold" />{:else}<List size={22} weight="bold" />{/if}
        </button>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
        <div class="fixed inset-x-0 top-16 bottom-0 md:hidden bg-ind-bg border-t border-ind-border/40 px-6 py-6 space-y-1 overflow-y-auto">
            {#each navLinks as link}
                <a href={link.href} onclick={closeMenu}
                    class="block w-full text-left text-white font-medium tracking-tight text-lg py-4 border-b border-ind-border/30 bg-transparent">
                    {link.label}
                </a>
            {/each}
            <div class="pt-6">
                <a href="tel:+16104126424"
                    class="ind-button flex items-center justify-center gap-3 w-full py-4 text-sm font-semibold tracking-wide">
                    <Phone size={16} weight="bold" />(610) 412-6424
                </a>
            </div>
        </div>
    {/if}
</nav>
