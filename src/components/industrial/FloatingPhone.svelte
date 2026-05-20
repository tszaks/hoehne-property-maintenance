<script lang="ts">
  import { onMount } from 'svelte';
  import { Phone } from "phosphor-svelte";

  let scrolled = false;
  let nearBottom = false;

  onMount(() => {
    const reveal = setTimeout(() => { scrolled = window.scrollY > 300; }, 2000);
    const handleScroll = () => { scrolled = window.scrollY > 300; };
    window.addEventListener('scroll', handleScroll);

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

    return () => {
      clearTimeout(reveal);
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
  });

  $: visible = scrolled && !nearBottom;
</script>

{#if visible}
  <a href="tel:+16104126424"
    class="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 bg-ind-accent text-black font-black text-sm uppercase tracking-wide px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 animate-pulse-slow"
    style="box-shadow: 0 0 0 0 rgba(111,158,206,0.4); animation: phone-pulse 2s ease-in-out infinite;">
    <Phone size={16} />
    <span class="hidden sm:inline">(610) 412-6424</span>
    <span class="sm:hidden">Call Now</span>
  </a>
{/if}

<style>
  @keyframes phone-pulse {
    0% { box-shadow: 0 0 0 0 rgba(111,158,206,0.5); }
    70% { box-shadow: 0 0 0 12px rgba(111,158,206,0); }
    100% { box-shadow: 0 0 0 0 rgba(111,158,206,0); }
  }
  a { animation: phone-pulse 2s ease-in-out infinite; }
</style>
