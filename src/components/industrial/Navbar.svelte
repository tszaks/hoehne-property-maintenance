<script lang="ts">
    import { onMount } from "svelte";
    import { Phone, List, X } from "phosphor-svelte";

    let isScrolled = false;
    let isMenuOpen = false;

    const navLinks = [
        { label: "Services",   href: "/#services", num: "01" },
        { label: "Recent Work", href: "/#work",     num: "02" },
        { label: "Estimate",   href: "/estimate",  num: "03" },
        { label: "Contact",    href: "/#contact",  num: "04" },
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

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-paper/95 backdrop-blur-md border-b border-ink/12' : 'bg-transparent'}">
    <div class="max-w-[1440px] mx-auto px-5 lg:px-10 h-16 lg:h-20 flex items-center justify-between">

        <!-- Wordmark -->
        <a href="/" class="flex min-w-0 items-center gap-3 group no-min">
            <div class="relative w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center shrink-0">
                <div class="absolute inset-0 border-2 border-ink rotate-45"></div>
                <span class="relative font-display font-black text-ink text-lg leading-none" style="font-variation-settings: 'SOFT' 30, 'opsz' 144;">H</span>
            </div>
            <div class="min-w-0 leading-tight">
                <div class="font-display text-ink font-bold text-lg tracking-tight leading-none">Hoehne</div>
                <div class="text-steel font-mono text-[9px] tracking-[0.22em] uppercase mt-1 truncate max-w-[180px] sm:max-w-none">Est. 2004 · Pottstown PA</div>
            </div>
        </a>

        <!-- Desktop nav -->
        <div class="hidden lg:flex items-center gap-1">
            {#each navLinks as link}
                <a href={link.href}
                    class="group relative px-4 py-3 no-min flex items-baseline gap-2 hover:text-hivis-deep transition-colors">
                    <span class="font-mono text-[10px] text-steel tracking-widest">{link.num}</span>
                    <span class="font-display text-ink text-base font-medium tracking-tight">{link.label}</span>
                    <span class="absolute left-4 right-4 bottom-2 h-[1.5px] bg-hivis scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </a>
            {/each}
            <a href="tel:+16104126424"
                class="ind-button ml-4 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide">
                <Phone size={15} weight="bold" />
                <span class="font-mono tracking-wider">(610) 412-6424</span>
            </a>
        </div>

        <!-- Mobile toggle -->
        <button onclick={() => { isMenuOpen = !isMenuOpen; document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }}
            class="lg:hidden text-ink p-2 border border-ink/20 rounded-sm no-min w-11 h-11 flex items-center justify-center"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {#if isMenuOpen}<X size={20} weight="bold" />{:else}<List size={20} weight="bold" />{/if}
        </button>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
        <div class="fixed inset-x-0 top-16 bottom-0 lg:hidden bg-paper border-t border-ink/12 overflow-y-auto ind-blueprint">
            <div class="px-6 py-8">
                <div class="font-mono text-[10px] tracking-[0.22em] uppercase text-steel mb-6 flex items-center gap-3">
                    <span>Index</span>
                    <span class="flex-1 h-px bg-ink/40"></span>
                </div>
                {#each navLinks as link}
                    <a href={link.href} onclick={closeMenu}
                        class="block w-full text-left py-5 border-b border-ink/12 group">
                        <div class="flex items-baseline gap-4">
                            <span class="font-mono text-xs text-hivis tracking-widest">§ {link.num}</span>
                            <span class="font-display text-ink font-bold text-2xl tracking-tight group-hover:text-hivis-deep transition-colors">{link.label}</span>
                        </div>
                    </a>
                {/each}
                <div class="pt-8">
                    <a href="tel:+16104126424"
                        class="ind-button flex items-center justify-center gap-3 w-full py-5 text-base font-semibold tracking-wide">
                        <Phone size={18} weight="bold" />
                        <span class="font-mono">(610) 412-6424</span>
                    </a>
                    <p class="text-center font-mono text-[10px] tracking-widest uppercase text-steel mt-4">Tap to call · 7am–6pm</p>
                </div>
            </div>
        </div>
    {/if}
</nav>
