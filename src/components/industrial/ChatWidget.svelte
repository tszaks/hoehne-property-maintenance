<script lang="ts">
  import { tick, onMount } from 'svelte';
  import { ChatCircle, X, PaperPlaneTilt, UploadSimple } from 'phosphor-svelte';
  import { prepareProjectPhoto } from '../../lib/photo-upload';

  type Msg = { role: 'user' | 'assistant'; content: string; imageUrl?: string; imageName?: string };

  let open = $state(false);
  let input = $state('');
  let loading = $state(false);
  let apiError = $state('');
  let nearBottom = $state(false);
  let nearEstimate = $state(false);
  let isSmallScreen = $state(false);
  let messagesEl: HTMLElement | undefined = $state(undefined);
  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let fileEl: HTMLInputElement | undefined = $state(undefined);
  let photoDataUrl = $state('');
  let photoName = $state('');

  // Hide the closed toggle when contact or footer is in view so it does not
  // compete with the in-section CTAs. Keep showing it while the panel is open.
  let toggleVisible = $derived(!open && !nearBottom && !(isSmallScreen && nearEstimate));

  onMount(() => {
    const bottomTargets: Element[] = [];
    const contact = document.getElementById('contact');
    const footer = document.querySelector('footer');
    if (contact) bottomTargets.push(contact);
    if (footer) bottomTargets.push(footer);

    const mq = window.matchMedia('(max-width: 639px)');
    const updateScreen = () => { isSmallScreen = mq.matches; };
    updateScreen();
    mq.addEventListener('change', updateScreen);

    let visibleCount = 0;
    const bottomIo = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visibleCount += entry.isIntersecting ? 1 : -1;
      }
      if (visibleCount < 0) visibleCount = 0;
      nearBottom = visibleCount > 0;
    }, { threshold: 0.01 });

    for (const t of bottomTargets) bottomIo.observe(t);

    const estimate = document.getElementById('estimate');
    const estimateIo = estimate
      ? new IntersectionObserver((entries) => {
          nearEstimate = entries.some((entry) => entry.isIntersecting);
        }, { threshold: 0.05 })
      : undefined;
    if (estimate && estimateIo) estimateIo.observe(estimate);

    return () => {
      document.documentElement.classList.remove('chat-widget-open');
      bottomIo.disconnect();
      estimateIo?.disconnect();
      mq.removeEventListener('change', updateScreen);
    };
  });

  const GREETING =
    'Hi! I can help with rough project ranges for the Pottstown area. You can also attach a project photo. What are you working on?';

  let uiMsgs = $state<Msg[]>([{ role: 'assistant', content: GREETING }]);

  // Separate track for API, excludes the greeting so the model does not see it as a prior turn
  let apiMsgs = $state<Msg[]>([]);

  const INITIAL_CHIPS = [
    'Painting',
    'Drywall',
    'Bathroom',
    'Kitchen',
    'Deck',
    'Pressure washing',
    'Lawn cleanup',
    'Something else',
  ];

  // Show initial chips until the user has sent at least one message
  let showInitialChips = $derived(apiMsgs.length === 0 && !loading);

  async function handleFileChange() {
    apiError = '';
    const file = fileEl?.files?.[0];
    if (!file) return;
    try {
      const prepared = await prepareProjectPhoto(file);
      photoDataUrl = prepared.dataUrl;
      photoName = prepared.name;
    } catch (error) {
      apiError = error instanceof Error ? error.message : 'Unable to read that photo. Please try another image.';
    }
  }

  function clearPhoto() {
    photoDataUrl = '';
    photoName = '';
    if (fileEl) fileEl.value = '';
  }

  async function send() {
    const text = input.trim();
    if ((!text && !photoDataUrl) || loading) return;

    input = '';
    apiError = '';
    const content = text || 'Please review this project photo and tell me the most important scope detail you need next.';
    const userMsg: Msg = { role: 'user', content, imageUrl: photoDataUrl || undefined, imageName: photoName || undefined };
    clearPhoto();
    uiMsgs = [...uiMsgs, userMsg];
    apiMsgs = [...apiMsgs, userMsg];

    loading = true;
    await tick();
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMsgs.slice(-8) }),
      });

      const data = await res.json();

      if (data.error) {
        apiError = data.error;
      } else {
        const reply: Msg = { role: 'assistant', content: data.content };
        uiMsgs = [...uiMsgs, reply];
        apiMsgs = [...apiMsgs, reply];
      }
    } catch {
      apiError = 'Unable to connect. Call or text us at (610) 412-6424.';
    } finally {
      loading = false;
      await tick();
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  async function sendChip(label: string) {
    if (label === 'Something else') {
      inputEl?.focus();
      return;
    }
    if (label === 'Add photos') {
      fileEl?.click();
      return;
    }
    input = label;
    await tick();
    send();
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function toggle() {
    open = !open;
    document.documentElement.classList.toggle('chat-widget-open', open);
    if (open) {
      tick().then(() => {
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
      });
    }
  }
</script>

<!-- Chat panel: mobile bottom sheet anchored to viewport edges, desktop right-aligned panel -->
{#if open}
  <div
    class="chat-panel fixed z-[10000] flex flex-col bg-ind-surface border border-ind-border/60 shadow-2xl overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-ind-bg border-b border-ind-border/50 shrink-0">
      <div>
        <div class="text-white font-semibold text-sm tracking-tight">Project estimator</div>
        <div class="ind-metadata text-ind-steel/50 text-xs">Hoehne Property Maintenance</div>
      </div>
      <button
        onclick={toggle}
        class="text-ind-steel hover:text-white transition-colors p-1"
        aria-label="Close chat"
      >
        <X size={18} />
      </button>
    </div>

    <!-- Messages -->
    <div
      bind:this={messagesEl}
      class="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      style="scrollbar-width: none;"
    >
      {#each uiMsgs as msg}
        <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
          <div
            class="max-w-[85%] text-sm leading-relaxed px-3 py-2
              {msg.role === 'user'
                ? 'bg-ind-accent text-black font-medium'
                : 'bg-ind-bg border border-ind-border/50 text-ind-steel'}"
          >
            {#if msg.imageUrl}
              <img src={msg.imageUrl} alt={msg.imageName || 'Attached project'} class="mb-2 max-h-40 w-full object-cover border border-black/20" />
            {/if}
            {msg.content}
          </div>
        </div>
      {/each}

      {#if loading}
        <div class="flex justify-start">
          <div class="bg-ind-bg border border-ind-border/50 px-4 py-2 text-ind-steel/60">
            <span class="inline-flex gap-1">
              <span class="animate-bounce [animation-delay:0ms]">.</span>
              <span class="animate-bounce [animation-delay:150ms]">.</span>
              <span class="animate-bounce [animation-delay:300ms]">.</span>
            </span>
          </div>
        </div>
      {/if}

      {#if apiError}
        <div class="bg-red-900/30 border border-red-800/40 text-red-300 text-xs px-3 py-2">
          {apiError}
        </div>
      {/if}

      <!-- Quick-start chips only. Follow-up answers stay conversational. -->
      {#if showInitialChips}
        <div class="flex flex-wrap gap-2 pt-1">
          {#each INITIAL_CHIPS as chip}
            <button
              onclick={() => sendChip(chip)}
              class="chip-btn text-xs px-3 py-2 border border-ind-border/60 text-ind-steel hover:border-ind-accent hover:text-ind-accent transition-colors bg-ind-bg"
            >
              {chip}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    {#if photoDataUrl}
      <div class="border-t border-ind-border/50 bg-ind-bg px-3 py-2 shrink-0">
        <div class="flex items-center gap-3">
          <img src={photoDataUrl} alt={photoName || 'Selected project'} class="h-12 w-12 object-cover border border-ind-border/60" />
          <div class="min-w-0 flex-1">
            <div class="text-white text-xs font-bold truncate">{photoName || 'Project photo attached'}</div>
            <div class="text-[0.65rem] text-ind-steel/50 uppercase tracking-widest">Photo ready</div>
          </div>
          <button type="button" onclick={clearPhoto} class="text-ind-steel hover:text-white p-1" aria-label="Remove photo">
            <X size={14} />
          </button>
        </div>
      </div>
    {/if}

    <!-- Input -->
    <div class="flex items-center border-t border-ind-border/50 bg-ind-bg shrink-0">
      <input
        bind:this={fileEl}
        onchange={handleFileChange}
        type="file"
        accept="image/*"
        class="sr-only"
        aria-label="Attach project photo"
      />
      <button
        type="button"
        onclick={() => fileEl?.click()}
        disabled={loading}
        class="px-3 text-ind-steel hover:text-ind-accent disabled:opacity-30 transition-colors"
        style="min-height: 44px;"
        aria-label="Attach project photo"
      >
        <UploadSimple size={18} />
      </button>
      <input
        bind:this={inputEl}
        bind:value={input}
        onkeydown={handleKey}
        disabled={loading}
        placeholder="Ask about your project..."
        class="flex-1 bg-transparent text-white text-sm px-4 focus:outline-none placeholder:text-ind-steel/30 disabled:opacity-50"
        style="min-height: 44px;"
      />
      <button
        onclick={send}
        disabled={loading || (!input.trim() && !photoDataUrl)}
        class="px-4 text-ind-accent hover:text-white disabled:opacity-30 transition-colors"
        style="min-height: 44px;"
        aria-label="Send message"
      >
        <PaperPlaneTilt size={18} />
      </button>
    </div>
  </div>
{/if}

<!-- Closed-state toggle. The open panel has its own close control in the header. -->
{#if toggleVisible}
  <button
    onclick={toggle}
    class="chat-toggle fixed z-[10000] flex items-center gap-2 px-4 py-3 bg-ind-accent text-white font-semibold text-sm hover:bg-ind-accent/90 transition-colors shadow-lg shadow-ind-accent/20 whitespace-nowrap"
    aria-label="Open project estimator chat"
  >
    <ChatCircle size={18} weight="fill" />
    <span class="hidden sm:inline">Ask About Your Project</span>
  </button>
{/if}

<style>
  /* Mobile: bottom sheet feel, full width minus gutters, anchored bottom-left */
  .chat-panel {
    left: 12px;
    right: 12px;
    bottom: 12px;
    height: min(620px, calc(100dvh - 24px));
    max-height: calc(100dvh - 24px);
  }

  .chat-toggle {
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    left: 16px;
  }

  /* Desktop (≥640px): fixed-width panel anchored bottom-left to keep clear of the FloatingPhone CTA on the right */
  @media (min-width: 640px) {
    .chat-panel {
      left: 24px;
      right: auto;
      bottom: 24px;
      width: min(420px, calc(100vw - 48px));
      height: min(620px, calc(100dvh - 48px));
      max-height: calc(100dvh - 48px);
    }

    .chat-toggle {
      left: 24px;
      right: auto;
      bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    }
  }

  .chip-btn {
    min-height: 36px;
    touch-action: manipulation;
  }
</style>
