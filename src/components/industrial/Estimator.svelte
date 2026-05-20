<script lang="ts">
  import { Phone, ArrowRight } from 'phosphor-svelte';

  const services = [
    { id: 'small-handyman', label: 'Small Handyman / General Repairs', min: 175, max: 450, plus: false },
    { id: 'ceiling-fan',    label: 'Ceiling Fan / Light Fixture Install', min: 180, max: 450, plus: false },
    { id: 'drywall-paint',  label: 'Drywall Repair / Paint Touch-up', min: 350, max: 950, plus: false },
    { id: 'room-painting',  label: 'Full Room Painting', min: 600, max: 1800, plus: false },
    { id: 'pressure-wash',  label: 'Pressure Washing', min: 350, max: 900, plus: false },
    { id: 'lawn-cleanup',   label: 'Lawn Cleanup / Mulching', min: 450, max: 1500, plus: false },
    { id: 'snow-removal',   label: 'Snow Removal (per visit)', min: 75, max: 250, plus: false },
    { id: 'deck-repair',    label: 'Deck Repair / Work', min: 700, max: 2500, plus: true },
    { id: 'bathroom',       label: 'Bathroom Update / Remodel', min: 3500, max: 12000, plus: true },
    { id: 'kitchen',        label: 'Kitchen Refresh / Remodel', min: 6500, max: 28000, plus: true },
    { id: 'basement',       label: 'Basement Finishing', min: 12000, max: 45000, plus: true },
  ];

  const scopeOptions = [
    { id: 'small',  label: 'Small',   sub: 'Minimal scope',   mult: 0.85 },
    { id: 'medium', label: 'Average', sub: 'Typical job',     mult: 1.0  },
    { id: 'large',  label: 'Large',   sub: 'Extensive work',  mult: 1.4  },
  ];

  const urgencyOptions = [
    { id: 'flexible', label: 'Flexible',        sub: 'No rush',       mult: 1.0,  note: '' },
    { id: 'month',    label: 'Within a month',  sub: 'Schedule soon', mult: 1.1,  note: 'Scheduling priority may add ~10%.' },
    { id: 'asap',     label: 'Rush / ASAP',     sub: 'Same week',     mult: 1.25, note: 'Rush requests typically add 15–25%.' },
  ];

  let selectedId = $state('');
  let selectedScope = $state('medium');
  let selectedUrgency = $state('flexible');

  const selected = $derived(services.find(s => s.id === selectedId));

  const estimate = $derived.by(() => {
    if (!selected) return null;
    const sMult = scopeOptions.find(s => s.id === selectedScope)?.mult ?? 1.0;
    const uMult = urgencyOptions.find(u => u.id === selectedUrgency)?.mult ?? 1.0;
    const round25 = (n: number) => Math.round(n / 25) * 25;
    return {
      min: round25(selected.min * sMult * uMult),
      max: round25(selected.max * sMult * uMult),
      plus: selected.plus,
    };
  });

  const urgencyNote = $derived(urgencyOptions.find(u => u.id === selectedUrgency)?.note ?? '');

  function fmt(n: number): string {
    return '$' + n.toLocaleString('en-US');
  }
</script>

