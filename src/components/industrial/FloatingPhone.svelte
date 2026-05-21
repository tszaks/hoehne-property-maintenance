<script lang="ts">
  import { onMount } from 'svelte';
  import { Phone } from "phosphor-svelte";

  let scrolled = false;
  let nearBottom = false;
  let nearEstimate = false;
  let isSmallScreen = false;

  onMount(() => {
    const reveal = setTimeout(() => { scrolled = window.scrollY > 300; }, 2000);
    const handleScroll = () => { scrolled = window.scrollY > 300; };
    window.addEventListener('scroll', handleScroll);

    const mq = window.matchMedia('(max-width: 639px)');
    const updateScreen = () => { isSmallScreen = mq.matches; };
    updateScreen();
    mq.addEventListener('change', updateScreen);

    const targets: Element[] = [];
    const contact = document.getElementById('contact');
    const footer = document.querySelector('footer');
    if (contact) targets.push(contact);
    if (footer) targets.push(footer);

    let visibleCount = 0;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visibleCount += entry.isIntersecting ? 1 : -1;
      }
      if (visibleCount < 0) visibleCount = 0;
      nearBottom = visibleCount > 0;
    }, { threshold: 0.01 });

    for (const t of targets) io.observe(t);

    const estimate = document.getElementById('estimate');
    const estimateIo = estimate
      ? new IntersectionObserver((entries) => {
          nearEstimate = entries.some((entry) => entry.isIntersecting);
        }, { threshold: 0.05 })
      : undefined;
    if (estimate && estimateIo) estimateIo.observe(estimate);

    return () => {
      clearTimeout(reveal);
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
      estimateIo?.disconnect();
      mq.removeEventListener('change', updateScreen);
    };
  });

  $: visible = scrolled && !nearBottom && !(isSmallScreen && nearEstimate);
</script>

{#if visible}
  <a href="tel:+16104126424"
    class="floating-phone fixed bottom-5 right-5 z-[9999] flex items-center gap-2.5 bg-hivis text-white font-semibold text-sm px-5 py-3.5 hover:bg-hivis-deep transition-all duration-200 border border-hivis-deep"
    style="box-shadow: 0 2px 0 0 var(--ink), 0 10px 28px rgba(20, 16, 10, 0.28);">
    <Phone size={16} weight="bold" />
    <span class="hidden sm:inline font-mono tracking-wider">(610) 412-6424</span>
    <span class="sm:hidden font-mono tracking-wider">Call now</span>
  </a>
{/if}

<style>
  :global(html.chat-widget-open) .floating-phone {
    display: none;
  }
</style>
