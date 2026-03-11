<script lang="ts">
    const words = [
        "LEADERSHIP",
        "ACCOUNTABILITY",
        "CULTURE",
        "PERFORMANCE",
        "FREEDOM",
        "PROFITS",
        "OWNERSHIP",
        "RESULTS",
    ];

    // Double the array for seamless loop
    const marqueeText = [...words, ...words]
        .map((w) => `<span class="mx-8 md:mx-12">${w}</span>`)
        .join('<span class="text-ind-accent mx-2">•</span>');
</script>

<div
    class="py-6 md:py-8 border-y border-ind-border/30 overflow-hidden bg-ind-bg relative z-10"
>
    <div class="marquee-track flex whitespace-nowrap">
        <div class="marquee-content flex items-center">
            {@html marqueeText}
        </div>
        <div class="marquee-content flex items-center" aria-hidden="true">
            {@html marqueeText}
        </div>
    </div>
</div>

<style>
    .marquee-track {
        animation: marquee-scroll 30s linear infinite;
    }

    .marquee-content {
        font-size: clamp(1.2rem, 3vw, 2rem);
        font-weight: 900;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.08);
        flex-shrink: 0;
    }

    @keyframes marquee-scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .marquee-track:hover {
        animation-play-state: paused;
    }
</style>
