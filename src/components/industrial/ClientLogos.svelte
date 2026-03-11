<script lang="ts">
    const clients = [
        "RESTORATION",
        "CONSTRUCTION",
        "LEADERSHIP",
        "ACCOUNTABILITY",
        "CULTURE",
        "PERFORMANCE",
        "FREEDOM",
        "PROFITS",
        "OWNERSHIP",
        "GROWTH",
    ];

    // Double for seamless loop
    const allClients = [...clients, ...clients];
</script>

<section
    class="py-16 bg-[#070707] relative z-10 border-y border-ind-border/20 overflow-hidden"
>
    <div class="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div class="ind-metadata text-center opacity-60">
            BUILT FOR RESTORATION & CONSTRUCTION OWNERS
        </div>
    </div>

    <div class="logo-ticker flex whitespace-nowrap">
        <div class="logo-ticker-content flex items-center">
            {#each allClients as client}
                <div
                    class="mx-8 md:mx-14 text-xl md:text-2xl font-black tracking-[0.2em] text-white/10 hover:text-white/30 transition-colors duration-500 uppercase select-none"
                >
                    {client}
                </div>
            {/each}
        </div>
        <div class="logo-ticker-content flex items-center" aria-hidden="true">
            {#each allClients as client}
                <div
                    class="mx-8 md:mx-14 text-xl md:text-2xl font-black tracking-[0.2em] text-white/10 uppercase select-none"
                >
                    {client}
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .logo-ticker {
        animation: ticker-scroll 40s linear infinite;
    }

    .logo-ticker-content {
        flex-shrink: 0;
    }

    @keyframes ticker-scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }
</style>
