<script lang="ts">
  import { tick, onMount } from 'svelte';
  import { ChatCircle, X, PaperPlaneTilt, Phone, UploadSimple } from 'phosphor-svelte';

  type Msg = { role: 'user' | 'assistant'; content: string; imageUrl?: string; imageName?: string };

  let open = $state(false);
  let input = $state('');
  let loading = $state(false);
  let apiError = $state('');
  let nearBottom = $state(false);
  let messagesEl: HTMLElement | undefined = $state(undefined);
  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let fileEl: HTMLInputElement | undefined = $state(undefined);
  let photoDataUrl = $state('');
  let photoName = $state('');

  // Hide the closed toggle when contact or footer is in view so it does not
  // compete with the in-section CTAs. Keep showing it while the panel is open.
  let toggleVisible = $derived(open || !nearBottom);

  onMount(() => {
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
    return () => io.disconnect();
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
    'Lawn / mulch',
    'Something else',
  ];

  function chipsForReply(reply: string): string[] {
    const r = reply.toLowerCase();

    // Stage / question intent, checked before service category so a paint
    // question about prep/condition doesn't get mislabeled with scope chips.

    // Condition / prep state
    if (
      /good condition|in good shape|drywall (repair|patch)|patch(ing|es)?\b|hairline|cracks?\b|holes?\b|prep work|need.*(repair|patch|prim|prep)|condition.*before|before painting/.test(
        r,
      )
    )
      return ['Good condition', 'Small patches', 'Needs primer', 'Needs repair'];

    // Interior vs exterior
    if (
      /interior or exterior|exterior or interior|inside or outside|outside or inside|interior.*(exterior|outside)|exterior.*(interior|inside)/.test(
        r,
      )
    )
      return ['Interior', 'Exterior', 'Both'];

    // Walls / ceiling / scope
    if (/walls? only|walls? and ceiling|full room|how many rooms|just (the )?walls|ceiling too|\bscope\b/.test(r))
      return ['Walls only', 'Walls and ceiling', 'Full room', 'Multiple rooms'];

    // Location / service area
    if (/where.*(located|are you)|what (town|area|zip|city)|service area|located in|location|nearby|zip code/.test(r))
      return ['Pottstown', 'Spring City', 'OJR area', 'Nearby'];

    // Timeline / urgency
    if (/timeline|how soon|when.*(start|need|done|finish|like)|urgency|deadline|\basap\b|this month|next (week|month)|time frame|timeframe/.test(r))
      return ['Flexible', 'This month', 'Two weeks', 'ASAP'];

    // Service-specific defaults (fallback when no stage intent matched)
    if (/paint|coat/.test(r))
      return ['Walls only', 'Walls and ceiling', 'Full room', 'Multiple rooms'];
    if (/bathroom/.test(r))
      return ['Full remodel', 'Fixtures only', 'Tile work', 'Vanity and toilet'];
    if (/\bdeck\b/.test(r))
      return ['Repair existing deck', 'New deck build', 'Composite boards', 'Pressure treated'];
    if (/drywall/.test(r))
      return ['Small patch', 'Full wall', 'Multiple rooms', 'Water damage'];
    if (/lawn|mulch|mow/.test(r))
      return ['Mowing', 'Mulching', 'Full cleanup', 'Trimming and edging'];
    if (/kitchen/.test(r))
      return ['Cabinet refresh', 'Full remodel', 'Countertops only', 'Appliances too'];
    if (/basement/.test(r))
      return ['Finish unfinished space', 'Repair existing', 'Add bathroom', 'Full build-out'];
    return [];
  }

  // Show initial chips until the user has sent at least one message
  let showInitialChips = $derived(apiMsgs.length === 0 && !loading);

  // Contextual chips derived from the last assistant reply
  let contextualChips: string[] = $derived(
    (() => {
      if (apiMsgs.length === 0 || loading) return [];
      const lastAssistant = [...uiMsgs].reverse().find((m) => m.role === 'assistant');
      if (!lastAssistant || lastAssistant.content === GREETING) return [];
      return chipsForReply(lastAssistant.content);
    })()
  );

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Unable to read image.'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange() {
    apiError = '';
    const file = fileEl?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      apiError = 'Please attach a photo file.';
      return;
    }
    if (file.size > 4_500_000) {
      apiError = 'Please attach a photo under 4.5 MB.';
      return;
    }
    try {
      photoDataUrl = await fileToDataUrl(file);
      photoName = file.name;
    } catch {
      apiError = 'Unable to read that photo. Please try another image.';
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
    class="chat-panel fixed z-50 flex flex-col bg-ind-surface border border-ind-border/60 shadow-2xl overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-ind-bg border-b border-ind-border/50 shrink-0">
      <div>
        <div class="text-white font-black text-sm uppercase tracking-tight">Project Estimator</div>
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

      <!-- Quick-reply chips: initial set before any user message, contextual after bot replies -->
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
      {:else if contextualChips.length > 0}
        <div class="flex flex-wrap gap-2 pt-1">
          {#each contextualChips as chip}
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

    <!-- Call CTA strip -->
    <a
      href="tel:+16104126424"
      class="flex items-center justify-center gap-2 py-2 bg-ind-bg border-t border-ind-border/40 text-ind-accent/70 hover:text-ind-accent text-xs font-bold uppercase tracking-wider transition-colors ind-metadata shrink-0"
    >
      <Phone size={12} /> (610) 412-6424 - Call / Text for Exact Pricing
    </a>

    {#if photoDataUrl}
      <div class="border-t border-ind-border/50 bg-ind-bg px-3 py-2 shrink-0">
        <div class="flex items-center gap-3">
          <img src={photoDataUrl} alt={photoName || 'Selected project'} class="h-12 w-12 object-cover border border-ind-border/60" />
          <div class="min-w-0 flex-1">
            <div class="text-white text-xs font-bold truncate">{photoName || 'Project photo attached'}</div>
            <div class="text-[0.65rem] text-ind-steel/50 uppercase tracking-widest">Vision review ready</div>
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

<!-- Toggle button in the bottom-left keeps clear of FloatingPhone. Hidden near contact/footer to avoid duplicate CTAs. -->
{#if toggleVisible}
  <button
    onclick={toggle}
    class="chat-toggle fixed z-50 flex items-center gap-2 px-4 py-3 bg-ind-accent text-black font-black text-xs uppercase tracking-wider hover:bg-ind-accent/90 transition-colors shadow-lg shadow-ind-accent/20 whitespace-nowrap"
    aria-label="Open project estimator chat"
  >
    {#if open}
      <X size={16} />
    {:else}
      <ChatCircle size={18} weight="fill" />
      <span class="hidden sm:inline">Ask About Your Project</span>
    {/if}
  </button>
{/if}

<style>
  /* Mobile: bottom sheet feel, full width minus gutters, anchored bottom-left */
  .chat-panel {
    left: 12px;
    right: 12px;
    bottom: 84px;
    height: min(560px, calc(100dvh - 96px));
    max-height: calc(100dvh - 96px);
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
      bottom: 88px;
      width: 380px;
      height: 500px;
      max-height: calc(100dvh - 112px);
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
