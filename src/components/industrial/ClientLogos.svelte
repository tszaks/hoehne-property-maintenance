<script lang="ts">
    const keywords = [
        "POTTSTOWN PA", "VETERAN OWNED", "MONTGOMERY COUNTY", "20 YEARS EXPERIENCE",
        "CHESTER COUNTY", "LICENSED & INSURED", "FREE ESTIMATES", "FAMILY OWNED",
        "POTTSTOWN PA", "VETERAN OWNED", "MONTGOMERY COUNTY", "20 YEARS EXPERIENCE",
        "CHESTER COUNTY", "LICENSED & INSURED", "FREE ESTIMATES", "FAMILY OWNED",
    ];
</script>

<section class="py-16 bg-[#070707] relative z-10 border-y border-ind-border/20 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div class="ind-metadata text-center opacity-60">SERVING POTTSTOWN AND SURROUNDING COMMUNITIES SINCE 2004</div>
    </div>
    <div class="logo-ticker flex whitespace-nowrap" style="animation: ticker 30s linear infinite;">
        <div class="logo-ticker-content flex items-center">
            {#each keywords as kw}
                <div class="mx-10 text-xl md:text-2xl font-black tracking-[0.2em] text-white/10 hover:text-white/30 transition-colors duration-500 uppercase select-none">{kw}</div>
            {/each}
        </div>
        <div class="logo-ticker-content flex items-center" aria-hidden="true">
            {#each keywords as kw}
                <div class="mx-10 text-xl md:text-2xl font-black tracking-[0.2em] text-white/10 uppercase select-none">{kw}</div>
            {/each}
        </div>
    </div>
</section>

<style>
@keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.logo-ticker {
    animation: ticker 30s linear infinite;
}
</style>
