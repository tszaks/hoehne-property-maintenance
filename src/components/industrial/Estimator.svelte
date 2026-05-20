<script lang="ts">
  import { ArrowRight, Phone } from 'phosphor-svelte';
  import {
    accessOptions,
    conditionOptions,
    estimateProject,
    finishOptions,
    fmtCurrency,
    projectProfiles,
    urgencyOptions,
    type ProjectEstimate,
    type ServiceId,
  } from '../../data/estimate-engine';

  let selectedId = $state<ServiceId>('bathroom');
  let quantity = $state(55);
  let conditionId = $state('normal');
  let finishId = $state('standard');
  let accessId = $state('normal');
  let urgencyId = $state('flexible');

  const selected = $derived(projectProfiles.find((service) => service.id === selectedId) ?? projectProfiles[0]);

  $effect(() => {
    if (quantity < selected.minQuantity || quantity > selected.maxQuantity) {
      quantity = selected.defaultQuantity;
    }
  });

  const estimate: ProjectEstimate = $derived(
    estimateProject({
      serviceId: selected.id,
      quantity,
      conditionId,
      finishId,
      accessId,
      urgencyId,
    }),
  );

  function chooseService(id: ServiceId) {
    selectedId = id;
    const next = projectProfiles.find((service) => service.id === id);
    if (next) quantity = next.defaultQuantity;
  }

  function chooseOption(kind: 'condition' | 'finish' | 'access' | 'urgency', id: string) {
    if (kind === 'condition') conditionId = id;
    if (kind === 'finish') finishId = id;
    if (kind === 'access') accessId = id;
    if (kind === 'urgency') urgencyId = id;
  }

  function categoryLabel(category: string): string {
    if (category === 'business') return 'Overhead';
    if (category === 'risk') return 'Contingency';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
</script>

<section id="estimate" class="py-24 lg:py-28 bg-ind-surface relative z-10">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="mb-12">
      <div class="ind-metadata mb-4">PROJECT ESTIMATOR // PHOTO REVIEW // LOCAL RANGES</div>
      <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-4xl">
        Build a Smarter Rough Range Before We Visit
      </h1>
      <p class="text-ind-steel text-sm mt-5 max-w-2xl leading-relaxed">
        This is still not a quote. It is a trade-aware planning tool that factors labor, materials, access, finish level, scheduling, overhead, profit, and contingency. Photos can help tighten the next questions.
      </p>
    </div>

    <div class="grid xl:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
      <div class="space-y-8">
        <div>
          <label class="ind-metadata text-ind-steel/70 text-xs block mb-3">01 / PROJECT TYPE</label>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {#each projectProfiles as service}
              <button
                type="button"
                onclick={() => chooseService(service.id)}
                class="text-left border px-4 py-3 transition-colors bg-ind-bg {selected.id === service.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
              >
                <span class="block text-xs font-black uppercase tracking-wide">{service.shortLabel}</span>
                <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{service.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="grid lg:grid-cols-[1fr_170px] gap-5 items-end">
          <div>
            <label for="quantity-slider" class="ind-metadata text-ind-steel/70 text-xs block mb-4">02 / {selected.quantityLabel}</label>
            <input
              id="quantity-slider"
              type="range"
              min={selected.minQuantity}
              max={selected.maxQuantity}
              step={selected.step}
              bind:value={quantity}
              style="--pct: {(((quantity - selected.minQuantity) / (selected.maxQuantity - selected.minQuantity)) * 100).toFixed(2)}%"
              class="est-slider"
              aria-label={selected.quantityLabel}
            />
            <div class="mt-3 text-xs text-ind-steel/60 leading-relaxed">{selected.quantityHelp}</div>
          </div>
          <label class="block">
            <span class="ind-metadata text-ind-steel/70 text-xs block mb-3">QUANTITY</span>
            <input
              type="number"
              min={selected.minQuantity}
              max={selected.maxQuantity}
              step={selected.step}
              bind:value={quantity}
              class="w-full bg-ind-bg border border-ind-border/50 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent"
            />
            <span class="block text-[0.68rem] text-ind-steel/50 mt-2">{selected.quantityUnit}</span>
          </label>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">03 / CONDITION</div>
            <div class="space-y-2">
              {#each conditionOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('condition', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {conditionId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">04 / FINISH LEVEL</div>
            <div class="space-y-2">
              {#each finishOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('finish', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {finishId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">05 / ACCESS</div>
            <div class="space-y-2">
              {#each accessOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('access', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {accessId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">06 / TIMELINE</div>
            <div class="space-y-2">
              {#each urgencyOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('urgency', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {urgencyId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <aside class="ind-steel-plate p-6 lg:p-8 xl:sticky xl:top-20">
        <div class="flex items-center justify-between gap-4 mb-5">
          <div>
            <div class="ind-metadata text-ind-steel/50 text-xs mb-1">ROUGH PLANNING RANGE</div>
            <div class="text-white text-sm font-black uppercase tracking-wide">{estimate.profile.label}</div>
          </div>
          <div class="text-right">
            <div class="text-ind-accent font-black text-lg leading-none">{estimate.confidenceLabel}</div>
            <div class="text-[0.65rem] text-ind-steel/50 uppercase tracking-widest">{estimate.confidence}% confidence</div>
          </div>
        </div>

        <div class="border-y border-ind-border/30 py-6 mb-6">
          <div class="text-5xl font-black text-ind-accent tracking-tighter leading-none">{fmtCurrency(estimate.low)}</div>
          <div class="text-ind-steel/60 text-sm font-bold my-1">to</div>
          <div class="text-5xl font-black text-ind-accent tracking-tighter leading-none">{fmtCurrency(estimate.high)}</div>
        </div>

        <div class="space-y-3 mb-6">
          {#each estimate.lineItems as item}
            <div class="grid grid-cols-[1fr_auto] gap-3 border-b border-ind-border/20 pb-2">
              <div>
                <div class="text-white text-xs font-bold leading-snug">{item.label}</div>
                <div class="text-[0.62rem] text-ind-steel/45 uppercase tracking-widest mt-1">{categoryLabel(item.category)}</div>
              </div>
              <div class="text-ind-steel text-xs font-bold whitespace-nowrap">
                {fmtCurrency(item.low)}-{fmtCurrency(item.high)}
              </div>
            </div>
          {/each}
        </div>

        <div class="mb-6">
          <div class="ind-metadata text-ind-steel/50 text-xs mb-3">ASK NEXT IF ANY APPLY</div>
          <div class="flex flex-wrap gap-2">
            {#each estimate.escalationTriggers.slice(0, 6) as trigger}
              <span class="text-[0.68rem] border border-ind-border/40 text-ind-steel/70 px-2 py-1 uppercase tracking-wide">{trigger}</span>
            {/each}
          </div>
        </div>

        <p class="text-ind-steel/55 text-xs leading-relaxed mb-6">
          The range improves after photos or an on-site visit. Hidden damage, code issues, specialty trades, and finish selections can move the final price.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <a href="tel:+16104126424" class="ind-button flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider">
            <Phone size={14} /> Call
          </a>
          <a href="#photo-chat" class="border border-ind-accent text-ind-accent hover:bg-ind-accent hover:text-black flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-colors">
            Photos <ArrowRight size={14} />
          </a>
        </div>
      </aside>
    </div>

    <div id="photo-chat" class="mt-14 pt-8 border-t border-ind-border/20">
      <div class="max-w-2xl">
        <div class="ind-metadata text-ind-steel/50 text-xs mb-3">PHOTO REVIEW</div>
        <h2 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
          Want us to look at photos?
        </h2>
        <p class="text-ind-steel text-sm leading-relaxed">
          Open the chat button in the lower-left, attach a photo, and describe the project. Photos help narrow the next question by showing visible condition, materials, access, damage, and scope clues. Hidden damage, code issues, and exact quantities still need an on-site look.
        </p>
      </div>
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
</style>
