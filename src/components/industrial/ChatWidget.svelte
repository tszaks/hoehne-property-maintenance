<script lang="ts">
  import { tick } from 'svelte';
  import { ChatCircle, X, PaperPlaneTilt, Phone } from 'phosphor-svelte';

  type Msg = { role: 'user' | 'assistant'; content: string };

  let open = $state(false);
  let input = $state('');
  let loading = $state(false);
  let apiError = $state('');
  let messagesEl: HTMLElement | undefined = $state(undefined);

  let uiMsgs = $state<Msg[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help estimate home project costs in the Pottstown area. Before I give a range, I will ask a few questions about scope — that way the number is actually useful rather than random. What are you looking to have done?',
    },
  ]);

  // Separate track for API — excludes the greeting so Claude doesn't see it as a prior turn
  let apiMsgs = $state<Msg[]>([]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    input = '';
    apiError = '';
    const userMsg: Msg = { role: 'user', content: text };
    uiMsgs = [...uiMsgs, userMsg];
    apiMsgs = [...apiMsgs, userMsg];

    loading = true;
    await tick();
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMsgs.slice(-10) }),
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
      apiError = 'Unable to connect. Call or text Aaron directly at (610) 412-6424.';
    } finally {
      loading = false;
      await tick();
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }
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

<!-- Floating chat widget — bottom right -->
<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

  <!-- Chat panel -->
  {#if open}
    <div
      class="w-[340px] sm:w-[380px] flex flex-col bg-ind-surface border border-ind-border/60 shadow-2xl overflow-hidden"
      style="height: 460px;"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-ind-bg border-b border-ind-border/50 shrink-0">
        <div>
          <div class="text-white font-black text-sm uppercase tracking-tight">Project Estimator</div>
          <div class="ind-metadata text-ind-steel/50 text-xs">Hoehne Property Maintenance</div>
          <div class="text-ind-steel/35 text-xs mt-0.5">Asks scope questions before estimating</div>
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
        class="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none"
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
      </div>

      <!-- Call CTA strip -->
      <a
        href="tel:+16104126424"
        class="flex items-center justify-center gap-2 py-2 bg-ind-bg border-t border-ind-border/40 text-ind-accent/70 hover:text-ind-accent text-xs font-bold uppercase tracking-wider transition-colors ind-metadata shrink-0"
      >
        <Phone size={12} /> (610) 412-6424 &mdash; Call / Text for Exact Pricing
      </a>

      <!-- Input -->
      <div class="flex items-center border-t border-ind-border/50 bg-ind-bg shrink-0">
        <input
          bind:value={input}
          onkeydown={handleKey}
          disabled={loading}
          placeholder="Ask about your project..."
          class="flex-1 bg-transparent text-white text-sm px-4 py-3 focus:outline-none placeholder:text-ind-steel/30 disabled:opacity-50"
        />
        <button
          onclick={send}
          disabled={loading || !input.trim()}
          class="px-4 py-3 text-ind-accent hover:text-white disabled:opacity-30 transition-colors"
          aria-label="Send message"
        >
          <PaperPlaneTilt size={18} />
        </button>
      </div>
    </div>
  {/if}

  <!-- Toggle button -->
  <button
    onclick={toggle}
    class="flex items-center gap-2 px-4 py-3 bg-ind-accent text-black font-black text-xs uppercase tracking-wider hover:bg-ind-accent/90 transition-colors shadow-lg shadow-ind-accent/20"
    aria-label="Open project estimator chat"
  >
    {#if open}
      <X size={16} />
    {:else}
      <ChatCircle size={18} weight="fill" />
      <span class="hidden sm:inline">Ask About Your Project</span>
    {/if}
  </button>

</div>
