<script lang="ts">
    import { Phone, MapPin } from "phosphor-svelte";
    const year = new Date().getFullYear();
</script>

<footer class="relative bg-paper border-t-2 border-ink/85 z-10">
    <!-- Top rail -->
    <div class="bg-ink text-paper">
        <div class="max-w-[1440px] mx-auto px-5 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div class="font-mono text-[10px] tracking-widest uppercase text-paper/70">
                Licensed · Insured · Veteran Owned · Est. 2004
            </div>
            <a href="tel:+16104126424" class="flex items-center gap-2 font-mono text-xs tracking-wider text-paper hover:text-hivis transition-colors no-min">
                <Phone size={12} weight="bold" />
                (610) 412-6424
            </a>
        </div>
    </div>

    <!-- Main footer -->
    <div class="max-w-[1440px] mx-auto px-5 lg:px-10 py-14 lg:py-20 ind-blueprint">

        <div class="grid grid-cols-1 md:grid-cols-12 gap-10">

            <!-- Wordmark column -->
            <div class="md:col-span-5">
                <div class="flex items-center gap-3 mb-6">
                    <div class="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <div class="absolute inset-0 border-2 border-ink rotate-45"></div>
                        <span class="relative font-display font-black text-ink text-xl leading-none" style="font-variation-settings: 'SOFT' 30, 'opsz' 144;">H</span>
                    </div>
                    <div>
                        <div class="font-display text-ink text-2xl font-bold tracking-tight leading-none">Hoehne</div>
                        <div class="font-mono text-[10px] tracking-[0.22em] uppercase text-steel mt-1">Property Maintenance & Remodeling</div>
                    </div>
                </div>

                <p class="text-ink-soft text-base leading-relaxed max-w-md mb-6">
                    Veteran-owned. Twenty years on the tools. Honest work for the homes of Pottstown and the OJR district.
                </p>

                <div class="flex items-center gap-3 flex-wrap">
                    <span class="stamp" style="font-size: 0.6rem; padding: 0.4rem 0.7rem;">Veteran Owned</span>
                    <span class="stamp stamp-ink" style="transform: rotate(4deg); font-size: 0.55rem; padding: 0.4rem 0.7rem;">Lic. & Ins.</span>
                    <span class="stamp stamp-ink" style="transform: rotate(-2deg); font-size: 0.55rem; padding: 0.4rem 0.7rem;">Est. 2004</span>
                </div>
            </div>

            <!-- Index column -->
            <div class="md:col-span-3">
                <div class="font-mono text-[10px] tracking-widest uppercase text-steel mb-4 pb-3 border-b border-ink/20">
                    Index
                </div>
                <ul class="space-y-2">
                    <li><a href="/#services" class="font-display text-ink text-base font-medium hover:text-hivis-deep transition-colors">Services</a></li>
                    <li><a href="/#work" class="font-display text-ink text-base font-medium hover:text-hivis-deep transition-colors">Recent work</a></li>
                    <li><a href="/estimate" class="font-display text-ink text-base font-medium hover:text-hivis-deep transition-colors">Estimate</a></li>
                    <li><a href="/#contact" class="font-display text-ink text-base font-medium hover:text-hivis-deep transition-colors">Contact</a></li>
                </ul>
            </div>

            <!-- Location column -->
            <div class="md:col-span-4">
                <div class="font-mono text-[10px] tracking-widest uppercase text-steel mb-4 pb-3 border-b border-ink/20 flex items-center gap-2">
                    <MapPin size={11} weight="bold" /> Location
                </div>
                <div class="font-display text-ink text-lg font-bold mb-2">Pottstown, PA 19464</div>
                <p class="text-ink-soft text-sm leading-relaxed">
                    Serving Pottstown, Boyertown, Phoenixville, Limerick, Collegeville, Spring City, Royersford, North & South Coventry, Birchrunville, and the OJR school district.
                </p>
            </div>
        </div>

        <!-- Bottom rule + meta -->
        <div class="mt-12 pt-6 border-t border-ink/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="font-mono text-[10px] tracking-widest uppercase text-steel">
                © {year} Hoehne Property Maintenance & Remodeling LLC · All rights reserved
            </div>
            <div class="font-mono text-[10px] tracking-widest uppercase text-steel">
                Drawn & maintained in Pottstown, PA
            </div>
        </div>
    </div>
</footer>
