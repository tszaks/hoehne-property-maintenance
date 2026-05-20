<script lang="ts">
  import { Phone } from 'phosphor-svelte';

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
    { label: 'Quick touch-up / tiny', sub: 'Minimal work, quick job',        mult: 0.65 },
    { label: 'Small',                  sub: 'Below-average scope',            mult: 0.85 },
    { label: 'Standard',               sub: 'Typical job',                    mult: 1.0  },
    { label: 'Large',                  sub: 'More than average',              mult: 1.3  },
    { label: 'Extensive / complex',    sub: 'Heavy scope or unknowns',        mult: 1.65 },
  ];

  const conditionOptions = [
    { label: 'Clean / ready',           sub: 'Minimal prep needed',            mult: 0.9  },
    { label: 'Minor prep',              sub: 'Some cleanup or light patching', mult: 1.0  },
    { label: 'Moderate prep',           sub: 'Notable repair or prep work',    mult: 1.18 },
    { label: 'Heavy repair / unknowns', sub: 'Significant prep or surprises',  mult: 1.4  },
  ];

  const urgencyOptions = [
    { label: 'Flexible',       sub: 'No rush, fit into schedule',  mult: 1.0,  note: '' },
    { label: 'Within a month', sub: 'Schedule within 4 weeks',     mult: 1.08, note: 'Scheduling priority may add ~8%.' },
    { label: 'Soon / 2 weeks', sub: 'Need it in about 2 weeks',    mult: 1.15, note: 'Near-term scheduling typically adds ~15%.' },
    { label: 'Rush / ASAP',    sub: 'Same week or emergency',      mult: 1.28, note: 'Rush requests typically add 20-30%.' },
  ];

  let selectedId = $state('');
  let scopeIndex = $state(2);
  let conditionIndex = $state(1);
  let urgencyIndex = $state(0);

  const selected = $derived(services.find(s => s.id === selectedId));

  const estimate = $derived.by(() => {
    if (!selected) return null;
    const sMult = scopeOptions[scopeIndex].mult;
    const cMult = conditionOptions[conditionIndex].mult;
    const uMult = urgencyOptions[urgencyIndex].mult;
    const round25 = (n: number) => Math.round(n / 25) * 25;
    return {
      min: round25(selected.min * sMult * cMult * uMult),
      max: round25(selected.max * sMult * cMult * uMult),
      plus: selected.plus,
    };
  });

  const urgencyNote = $derived(urgencyOptions[urgencyIndex].note);

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
        Pick your project, scope, and timeline to see a rough starting range — not a quote. We give exact pricing after seeing the job or photos. The chat assistant below can also estimate, but will ask project questions first so the range is not random.
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

        <!-- Scope slider -->
        <div>
          <label for="scope-slider" class="ind-metadata text-ind-steel/70 text-xs block mb-4">02 / PROJECT SIZE / SCOPE</label>
          <input
            id="scope-slider"
            type="range"
            min="0"
            max="4"
            step="1"
            bind:value={scopeIndex}
            style="--pct: {(scopeIndex / 4 * 100).toFixed(1)}%"
            class="est-slider"
            aria-label="Project size and scope"
            aria-valuetext={scopeOptions[scopeIndex].label}
          />
          <div class="flex justify-between mt-1.5 px-0.5">
            {#each scopeOptions as opt, i}
              <div class="w-0.5 h-1.5 transition-colors {i === scopeIndex ? 'bg-ind-accent' : 'bg-ind-border'}"></div>
            {/each}
          </div>
          <div class="mt-3 flex items-baseline gap-2 flex-wrap">
            <span class="font-black text-sm uppercase tracking-tight text-white">{scopeOptions[scopeIndex].label}</span>
            <span class="text-xs text-ind-steel/60">&mdash; {scopeOptions[scopeIndex].sub}</span>
          </div>
        </div>

        <!-- Condition slider -->
        <div>
          <label for="condition-slider" class="ind-metadata text-ind-steel/70 text-xs block mb-4">03 / CONDITION / PREP NEEDED</label>
          <input
            id="condition-slider"
            type="range"
            min="0"
            max="3"
            step="1"
            bind:value={conditionIndex}
            style="--pct: {(conditionIndex / 3 * 100).toFixed(1)}%"
            class="est-slider"
            aria-label="Condition and prep needed"
            aria-valuetext={conditionOptions[conditionIndex].label}
          />
          <div class="flex justify-between mt-1.5 px-0.5">
            {#each conditionOptions as opt, i}
              <div class="w-0.5 h-1.5 transition-colors {i === conditionIndex ? 'bg-ind-accent' : 'bg-ind-border'}"></div>
            {/each}
          </div>
          <div class="mt-3 flex items-baseline gap-2 flex-wrap">
            <span class="font-black text-sm uppercase tracking-tight text-white">{conditionOptions[conditionIndex].label}</span>
            <span class="text-xs text-ind-steel/60">&mdash; {conditionOptions[conditionIndex].sub}</span>
          </div>
        </div>

        <!-- Timeline slider -->
        <div>
          <label for="timeline-slider" class="ind-metadata text-ind-steel/70 text-xs block mb-4">04 / TIMELINE</label>
          <input
            id="timeline-slider"
            type="range"
            min="0"
            max="3"
            step="1"
            bind:value={urgencyIndex}
            style="--pct: {(urgencyIndex / 3 * 100).toFixed(1)}%"
            class="est-slider"
            aria-label="Timeline"
            aria-valuetext={urgencyOptions[urgencyIndex].label}
          />
          <div class="flex justify-between mt-1.5 px-0.5">
            {#each urgencyOptions as opt, i}
              <div class="w-0.5 h-1.5 transition-colors {i === urgencyIndex ? 'bg-ind-accent' : 'bg-ind-border'}"></div>
            {/each}
          </div>
          <div class="mt-3 flex items-baseline gap-2 flex-wrap">
            <span class="font-black text-sm uppercase tracking-tight text-white">{urgencyOptions[urgencyIndex].label}</span>
            <span class="text-xs text-ind-steel/60">&mdash; {urgencyOptions[urgencyIndex].sub}</span>
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
            Rough range only, not a quote. More accurate after photos or an on-site visit. Scope and materials can shift numbers significantly — we provide the final price.
          </p>

          <a
            href="tel:+16104126424"
            class="ind-button flex items-center justify-center gap-3 px-6 py-4 text-sm font-black uppercase tracking-wider w-full"
          >
            <Phone size={15} /> Call / Text Us
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
        CALL OR TEXT US FOR EXACT PRICING:
        <a href="tel:+16104126424" class="text-ind-accent/60 hover:text-ind-accent transition-colors">(610) 412-6424</a>
      </p>
    </div>

  </div>
</section>

<style>
  .est-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    outline: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: block;
    background: transparent;
  }

  .est-slider::-webkit-slider-runnable-track {
    height: 6px;
    background: linear-gradient(
      to right,
      #C2510F 0%,
      #C2510F var(--pct, 0%),
      #262626 var(--pct, 0%),
      #262626 100%
    );
  }

  .est-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 26px;
    height: 26px;
    background: #C2510F;
    cursor: pointer;
    margin-top: -10px;
    border: 2px solid #0a0a0a;
  }

  .est-slider::-moz-range-track {
    height: 6px;
    background: #262626;
    border: none;
  }

  .est-slider::-moz-range-progress {
    height: 6px;
    background: #C2510F;
  }

  .est-slider::-moz-range-thumb {
    -moz-appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 0;
    background: #C2510F;
    border: 2px solid #0a0a0a;
    cursor: pointer;
  }

  .est-slider:focus-visible::-webkit-slider-thumb {
    outline: 2px solid #C2510F;
    outline-offset: 3px;
  }

  .est-slider:focus-visible::-moz-range-thumb {
    outline: 2px solid #C2510F;
    outline-offset: 3px;
  }
</style>
