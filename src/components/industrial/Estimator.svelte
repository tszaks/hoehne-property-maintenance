<script lang="ts">
  import { ArrowRight, CheckCircle, Phone, UploadSimple, X } from 'phosphor-svelte';
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
  import { prepareProjectPhoto } from '../../lib/photo-upload';

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
  let detailIds = $state<string[]>([]);
  let location = $state('');
  let photoFileEl: HTMLInputElement | undefined = $state(undefined);
  let photoDataUrl = $state('');
  let photoName = $state('');
  let photoReview = $state('');
  let photoError = $state('');
  let photoLoading = $state(false);
  let currentStep = $state(0);
  let customerName = $state('');
  let customerEmail = $state('');
  let customerPhone = $state('');
  let projectNotes = $state('');
  let submitLoading = $state(false);
  let submitError = $state('');
  let submitSent = $state(false);
  let sentEmail = $state('');

  const selected = $derived(projectProfiles.find((service) => service.id === selectedId) ?? projectProfiles[0]);
  type StepKey = 'project' | 'scope' | 'condition' | 'home' | 'access' | 'photos' | 'send';
  const stepCopy: Record<StepKey, { key: StepKey; label: string; title: string; help: string }> = {
    project: {
      key: 'project',
      label: 'Project',
      title: 'What are we working on?',
      help: 'Pick the job type and rough amount.',
    },
    scope: {
      key: 'scope',
      label: 'Scope',
      title: 'How involved is the job?',
      help: 'Choose the closest match and mark any details that apply.',
    },
    condition: {
      key: 'condition',
      label: 'Condition',
      title: 'What shape is it in?',
      help: 'Condition and material level are big price drivers.',
    },
    home: {
      key: 'home',
      label: 'Home',
      title: 'What kind of home is it?',
      help: 'The house, parking, and local rules can affect time on site.',
    },
    access: {
      key: 'access',
      label: 'Access',
      title: 'Anything difficult about access or timing?',
      help: 'Tell us about tight spaces, schedule needs, or layout changes.',
    },
    photos: {
      key: 'photos',
      label: 'Photos',
      title: 'Want us to look at photos?',
      help: 'Add photos if you have them.',
    },
    send: {
      key: 'send',
      label: 'Send',
      title: 'Ready to send it over?',
      help: 'Review the request and tell us how to follow up.',
    },
  };
  const steps = $derived(stepsForService(selected.id).map((key) => stepCopy[key]));
  const detailOptions = $derived(selected.detailOptions ?? []);
  const selectedDetails = $derived(detailOptions.filter((option) => detailIds.includes(option.id)));
  const currentStepInfo = $derived(steps[currentStep] ?? steps[0]);

  type EstimateRequestDetails = {
    projectLabel: string;
    rangeLow: string;
    rangeHigh: string;
    address: string;
    notes: string;
    photoAttached: boolean;
    photoName: string;
    photoNotes: string;
    answers: { label: string; value: string }[];
    lineItems: { label: string; category: string; low: string; high: string }[];
  };

  $effect(() => {
    if (quantity < selected.minQuantity || quantity > selected.maxQuantity) {
      quantity = selected.defaultQuantity;
    }
    if (currentStep >= steps.length) {
      currentStep = Math.max(0, steps.length - 1);
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
      detailIds,
    }),
  );

  function chooseService(id: ServiceId) {
    selectedId = id;
    detailIds = [];
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

  function toggleDetail(id: string) {
    detailIds = detailIds.includes(id) ? detailIds.filter((item) => item !== id) : [...detailIds, id];
  }

  function goToStep(index: number) {
    currentStep = Math.max(0, Math.min(steps.length - 1, index));
    setTimeout(() => {
      const walkthrough = document.getElementById('estimate-walkthrough');
      if (!walkthrough) return;
      const top = walkthrough.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    }, 0);
  }

  function sendStepIndex() {
    const index = steps.findIndex((step) => step.key === 'send');
    return index >= 0 ? index : steps.length - 1;
  }

  function nextStep() {
    goToStep(currentStep + 1);
  }

  function prevStep() {
    goToStep(currentStep - 1);
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

  function stepsForService(serviceId: ServiceId): StepKey[] {
    if (serviceId === 'snow-removal') return ['project', 'condition', 'access', 'photos', 'send'];
    if (serviceId === 'small-handyman' || serviceId === 'pressure-wash' || serviceId === 'lawn-cleanup' || serviceId === 'ceiling-fan') {
      return ['project', 'scope', 'condition', 'access', 'photos', 'send'];
    }
    if (serviceId === 'drywall-paint' || serviceId === 'room-painting' || serviceId === 'deck-repair') {
      return ['project', 'scope', 'condition', 'access', 'photos', 'send'];
    }
    return ['project', 'scope', 'condition', 'home', 'access', 'photos', 'send'];
  }

  function stepSummary(index: number): string {
    const key = steps[index]?.key;
    if (key === 'project') return selected.shortLabel;
    if (key === 'scope') return optionLabel(scopeOptions, scopeId);
    if (key === 'condition') return optionLabel(conditionOptions, conditionId);
    if (key === 'home') return optionLabel(homeTypeOptions, homeTypeId);
    if (key === 'access') return optionLabel(accessOptions, accessId);
    if (key === 'photos') return photoDataUrl ? 'Photo added' : 'Optional';
    if (key === 'send') return customerPhone ? 'Contact added' : 'Ready';
    return '';
  }

  async function handlePhotoChange() {
    photoError = '';
    photoReview = '';
    const file = photoFileEl?.files?.[0];
    if (!file) return;

    try {
      const prepared = await prepareProjectPhoto(file);
      photoDataUrl = prepared.dataUrl;
      photoName = prepared.name;
    } catch (error) {
      photoError = error instanceof Error ? error.message : 'Unable to read that photo. Please try another image.';
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
      selectedDetails.length ? `Project details: ${selectedDetails.map((item) => item.label).join(', ')}` : '',
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
              content: `Review this attached project photo against the estimate form below. Keep it simple. Say what the photo shows and the one best question to ask next. Keep the answer to two short paragraphs with no extra sections.\n\n${formSummary}`,
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

  function validEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function buildEstimateRequestDetails(address: string): EstimateRequestDetails {
    return {
      projectLabel: estimate.profile.label,
      rangeLow: fmtCurrency(estimate.low),
      rangeHigh: fmtCurrency(estimate.high),
      address,
      notes: projectNotes.trim(),
      photoAttached: Boolean(photoDataUrl),
      photoName: photoDataUrl ? photoName || 'Project photo attached' : '',
      photoNotes: photoReview.trim(),
      answers: [
        { label: 'Project type', value: selected.label },
        { label: 'Amount', value: `${quantity} ${selected.quantityUnit}` },
        { label: 'Job level', value: optionLabel(scopeOptions, scopeId) },
        { label: 'Project details', value: selectedDetails.length ? selectedDetails.map((item) => item.label).join(', ') : 'None selected' },
        { label: 'Condition', value: optionLabel(conditionOptions, conditionId) },
        { label: 'Quality level', value: optionLabel(finishOptions, finishId) },
        { label: 'Home age', value: optionLabel(homeAgeOptions, homeAgeId) },
        { label: 'Home type', value: optionLabel(homeTypeOptions, homeTypeId) },
        { label: 'Access', value: optionLabel(accessOptions, accessId) },
        { label: 'Moving plumbing, electric, walls, or layout', value: optionLabel(tradeOptions, tradeId) },
        { label: 'Timeline', value: optionLabel(urgencyOptions, urgencyId) },
        { label: 'Range confidence', value: `${estimate.confidenceLabel} (${estimate.confidence}/100)` },
        { label: 'Would tighten the range', value: estimate.rangeTighteners.length ? estimate.rangeTighteners.join('; ') : 'Photos or an on-site look' },
        { label: 'Address or town', value: address },
      ],
      lineItems: estimate.lineItems.map((item) => ({
        label: item.label,
        category: categoryLabel(item.category),
        low: fmtCurrency(item.low),
        high: fmtCurrency(item.high),
      })),
    };
  }

  function buildEstimateRequestMessage(details: EstimateRequestDetails) {
    return [
      'Estimate request from the project estimator.',
      '',
      'Planning range:',
      `${details.projectLabel}: ${details.rangeLow} to ${details.rangeHigh}`,
      '',
      'Project details:',
      ...details.answers.map((answer) => `${answer.label}: ${answer.value}`),
      '',
      'What this includes:',
      ...details.lineItems.map((item) => `${item.label}: ${item.low} to ${item.high}`),
      '',
      `Photo attached: ${details.photoAttached ? details.photoName || 'Yes' : 'No'}`,
      details.photoNotes ? `Photo notes:\n${details.photoNotes}` : '',
      details.notes ? `\nAdditional notes:\n${details.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  async function submitEstimateRequest(event: SubmitEvent) {
    event.preventDefault();
    submitError = '';

    const name = customerName.trim();
    const email = customerEmail.trim();
    const phone = customerPhone.trim();
    const address = location.trim();

    if (!name || !phone || !address) {
      submitError = 'Please add your name, phone, and address or town.';
      return;
    }

    if (email && !validEmail(email)) {
      submitError = 'Please enter a valid email address.';
      return;
    }

    submitLoading = true;
    const estimateRequest = buildEstimateRequestDetails(address);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: buildEstimateRequestMessage(estimateRequest),
          estimateRequest,
          photoDataUrl: photoDataUrl || undefined,
          photoName: photoName || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        submitError = data.error || 'Unable to send the request right now. Please call or text us.';
      } else {
        submitSent = true;
        sentEmail = email || phone;
        setTimeout(() => {
          document.getElementById('estimate-request')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }, 0);
      }
    } catch {
      submitError = 'Unable to send the request right now. Please call or text us.';
    } finally {
      submitLoading = false;
    }
  }
</script>

<section id="estimate" class="pt-6 pb-16 sm:pt-16 sm:pb-20 lg:py-28 bg-ind-surface relative z-10 overflow-x-clip">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
    <div class="mb-8 lg:mb-12">
      <div class="ind-metadata mb-4">Project estimate · Photos · Local range</div>
      <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-ink tracking-tight max-w-4xl leading-[1.02]">
        Get a rough project estimate
      </h1>
      <p class="text-ind-steel text-sm mt-5 max-w-2xl leading-relaxed">
        Answer a few clear questions. Add photos if you have them. This gives a useful planning range, not a final quote.
      </p>
    </div>

    <div class="grid xl:grid-cols-[minmax(0,1fr)_420px] gap-6 lg:gap-12 items-start">
      <div id="estimate-walkthrough" class="ind-steel-plate min-w-0 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div class="-mx-2 overflow-x-auto px-2 pb-1">
          <div class="flex min-w-max gap-2">
            {#each steps as step, index}
              <button
                type="button"
                onclick={() => goToStep(index)}
                aria-current={currentStep === index ? 'step' : undefined}
                class="scroll-mt-24 w-[112px] shrink-0 text-left border px-3 py-3 transition-colors bg-ind-bg {currentStep === index ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
              >
                <span class="block text-[0.62rem] font-black uppercase tracking-widest text-ind-steel/50">{String(index + 1).padStart(2, '0')}</span>
                <span class="block text-[0.68rem] font-black uppercase tracking-wide mt-1 truncate">{step.label}</span>
                <span class="hidden sm:block text-[0.62rem] text-ind-steel/55 mt-1 truncate">{stepSummary(index)}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="xl:hidden mt-4 border border-ind-border/40 bg-ind-bg px-4 py-3">
          <div class="ind-metadata text-ind-steel/50 text-[0.65rem] mb-1">ESTIMATE RANGE</div>
          <div class="flex items-baseline gap-2 text-ind-accent font-black">
            <span class="text-2xl leading-none">{fmtCurrency(estimate.low)}</span>
            <span class="text-ind-steel/55 text-xs">to</span>
            <span class="text-xl leading-none text-ind-accent/75">{fmtCurrency(estimate.high)}</span>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[0.68rem] text-ind-steel/70">
            <span class="border border-ind-border/50 px-2 py-1">Confidence: {estimate.confidenceLabel}</span>
            {#if estimate.rangeTighteners[0]}
              <span>{estimate.rangeTighteners[0]}</span>
            {/if}
          </div>
        </div>

        <div class="mt-5 sm:mt-6 border-t border-ind-border/25 pt-5 min-w-0">
          <div class="mb-6 sm:mb-7 min-w-0">
            <div class="ind-metadata text-ind-steel/50 text-xs mb-2">STEP {currentStep + 1} / {steps.length}</div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-ink tracking-tight leading-tight">{currentStepInfo.title}</h2>
            <p class="text-ind-steel/65 text-sm mt-2 max-w-2xl leading-relaxed">{currentStepInfo.help}</p>
          </div>

          {#if currentStepInfo.key === 'project'}
            <div class="space-y-6 sm:space-y-8 min-w-0">
              <div>
                <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">PROJECT TYPE</div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 min-w-0">
                  {#each projectProfiles as service}
                    <button
                      type="button"
                      onclick={() => chooseService(service.id)}
                      class="min-w-0 text-left border px-4 py-3 min-h-[60px] sm:min-h-[64px] transition-colors bg-ind-bg {selected.id === service.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                    >
                      <span class="block text-xs font-black uppercase tracking-wide">{service.shortLabel}</span>
                      <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{service.label}</span>
                    </button>
                  {/each}
                </div>
              </div>

              <div class="grid lg:grid-cols-[minmax(0,1fr)_170px] gap-5 items-end min-w-0">
                <div>
                  <label for="quantity-slider" class="ind-metadata text-ind-steel/70 text-xs block mb-4">{selected.quantityLabel}</label>
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
                    class="w-full bg-ind-bg border border-ind-border/50 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent"
                  />
                  <span class="block text-[0.68rem] text-ind-steel/50 mt-2">{selected.quantityUnit}</span>
                </label>
              </div>
            </div>
          {/if}

          {#if currentStepInfo.key === 'scope'}
            <div class="space-y-7">
              <div>
                <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">TYPE OF JOB</div>
                <div class="grid sm:grid-cols-2 gap-2 min-w-0">
                  {#each scopeOptions as option}
                    <button
                      type="button"
                      onclick={() => chooseOption('scope', option.id)}
                      class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {scopeId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                    >
                      <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                      <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                    </button>
                  {/each}
                </div>
              </div>

              {#if detailOptions.length}
                <div>
                  <div class="flex items-end justify-between gap-4 mb-3">
                    <div>
                      <div class="ind-metadata text-ind-steel/70 text-xs block">PROJECT DETAILS</div>
                      <p class="text-xs text-ind-steel/60 mt-1">Tap anything that applies. Leave blank if none of these fit.</p>
                    </div>
                    {#if selectedDetails.length}
                      <button type="button" onclick={() => detailIds = []} class="text-xs font-bold text-ind-steel hover:text-ink">Clear</button>
                    {/if}
                  </div>
                  <div class="grid sm:grid-cols-2 gap-2 min-w-0">
                    {#each detailOptions as option}
                      <button
                        type="button"
                        onclick={() => toggleDetail(option.id)}
                        aria-pressed={detailIds.includes(option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[68px] transition-colors bg-ind-bg {detailIds.includes(option.id) ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          {#if currentStepInfo.key === 'condition'}
            <div class="space-y-7">
              <div class="grid md:grid-cols-2 gap-6 min-w-0">
                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">CONDITION</div>
                  <div class="space-y-2">
                    {#each conditionOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('condition', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {conditionId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>

                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">QUALITY LEVEL</div>
                  <div class="space-y-2">
                    {#each finishOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('finish', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {finishId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}

          {#if currentStepInfo.key === 'home'}
            <div class="space-y-7">
              <div class="grid md:grid-cols-2 gap-6 min-w-0">
                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">HOME AGE</div>
                  <div class="space-y-2">
                    {#each homeAgeOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('homeAge', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {homeAgeId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>

                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">HOME TYPE</div>
                  <div class="space-y-2">
                    {#each homeTypeOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('homeType', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {homeTypeId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              </div>

              <label class="block max-w-md min-w-0">
                <span class="ind-metadata text-ind-steel/70 text-xs block mb-3">TOWN OR ZIP</span>
                <input
                  type="text"
                  bind:value={location}
                  placeholder="Pottstown, 19464..."
                  class="w-full bg-ind-bg border border-ind-border/50 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                />
                <span class="block text-[0.68rem] text-ind-steel/50 mt-2">This helps with travel, parking, and local rules.</span>
              </label>
            </div>
          {/if}

          {#if currentStepInfo.key === 'access'}
            <div class="space-y-7">
              <div class="grid md:grid-cols-2 gap-6 min-w-0">
                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">ACCESS</div>
                  <div class="space-y-2">
                    {#each accessOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('access', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {accessId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>

                <div>
                  <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">TIMING</div>
                  <div class="space-y-2">
                    {#each urgencyOptions as option}
                      <button
                        type="button"
                        onclick={() => chooseOption('urgency', option.id)}
                        class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {urgencyId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                      >
                        <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                        <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              </div>

              <div>
                <div class="ind-metadata text-ind-steel/70 text-xs block mb-3">MOVING THINGS?</div>
                <div class="grid sm:grid-cols-2 gap-2 min-w-0">
                  {#each tradeOptions as option}
                    <button
                      type="button"
                      onclick={() => chooseOption('trade', option.id)}
                      class="w-full min-w-0 text-left border px-4 py-3 min-h-[64px] transition-colors bg-ind-bg {tradeId === option.id ? 'border-ind-accent text-ink' : 'border-ind-border/45 text-ind-steel hover:border-ind-accent/60'}"
                    >
                      <span class="block text-xs font-black uppercase tracking-wide">{option.label}</span>
                      <span class="block text-[0.68rem] text-ind-steel/60 mt-1 leading-snug">{option.sub}</span>
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          {#if currentStepInfo.key === 'photos'}
            <div id="photo-review" class="scroll-mt-24 border border-ind-border/40 bg-ind-bg p-5">
              <div class="grid md:grid-cols-[1fr_auto] gap-5 items-start">
                <div>
                  <h3 class="text-lg font-bold text-ink tracking-tight mb-2">Add photos</h3>
                  <p class="text-ind-steel/65 text-sm leading-relaxed">
                    Photos help us see the work area, materials, and visible damage.
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
                    {photoLoading ? 'Reviewing...' : 'Review Photo'}
                  </button>
                </div>
              </div>

              {#if photoDataUrl}
                <div class="mt-5 grid md:grid-cols-[96px_1fr_auto] gap-4 items-center border-t border-ind-border/25 pt-4">
                  <img src={photoDataUrl} alt={photoName || 'Attached project'} class="h-24 w-24 object-cover border border-ind-border/60" />
                  <div class="min-w-0">
                    <div class="text-ink text-sm font-black truncate">{photoName || 'Project photo attached'}</div>
                    <div class="ind-metadata text-ind-steel/50 text-xs mt-1">Ready to check</div>
                  </div>
                  <button type="button" onclick={clearPhoto} disabled={photoLoading} class="text-ind-steel hover:text-ink p-2 transition-colors disabled:opacity-40" aria-label="Remove photo">
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

          {/if}

          {#if currentStepInfo.key === 'send'}
            <div id="estimate-request" class="scroll-mt-24 border border-ind-accent/35 bg-ind-bg p-5">
              {#if submitSent}
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div class="h-10 w-10 shrink-0 bg-ind-accent text-black flex items-center justify-center">
                    <CheckCircle size={22} weight="bold" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-ink tracking-tight">Request sent</h3>
                    <p class="text-ind-steel/70 text-sm leading-relaxed mt-2">
                      We have your estimate request. We will review the details and call or text within 1 business day. If it is urgent, call (610) 412-6424.
                    </p>
                    <a href="tel:+16104126424" class="ind-button inline-flex items-center gap-2 px-5 py-3 mt-5 text-xs font-black uppercase tracking-wider">
                      <Phone size={14} /> Call Now
                    </a>
                  </div>
                </div>
              {:else}
                <div class="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6">
                  <div>
                    <div class="ind-metadata text-ind-steel/50 text-xs mb-3">SEND ESTIMATE REQUEST</div>
                    <h3 class="text-xl font-bold text-ink tracking-tight">Send this to us</h3>
                    <p class="text-ind-steel/65 text-sm leading-relaxed mt-3">
                      We will review your answers and photos, then call or text with the next step.
                    </p>
                    <div class="mt-5 border border-ind-border/45 bg-ind-surface/60 p-4 text-sm">
                      <div class="ind-metadata text-ind-steel/60 text-[0.65rem] mb-3">REQUEST SUMMARY</div>
                      <div class="space-y-2 text-ind-steel/80">
                        <div class="flex justify-between gap-4 border-b border-ind-border/25 pb-2">
                          <span>Project</span>
                          <strong class="text-ink text-right">{selected.label}</strong>
                        </div>
                        <div class="flex justify-between gap-4 border-b border-ind-border/25 pb-2">
                          <span>Range</span>
                          <strong class="text-ink text-right">{fmtCurrency(estimate.low)} to {fmtCurrency(estimate.high)}</strong>
                        </div>
                        <div class="flex justify-between gap-4 border-b border-ind-border/25 pb-2">
                          <span>Confidence</span>
                          <strong class="text-ink text-right">{estimate.confidenceLabel}</strong>
                        </div>
                        <div class="flex justify-between gap-4">
                          <span>Photos</span>
                          <strong class="text-ink text-right">{photoDataUrl ? 'Added' : 'Not added'}</strong>
                        </div>
                      </div>
                      {#if selectedDetails.length}
                        <div class="mt-4 flex flex-wrap gap-2">
                          {#each selectedDetails as detail}
                            <span class="border border-ind-border/50 px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-ind-steel">{detail.label}</span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  </div>

                  <form onsubmit={submitEstimateRequest} class="space-y-3">
                    <div class="grid sm:grid-cols-2 gap-3">
                      <label class="block">
                        <span class="ind-metadata text-ind-steel/60 text-[0.65rem] block mb-2">NAME *</span>
                        <input
                          type="text"
                          autocomplete="name"
                          bind:value={customerName}
                          required
                          class="w-full bg-ind-surface border border-ind-border/55 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                        />
                      </label>
                      <label class="block">
                        <span class="ind-metadata text-ind-steel/60 text-[0.65rem] block mb-2">PHONE *</span>
                        <input
                          type="tel"
                          autocomplete="tel"
                          bind:value={customerPhone}
                          required
                          class="w-full bg-ind-surface border border-ind-border/55 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                        />
                      </label>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-3">
                      <label class="block">
                        <span class="ind-metadata text-ind-steel/60 text-[0.65rem] block mb-2">EMAIL</span>
                        <input
                          type="email"
                          autocomplete="email"
                          bind:value={customerEmail}
                          class="w-full bg-ind-surface border border-ind-border/55 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                        />
                      </label>
                      <label class="block">
                        <span class="ind-metadata text-ind-steel/60 text-[0.65rem] block mb-2">ADDRESS OR TOWN *</span>
                        <input
                          type="text"
                          autocomplete="street-address"
                          bind:value={location}
                          placeholder="Street, town, or ZIP"
                          required
                          class="w-full bg-ind-surface border border-ind-border/55 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                        />
                      </label>
                    </div>

                    <label class="block">
                      <span class="ind-metadata text-ind-steel/60 text-[0.65rem] block mb-2">ANYTHING ELSE?</span>
                      <textarea
                        bind:value={projectNotes}
                        rows="3"
                        placeholder="Timing, access, materials, or anything we should know."
                        class="w-full resize-none bg-ind-surface border border-ind-border/55 text-ink text-sm px-4 py-3 focus:outline-none focus:border-ind-accent placeholder:text-ind-steel/30"
                      ></textarea>
                    </label>

                    {#if submitError}
                      <div class="border border-red-800/40 bg-red-900/20 text-red-300 text-sm px-4 py-3" aria-live="polite">{submitError}</div>
                    {/if}

                    <button
                      type="submit"
                      disabled={submitLoading}
                      class="ind-button w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider disabled:opacity-50"
                    >
                      {submitLoading ? 'Sending...' : 'Send to our team'} <ArrowRight size={14} />
                    </button>
                    <div class="pt-2 text-[0.68rem] font-bold uppercase tracking-widest text-ind-steel/65">
                      Veteran-owned · Licensed & insured · Local to Pottstown
                    </div>
                  </form>
                </div>
              {/if}
            </div>
          {/if}

          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-ind-border/25 pt-5">
            <button
              type="button"
              onclick={prevStep}
              disabled={currentStep === 0}
              class="border border-ind-border/50 px-5 py-3 text-xs font-black uppercase tracking-wider transition-colors {currentStep === 0 ? 'text-ind-steel/30 cursor-not-allowed' : 'text-ind-steel hover:text-ink hover:border-ind-accent/70'}"
            >
              Back
            </button>

            {#if currentStep < steps.length - 1}
              <button type="button" onclick={nextStep} class="ind-button inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider">
                Continue <ArrowRight size={14} />
              </button>
            {:else}
              <a href="tel:+16104126424" class="ind-button inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider">
                <Phone size={14} /> Call Now
              </a>
            {/if}
          </div>
        </div>
      </div>

      <aside class="ind-steel-plate hidden min-w-0 p-5 sm:p-6 lg:p-8 xl:sticky xl:top-20 xl:block">
        <div class="flex items-center justify-between gap-4 mb-5">
          <div>
            <div class="ind-metadata text-ind-steel/50 text-xs mb-1">ESTIMATE RANGE</div>
            <div class="text-ink text-sm font-black uppercase tracking-wide">{estimate.profile.label}</div>
          </div>
          <div class="text-right">
            <div class="text-ind-accent font-black text-lg leading-none">Ready</div>
            <div class="text-[0.65rem] text-ind-steel/50 uppercase tracking-widest">planning range</div>
          </div>
        </div>

        <div class="border-y border-ind-border/30 py-6 mb-6">
          <div class="text-5xl font-black text-ind-accent tracking-tighter leading-none">{fmtCurrency(estimate.low)}</div>
          <div class="text-ind-steel/60 text-sm font-bold my-1">to</div>
          <div class="text-3xl font-black text-ind-accent/75 tracking-tighter leading-none">{fmtCurrency(estimate.high)}</div>
        </div>

        <div class="border-b border-ind-border/25 pb-5 mb-6">
          <div class="flex items-center justify-between gap-4">
            <div class="ind-metadata text-ind-steel/60 text-xs">Range confidence</div>
            <div class="font-black text-ink text-sm">{estimate.confidenceLabel} · {estimate.confidence}/100</div>
          </div>
          {#if estimate.rangeTighteners.length}
            <div class="mt-4 space-y-2">
              {#each estimate.rangeTighteners as note}
                <div class="text-xs text-ind-steel/65 leading-relaxed border-l-2 border-ind-accent/60 pl-3">{note}</div>
              {/each}
            </div>
          {/if}
        </div>

        <details class="border-b border-ind-border/25 pb-5 mb-6">
          <summary class="cursor-pointer ind-metadata text-ind-steel/60 hover:text-ink text-xs list-none">
            What this includes
          </summary>
          <div class="space-y-3 mt-4">
            {#each estimate.lineItems as item}
              <div class="grid grid-cols-[1fr_auto] gap-3 border-b border-ind-border/20 pb-2">
                <div>
                  <div class="text-ink text-xs font-bold leading-snug">{item.label}</div>
                  <div class="text-[0.62rem] text-ind-steel/45 uppercase tracking-widest mt-1">{categoryLabel(item.category)}</div>
                </div>
                <div class="text-ind-steel text-xs font-bold whitespace-nowrap">
                  {fmtCurrency(item.low)}-{fmtCurrency(item.high)}
                </div>
              </div>
            {/each}
          </div>
        </details>

        <p class="text-ind-steel/55 text-xs leading-relaxed mb-6">
          Use this as a planning range. We confirm the final price after reviewing photos or seeing the project in person.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <a href="tel:+16104126424" class="ind-button flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider">
            <Phone size={14} /> Call
          </a>
          <a href="#estimate-request" onclick={() => goToStep(sendStepIndex())} class="border border-ind-accent text-ind-accent hover:bg-ind-accent hover:text-black flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-colors">
            Request <ArrowRight size={14} />
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