<section id="estimate" class="py-24 lg:py-32 bg-ind-surface relative z-10">
  <div class="max-w-6xl mx-auto px-6 lg:px-12">

    <!-- Header -->
    <div class="mb-16">
      <div class="ind-metadata mb-4">SEC. 05 // ESTIMATE // ROUGH RANGES</div>
      <h2 class="text-ind-accent font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-4">
        <span class="w-12 h-[1px] bg-ind-accent"></span> Ballpark Estimator
      </h2>
      <h3 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase max-w-2xl">
        Get a Rough Idea Before You Call
      </h3>
      <p class="text-ind-steel text-sm mt-4 max-w-xl leading-relaxed">
        Pick your project, scope, and timeline to see a rough starting range — not a quote. Aaron gives exact pricing after seeing the job or photos. The chat assistant below can also estimate, but will ask project questions first so the range is not random.
      </p>
    </div>

    <div class="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">

      <!-- Form -->
      <div class="space-y-10">

        <!-- Service select -->
        <div>
          <label class="ind-metadata text-ind-steel/70 text-xs block mb-3">01 / WHAT DO YOU NEED DONE?</label>
          <div class="relative">
            <select
              bind:value={selectedId}
              class="w-full bg-ind-bg border border-ind-border/50 text-white text-sm px-5 py-4 focus:outline-none focus:border-ind-accent transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select a service...</option>
              {#each services as svc}
                <option value={svc.id}>{svc.label}</option>
              {/each}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-ind-steel">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10L6 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Scope -->
        <div>
          <label class="ind-metadata text-ind-steel/70 text-xs block mb-3">02 / JOB SIZE / SCOPE</label>
          <div class="grid grid-cols-3 gap-3">
            {#each scopeOptions as opt}
              <button
                onclick={() => selectedScope = opt.id}
                class="ind-steel-plate p-4 text-left transition-all duration-200 cursor-pointer
                  {selectedScope === opt.id
                    ? 'border-ind-accent bg-ind-accent/5'
                    : 'border-ind-border/40 hover:border-ind-border'}"
              >
                <div class="font-black text-sm uppercase tracking-tight
                  {selectedScope === opt.id ? 'text-white' : 'text-ind-steel'}">{opt.label}</div>
                <div class="text-xs mt-1 {selectedScope === opt.id ? 'text-ind-steel' : 'text-ind-steel/40'}">{opt.sub}</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Urgency -->
        <div>
          <label class="ind-metadata text-ind-steel/70 text-xs block mb-3">03 / TIMELINE</label>
          <div class="grid grid-cols-3 gap-3">
            {#each urgencyOptions as opt}
              <button
                onclick={() => selectedUrgency = opt.id}
                class="ind-steel-plate p-4 text-left transition-all duration-200 cursor-pointer
                  {selectedUrgency === opt.id
                    ? 'border-ind-accent bg-ind-accent/5'
                    : 'border-ind-border/40 hover:border-ind-border'}"
              >
                <div class="font-black text-sm uppercase tracking-tight
                  {selectedUrgency === opt.id ? 'text-white' : 'text-ind-steel'}">{opt.label}</div>
                <div class="text-xs mt-1 {selectedUrgency === opt.id ? 'text-ind-steel' : 'text-ind-steel/40'}">{opt.sub}</div>
              </button>
            {/each}
          </div>
        </div>

      </div>

      <!-- Result card -->
      <div class="ind-steel-plate p-8 lg:sticky lg:top-8">
        {#if estimate}
          <div class="ind-metadata text-ind-steel/50 text-xs mb-4">ESTIMATED RANGE</div>

          <div class="text-5xl font-black text-ind-accent tracking-tighter mb-1 leading-none">
            {fmt(estimate.min)}
          </div>
          <div class="text-ind-steel/60 text-sm font-bold mb-1">to</div>
          <div class="text-5xl font-black text-ind-accent tracking-tighter leading-none mb-6">
            {fmt(estimate.max)}{estimate.plus ? '+' : ''}
          </div>

          {#if urgencyNote}
            <p class="text-ind-steel/70 text-xs mb-4 border-l-2 border-ind-accent/40 pl-3">{urgencyNote}</p>
          {/if}

          <p class="text-ind-steel/50 text-xs mb-8 leading-relaxed">
            Rough range only, not a quote. More accurate after photos or an on-site visit. Scope and materials can shift numbers significantly — Aaron provides the final price.
          </p>

          <a
            href="tel:+16104126424"
            class="ind-button flex items-center justify-center gap-3 px-6 py-4 text-sm font-black uppercase tracking-wider w-full"
          >
            <Phone size={15} /> Call / Text Aaron
          </a>

          <div class="ind-rivet top-3 left-3"></div>
          <div class="ind-rivet top-3 right-3"></div>

        {:else}
          <div class="text-center py-4">
            <div class="ind-metadata text-ind-steel/30 text-xs mb-6">SELECT A SERVICE TO SEE RANGES</div>
            <div class="text-7xl font-black text-ind-border/40 tracking-tighter mb-6 leading-none">
              $?
            </div>
            <p class="text-ind-steel/40 text-xs leading-relaxed">
              Pick a service above to see a rough starting range before you call.
            </p>
          </div>
        {/if}
      </div>

    </div>

    <!-- Disclaimer -->
    <div class="mt-12 pt-8 border-t border-ind-border/20 text-center">
      <p class="text-ind-steel/40 text-xs ind-metadata">
        ROUGH RANGES ONLY &mdash; NOT QUOTES. MORE ACCURATE AFTER PHOTOS OR ON-SITE VISIT.
        CALL OR TEXT AARON FOR EXACT PRICING:
        <a href="tel:+16104126424" class="text-ind-accent/60 hover:text-ind-accent transition-colors">(610) 412-6424</a>
      </p>
    </div>

  </div>
</section>
