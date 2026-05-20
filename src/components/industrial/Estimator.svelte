<script lang="ts">
  import { ArrowRight, Phone, UploadSimple, X } from 'phosphor-svelte';
  import {
    accessOptions,
    conditionOptions,
    estimateProject,
    finishOptions,
    fmtCurrency,
    homeAgeOptions,
    homeTypeOptions,
    projectProfiles,
    scopeOptions,
    tradeOptions,
    urgencyOptions,
    type ProjectEstimate,
    type ServiceId,
  } from '../../data/estimate-engine';

  let selectedId = $state<ServiceId>('bathroom');
  let quantity = $state(55);
  let scopeId = $state('standard');
  let conditionId = $state('normal');
  let finishId = $state('standard');
  let homeAgeId = $state('standard');
  let homeTypeId = $state('single');
  let accessId = $state('normal');
  let tradeId = $state('none');
  let urgencyId = $state('flexible');
  let location = $state('');
  let photoFileEl: HTMLInputElement | undefined = $state(undefined);
  let photoDataUrl = $state('');
  let photoName = $state('');
  let photoReview = $state('');
  let photoError = $state('');
  let photoLoading = $state(false);

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
      scopeId,
      conditionId,
      finishId,
      homeAgeId,
      homeTypeId,
      accessId,
      tradeId,
      urgencyId,
    }),
  );

  function chooseService(id: ServiceId) {
    selectedId = id;
    const next = projectProfiles.find((service) => service.id === id);
    if (next) quantity = next.defaultQuantity;
  }

  function chooseOption(kind: 'scope' | 'condition' | 'finish' | 'homeAge' | 'homeType' | 'access' | 'trade' | 'urgency', id: string) {
    if (kind === 'scope') scopeId = id;
    if (kind === 'condition') conditionId = id;
    if (kind === 'finish') finishId = id;
    if (kind === 'homeAge') homeAgeId = id;
    if (kind === 'homeType') homeTypeId = id;
    if (kind === 'access') accessId = id;
    if (kind === 'trade') tradeId = id;
    if (kind === 'urgency') urgencyId = id;
  }

  function categoryLabel(category: string): string {
    if (category === 'business') return 'Project costs';
    if (category === 'risk') return 'Unknowns';
    if (category === 'specialty') return 'Specialist';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  function optionLabel(options: { id: string; label: string }[], id: string): string {
    return options.find((option) => option.id === id)?.label ?? id;
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Unable to read image.'));
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoChange() {
    photoError = '';
    photoReview = '';
    const file = photoFileEl?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      photoError = 'Please attach a photo file.';
      return;
    }
    if (file.size > 4_500_000) {
      photoError = 'Please attach a photo under 4.5 MB.';
      return;
    }

    try {
      photoDataUrl = await fileToDataUrl(file);
      photoName = file.name;
    } catch {
      photoError = 'Unable to read that photo. Please try another image.';
    }
  }

  function clearPhoto() {
    photoDataUrl = '';
    photoName = '';
    photoReview = '';
    photoError = '';
    if (photoFileEl) photoFileEl.value = '';
  }

  async function reviewPhoto() {
    if (!photoDataUrl || photoLoading) return;
    photoLoading = true;
    photoError = '';
    photoReview = '';

    const formSummary = [
      `Project type: ${selected.label}`,
      `Amount: ${quantity} ${selected.quantityUnit}`,
      `Job level: ${optionLabel(scopeOptions, scopeId)}`,
      `Condition: ${optionLabel(conditionOptions, conditionId)}`,
      `Quality level: ${optionLabel(finishOptions, finishId)}`,
      `Home age: ${optionLabel(homeAgeOptions, homeAgeId)}`,
      `Home type: ${optionLabel(homeTypeOptions, homeTypeId)}`,
      `Access: ${optionLabel(accessOptions, accessId)}`,
      `Moving plumbing, electric, walls, or layout: ${optionLabel(tradeOptions, tradeId)}`,
      `Timeline: ${optionLabel(urgencyOptions, urgencyId)}`,
      location.trim() ? `Town or ZIP: ${location.trim()}` : '',
      `Current rough range: ${fmtCurrency(estimate.low)}-${fmtCurrency(estimate.high)}`,
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Review this attached project photo against the estimate form below. Keep it simple. Say what the photo shows, the one best question to ask next, and what could change the price range. Do not mention bots, models, or artificial intelligence.\n\n${formSummary}`,
              imageUrl: photoDataUrl,
              imageName: photoName,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        photoError = data.error || 'Unable to review that photo right now.';
      } else {
        photoReview = data.content;
      }
    } catch {
      photoError = 'Unable to review that photo right now.';
    } finally {
      photoLoading = false;
    }
  }
</script>

<section id="estimate" class="py-24 lg:py-28 bg-ind-surface relative z-10">
  <div class="max-w-7xl mx-auto px-6 lg:px-12">
    <div class="mb-12">
      <div class="ind-metadata mb-4">PROJECT ESTIMATE // ADD PHOTOS // LOCAL RANGE</div>
      <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase max-w-4xl">
        Get A Rough Project Estimate
      </h1>
      <p class="text-ind-steel text-sm mt-5 max-w-2xl leading-relaxed">
        Answer a few walkthrough-style questions. Add photos if you have them. This gives a useful planning range, not a final quote.
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

        <div>
          <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">03 / TYPE OF JOB</div>
          <div class="grid sm:grid-cols-2 gap-2">
            {#each scopeOptions as option}
              <button
                type="button"
                onclick={() => chooseOption('scope', option.id)}
                class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {scopeId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
              >
                <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">04 / CONDITION</div>
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
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">05 / QUALITY LEVEL</div>
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
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">08 / ACCESS</div>
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
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">10 / TIMING</div>
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

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">06 / HOME AGE</div>
            <div class="space-y-2">
              {#each homeAgeOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('homeAge', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {homeAgeId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">07 / HOME TYPE</div>
            <div class="space-y-2">
              {#each homeTypeOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('homeType', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {homeTypeId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-[1fr_220px] gap-6">
          <div>
            <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">09 / MOVING THINGS?</div>
            <div class="grid sm:grid-cols-2 gap-2">
              {#each tradeOptions as option}
                <button
                  type="button"
                  onclick={() => chooseOption('trade', option.id)}
                  class="w-full text-left border px-4 py-3 transition-colors bg-ind-bg {tradeId === option.id ? 'border-ind-accent text-white' : 'border-ind-border/40 text-ind-steel hover:border-ind-accent/60'}"
                >
                  <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                  <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                </button>
              {/each}
            </div>
          </div>

          <label class="block">
            <span class="ind-metadata text-ind-steel/70 text-xs block mb-3">TOWN OR ZIP</span>
            <input
              type="text"
              bind:value={location}
              placeholder="Pottstown, 19464..."
              class="w-full bg-ind-bg border border-ind-border/50 text-white text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
            />
            <span class="block text-[0.68rem] text-ind-steel/50 mt-2">This helps with travel, parking, and local rules.</span>
          </label>
        </div>

        <div id="photo-review" class="border border-ind-border/40 bg-ind-bg p-5">
          <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">11 / PHOTOS</div>
          <div class="grid md:grid-cols-[1fr_auto] gap-5 items-start">
            <div>
              <h2 class="text-lg font-black text-white uppercase tracking-tight mb-2">Add Photos</h2>
              <p class="text-ind-steel/65 text-sm leading-relaxed">
                Photos help us see the work area, materials, visible damage, and anything that may affect the range. Hidden problems and final pricing still need an on-site look.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 md:justify-end">
              <input
                bind:this={photoFileEl}
                onchange={handlePhotoChange}
                type="file"
                accept="image/*"
                class="sr-only"
                aria-label="Attach project photo"
              />
              <button
                type="button"
                onclick={() => photoFileEl?.click()}
                disabled={photoLoading}
                class="border border-ind-border/60 text-ind-steel hover:border-ind-accent hover:text-ind-accent px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-40"
              >
                <UploadSimple size={16} class="inline mr-2" /> Add Photo
              </button>
              <button
                type="button"
                onclick={reviewPhoto}
                disabled={!photoDataUrl || photoLoading}
                class="ind-button px-4 py-3 text-xs font-black uppercase tracking-wider disabled:opacity-40"
              >
                {photoLoading ? 'Checking...' : 'Check Photo'}
              </button>
            </div>
          </div>

          {#if photoDataUrl}
            <div class="mt-5 grid md:grid-cols-[96px_1fr_auto] gap-4 items-center border-t border-ind-border/25 pt-4">
              <img src={photoDataUrl} alt={photoName || 'Attached project'} class="h-24 w-24 object-cover border border-ind-border/60" />
              <div class="min-w-0">
                <div class="text-white text-sm font-black truncate">{photoName || 'Project photo attached'}</div>
                <div class="ind-metadata text-ind-steel/50 text-xs mt-1">Ready to check</div>
              </div>
              <button type="button" onclick={clearPhoto} disabled={photoLoading} class="text-ind-steel hover:text-white p-2 transition-colors disabled:opacity-40" aria-label="Remove photo">
                <X size={18} />
              </button>
            </div>
          {/if}

          {#if photoError}
            <div class="mt-4 border border-red-800/40 bg-red-900/20 text-red-300 text-sm px-4 py-3">{photoError}</div>
          {/if}

          {#if photoReview}
            <div class="mt-4 border border-ind-accent/30 bg-ind-surface px-4 py-3 text-ind-steel text-sm leading-relaxed whitespace-pre-line">{photoReview}</div>
          {/if}
        </div>
      </div>

      <aside class="ind-steel-plate p-6 lg:p-8 xl:sticky xl:top-20">
        <div class="flex items-center justify-between gap-4 mb-5">
          <div>
            <div class="ind-metadata text-ind-steel/50 text-xs mb-1">ESTIMATE RANGE</div>
            <div class="text-white text-sm font-black uppercase tracking-wide">{estimate.profile.label}</div>
          </div>
          <div class="text-right">
            <div class="text-ind-accent font-black text-lg leading-none">{estimate.confidenceLabel}</div>
            <div class="text-[0.65rem] text-ind-steel/50 uppercase tracking-widest">range detail</div>
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
          <div class="ind-metadata text-ind-steel/50 text-xs mb-3">COULD CHANGE THE PRICE</div>
          <div class="flex flex-wrap gap-2">
            {#each estimate.escalationTriggers.slice(0, 6) as trigger}
              <span class="text-[0.68rem] border border-ind-border/40 text-ind-steel/70 px-2 py-1 uppercase tracking-wide">{trigger}</span>
            {/each}
          </div>
        </div>

        <p class="text-ind-steel/55 text-xs leading-relaxed mb-6">
          Photos and an on-site visit can improve this range. Hidden damage, permits, specialist work, and material choices can change the final price.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <a href="tel:+16104126424" class="ind-button flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider">
            <Phone size={14} /> Call
          </a>
          <a href="#photo-review" class="border border-ind-accent text-ind-accent hover:bg-ind-accent hover:text-black flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-colors">
            Photos <ArrowRight size={14} />
          </a>
        </div>
      </aside>
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
