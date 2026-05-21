<script lang="ts">
    import { onMount } from "svelte";
    import {
        Hammer, Wrench, PaintBrush, Plant, Snowflake,
        Tree, Bathtub, CookingPot, Drop, House,
        Wall, Door
    } from "phosphor-svelte";

    const services = [
        { icon: Hammer,     title: "Home Remodeling",  desc: "Whole-home and room-by-room renovations." },
        { icon: Wrench,     title: "Handyman Services", desc: "Repairs, fixes, install work. Small or large." },
        { icon: PaintBrush, title: "Painting",          desc: "Interior and exterior, clean lines every time." },
        { icon: Plant,      title: "Lawn Care",         desc: "Mowing, trimming, seasonal upkeep." },
        { icon: Snowflake,  title: "Snow Removal",      desc: "Driveways and walks, called out when it hits." },
        { icon: Tree,       title: "Decks & Outdoor",   desc: "New builds, repair, stain and seal." },
        { icon: Bathtub,    title: "Bathrooms",         desc: "Vanities, tile, plumbing fixtures, full refits." },
        { icon: CookingPot, title: "Kitchens",          desc: "Cabinets, counters, backsplash, full gut and rebuild." },
        { icon: Drop,       title: "Pressure Washing",  desc: "Siding, decks, driveways, walkways." },
        { icon: House,      title: "General Repairs",   desc: "The list of small things you've been meaning to fix." },
        { icon: Wall,       title: "Drywall & Paint",   desc: "Patch, hang, finish, paint to match." },
        { icon: Door,       title: "Doors & Windows",   desc: "Install, replace, weather-seal, trim." },
    ];

    let visible = false;
    onMount(() => {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) if (e.isIntersecting) { visible = true; io.disconnect(); }
        }, { threshold: 0.15 });
        const el = document.getElementById('services');
        if (el) io.observe(el);
    });
</script>

<section id="services" class="py-24 lg:py-32 bg-paper relative z-10">
    <div class="max-w-[1440px] mx-auto px-5 lg:px-10">

        <!-- Section header -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
            <div class="max-w-2xl">
                <div class="section-divider mb-6">
                    <span class="marker">§ 02</span>
                    <span class="line"></span>
                    <span class="marker text-hivis-deep">Scope of work</span>
                </div>
                <h2 class="font-display text-ink font-bold tracking-tight leading-[0.95]"
                    style="font-size: clamp(2.25rem, 4.5vw, 4rem); font-variation-settings: 'SOFT' 30, 'opsz' 144;">
                    No job too small.<br/>
                    <span class="italic" style="font-weight: 500;">No job too big.</span>
                </h2>
            </div>
            <div class="max-w-sm">
                <p class="text-ink-soft text-base leading-relaxed">
                    Twelve disciplines. One crew. Every job built around the way it should be done, not the shortcut.
                </p>
                <div class="mt-4 font-mono text-[10px] tracking-widest uppercase text-steel">
                    Index of services · A through L
                </div>
            </div>
        </div>

        <!-- Services list/grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/12 border border-ink/12">
            {#each services as svc, i}
                <div class="group bg-paper hover:bg-paper-deep transition-colors duration-200 p-6 lg:p-7 relative overflow-hidden">
                    <!-- Number -->
                    <div class="font-mono text-[10px] tracking-widest uppercase text-steel mb-4">
                        § {String(i + 1).padStart(2, '0')}
                    </div>

                    <div class="flex items-start gap-4">
                        <div class="w-11 h-11 shrink-0 border border-ink/30 flex items-center justify-center rounded-sm group-hover:border-hivis group-hover:bg-hivis-soft transition-colors duration-200">
                            <svc.icon size={20} weight="duotone" color="var(--hivis-deep)" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-display text-ink text-xl lg:text-2xl font-bold tracking-tight leading-tight mb-1">
                                {svc.title}
                            </h3>
                            <p class="text-ink-soft text-sm leading-relaxed">{svc.desc}</p>
                        </div>
                    </div>

                    <!-- Hover orange rail at bottom -->
                    <div class="absolute left-0 bottom-0 h-[2px] bg-hivis scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 w-full"></div>
                </div>
            {/each}
        </div>

        <!-- Footer note -->
        <div class="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-ink/15 pt-6">
            <div class="font-mono text-[11px] tracking-widest uppercase text-ink">
                Service area
            </div>
            <p class="text-ink-soft text-sm flex-1 sm:text-right">
                Pottstown · Boyertown · Phoenixville · Limerick · Collegeville · Spring City · Royersford · North & South Coventry · Birchrunville · OJR district
            </p>
        </div>
    </div>
</section>
