<script lang="ts">
    import { onMount, tick } from "svelte";
    import { MessageSquare, X, Send, ChevronDown } from "lucide-svelte";

    type Message = { role: "user" | "assistant"; content: string };
    type BookingPhase = "idle" | "name" | "email" | "challenge" | "service" | "slot" | "confirm";
    type ServiceInterest =
        | "Online Mastermind Groups"
        | "GNA Academy Self-Guided Online Curriculum"
        | "1-on-1 Coaching"
        | "Exit Strategy / Preparing for Sale";
    type Slot = {
        inviteesRemaining: number;
        schedulingUrl: string;
        startTime: string;
        status: string;
    };
    type Choice = { label: string; value: string };
    type FinalizeReason = "booked" | "closed" | "idle" | "pagehide";
    type BookingState = {
        active: boolean;
        choices: Choice[];
        draft: {
            challenge: string;
            email: string;
            name: string;
            serviceInterest: string;
            startTime: string;
            timezone: string;
        };
        phase: BookingPhase;
        slots: Slot[];
        suggestedService: ServiceInterest;
    };

    const SERVICE_OPTIONS: ServiceInterest[] = [
        "Exit Strategy / Preparing for Sale",
        "Online Mastermind Groups",
        "GNA Academy Self-Guided Online Curriculum",
        "1-on-1 Coaching",
    ];
    const CHALLENGE_OTHER_VALUE = "__challenge_other__";
    const INTRO_MESSAGE = "Hey, I'm Grant with GNA. Are you trying to build toward succession or an exit, or are you still too buried in the day-to-day to even think about that yet?";
    const SESSION_STORAGE_KEY = "grant-chat-session-id";
    const IDLE_FINALIZE_MS = 15 * 60 * 1000;

    let isOpen = $state(false);
    let isMinimized = $state(false);
    let messages = $state<Message[]>([{ role: "assistant", content: INTRO_MESSAGE }]);
    let inputValue = $state("");
    let isLoading = $state(false);
    let didFinalizeSession = $state(false);
    let lastFinalizeReason = $state<FinalizeReason | null>(null);
    let lastBookedDraft = $state<BookingState["draft"] | null>(null);
    let messagesEl: HTMLElement;
    let inputEl: HTMLTextAreaElement;
    let sessionId = $state("");
    let idleTimer: number | null = null;
    let booking = $state<BookingState>({
        active: false,
        choices: [],
        draft: {
            challenge: "",
            email: "",
            name: "",
            serviceInterest: "",
            startTime: "",
            timezone: getBrowserTimezone(),
        },
        phase: "idle",
        slots: [],
        suggestedService: "Exit Strategy / Preparing for Sale",
    });

    function getBrowserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
    }

    function buildIntroMessages() {
        return [{ role: "assistant", content: INTRO_MESSAGE }] satisfies Message[];
    }

    function hasUserConversation() {
        return messages.some((message) => message.role === "user");
    }

    function getBookingState() {
        return lastBookedDraft
            ? {
                  active: false,
                  booked: true,
                  draft: lastBookedDraft,
                  phase: "booked",
              }
            : {
                  active: booking.active,
                  booked: false,
                  draft: booking.draft,
                  phase: booking.phase,
              };
    }

    function clearIdleTimer() {
        if (idleTimer !== null) {
            window.clearTimeout(idleTimer);
            idleTimer = null;
        }
    }

    function scheduleIdleFinalize() {
        if (typeof window === "undefined") return;

        clearIdleTimer();

        if (!isOpen || didFinalizeSession || !hasUserConversation()) {
            return;
        }

        idleTimer = window.setTimeout(() => {
            void finalizeSession("idle");
        }, IDLE_FINALIZE_MS);
    }

    function writeSessionId(value: string) {
        sessionId = value;
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, value);
    }

    function finalizedSessionKey(id: string) {
        return `${SESSION_STORAGE_KEY}:${id}:finalized`;
    }

    function isStoredSessionFinalized(id: string) {
        return window.sessionStorage.getItem(finalizedSessionKey(id)) === "1";
    }

    function markStoredSessionFinalized(id: string) {
        window.sessionStorage.setItem(finalizedSessionKey(id), "1");
    }

    function clearStoredSessionFinalized(id: string) {
        window.sessionStorage.removeItem(finalizedSessionKey(id));
    }

    function startFreshSession(resetMessages = true) {
        writeSessionId(crypto.randomUUID());
        didFinalizeSession = false;
        lastFinalizeReason = null;
        lastBookedDraft = null;
        resetBooking();
        clearStoredSessionFinalized(sessionId);

        if (resetMessages) {
            messages = buildIntroMessages();
        }

        scheduleIdleFinalize();
    }

    onMount(() => {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);

        const storedSessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        const liveSessionId =
            storedSessionId && !isStoredSessionFinalized(storedSessionId)
                ? storedSessionId
                : crypto.randomUUID();

        writeSessionId(liveSessionId);
        scheduleIdleFinalize();

        const finalizeOnPageLeave = () => {
            void persistSession(true);
            void finalizeSession("pagehide", true);
        };

        const handlePageHide = () => {
            finalizeOnPageLeave();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                void persistSession(true);
            }
        };

        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearIdleTimer();
            window.removeEventListener("pagehide", handlePageHide);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    });

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function resetBooking() {
        booking = {
            active: false,
            choices: [],
            draft: {
                challenge: "",
                email: "",
                name: "",
                serviceInterest: "",
                startTime: "",
                timezone: getBrowserTimezone(),
            },
            phase: "idle",
            slots: [],
            suggestedService: "Exit Strategy / Preparing for Sale",
        };
    }

    function addAssistantMessage(content: string) {
        messages = [...messages, { role: "assistant", content }];
        scheduleIdleFinalize();
    }

    function isAmbiguousChallenge(value: string) {
        const normalized = value.trim().toLowerCase();

        return (
            normalized === "not sure" ||
            normalized === "unsure" ||
            normalized === "don't know" ||
            normalized === "dont know" ||
            normalized === "not really sure" ||
            normalized === "hard to say" ||
            normalized === "i'm not sure" ||
            normalized === "im not sure"
        );
    }

    function buildChallengeClarifierChoices() {
        return [
            { label: "Jobs aren't profitable enough", value: "Jobs aren't profitable enough" },
            {
                label: "People or accountability still land on me",
                value: "People or accountability still land on me",
            },
            { label: "Something else", value: CHALLENGE_OTHER_VALUE },
        ];
    }

    function getChatErrorMessage(error: string) {
        if (error === "API key not configured") {
            return "Grant isn't configured on this local build yet. Open www.gnaworks.com or set ANTHROPIC_API_KEY for local testing.";
        }

        return error;
    }

    async function persistSession(useBeacon = false) {
        if (!sessionId || !messages.length) return;
        const payload = JSON.stringify({
            booking: getBookingState(),
            messages,
            sessionId,
        });

        try {
            if (useBeacon && navigator.sendBeacon) {
                navigator.sendBeacon(
                    "/api/chat/session",
                    new Blob([payload], { type: "application/json" })
                );
                return;
            }

            await fetch("/api/chat/session", {
                body: payload,
                headers: { "Content-Type": "application/json" },
                keepalive: true,
                method: "POST",
            });
        } catch {
            // Let the chat continue even if persistence fails.
        }
    }

    async function finalizeSession(reason: FinalizeReason, useBeacon = false) {
        if (!sessionId || didFinalizeSession || !hasUserConversation()) {
            return;
        }

        clearIdleTimer();

        const payload = JSON.stringify({
            booking: getBookingState(),
            messages,
            reason,
            sessionId,
        });

        try {
            if (useBeacon && navigator.sendBeacon) {
                const queued = navigator.sendBeacon(
                    "/api/chat/finalize",
                    new Blob([payload], { type: "application/json" })
                );

                if (queued) {
                    didFinalizeSession = true;
                    lastFinalizeReason = reason;
                    markStoredSessionFinalized(sessionId);
                    return;
                }
            }

            didFinalizeSession = true;
            const response = await fetch("/api/chat/finalize", {
                body: payload,
                headers: { "Content-Type": "application/json" },
                keepalive: true,
                method: "POST",
            });

            const data = await response.json().catch(() => null);
            const status = typeof data?.status === "string" ? data.status : "";
            const finalizationSucceeded = response.ok && status !== "saved-no-email";

            if (!finalizationSucceeded) {
                didFinalizeSession = false;
                scheduleIdleFinalize();
                return;
            }

            lastFinalizeReason = reason;
            markStoredSessionFinalized(sessionId);
        } catch {
            didFinalizeSession = false;
            lastFinalizeReason = null;
            scheduleIdleFinalize();
        }
    }

    function inferServiceInterest() {
        const transcript = messages
            .filter((message) => message.role === "user")
            .map((message) => message.content.toLowerCase())
            .join(" ");

        if (
            transcript.includes("exit") ||
            transcript.includes("sale") ||
            transcript.includes("succession")
        ) {
            return "Exit Strategy / Preparing for Sale";
        }

        if (transcript.includes("mastermind") || transcript.includes("peer group")) {
            return "Online Mastermind Groups";
        }

        if (
            transcript.includes("academy") ||
            transcript.includes("curriculum") ||
            transcript.includes("training") ||
            transcript.includes("self guided") ||
            transcript.includes("self-guided")
        ) {
            return "GNA Academy Self-Guided Online Curriculum";
        }

        return "1-on-1 Coaching";
    }

    function buildServiceChoices(suggestedService: ServiceInterest) {
        return [
            { label: `Use ${suggestedService}`, value: suggestedService },
            ...SERVICE_OPTIONS.filter((option) => option !== suggestedService).map((option) => ({
                label: option,
                value: option,
            })),
        ];
    }

    function formatSlot(startTime: string) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            month: "short",
            day: "numeric",
            timeZone: booking.draft.timezone,
            weekday: "short",
        }).format(new Date(startTime));
    }

    function resolveServiceChoice(value: string) {
        const normalized = value.trim().toLowerCase();

        if (
            normalized === "yes" ||
            normalized === "y" ||
            normalized === "use that" ||
            normalized === "sounds right"
        ) {
            return booking.suggestedService;
        }

        return (
            SERVICE_OPTIONS.find((option) => {
                const optionValue = option.toLowerCase();
                return optionValue === normalized || optionValue.includes(normalized);
            }) ?? null
        );
    }

    function resolveSlotChoice(value: string) {
        const trimmed = value.trim();
        const normalized = trimmed.toLowerCase();

        if (trimmed.startsWith("202")) {
            return booking.slots.find((slot) => slot.startTime === trimmed) ?? null;
        }

        if (normalized.includes("first")) return booking.slots[0] ?? null;
        if (normalized.includes("second")) return booking.slots[1] ?? null;
        if (normalized.includes("third")) return booking.slots[2] ?? null;
        if (normalized.includes("fourth")) return booking.slots[3] ?? null;
        if (normalized.includes("fifth")) return booking.slots[4] ?? null;

        return null;
    }

    async function scrollToBottom() {
        await tick();
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    async function loadAvailability() {
        booking.choices = [];

        const response = await fetch("/api/calendly/availability", {
            body: JSON.stringify({ timezone: booking.draft.timezone }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });

        const data = await response.json();

        if (!response.ok || !data.slots?.length) {
            resetBooking();
            addAssistantMessage(
                data.error ??
                    "I’m not seeing open times right now. Text FREEDOM to (415) 699-8512 and we’ll get you sorted."
            );
            return;
        }

        booking.phase = "slot";
        booking.slots = data.slots;
        booking.choices = data.slots.map((slot: Slot) => ({
            label: formatSlot(slot.startTime),
            value: slot.startTime,
        }));
        addAssistantMessage("Here are Greg's next openings. Pick the slot that works best.");
    }

    async function bookSlot() {
        const email = booking.draft.email;
        const slotLabel = formatSlot(booking.draft.startTime);

        const response = await fetch("/api/calendly/book", {
            body: JSON.stringify(booking.draft),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
            booking.phase = "slot";
            booking.choices = booking.slots.map((slot) => ({
                label: formatSlot(slot.startTime),
                value: slot.startTime,
            }));
            addAssistantMessage(
                data.error ?? "That slot just disappeared. Pick another time and I’ll try again."
            );
            return;
        }

        const completedDraft = { ...booking.draft };
        lastBookedDraft = completedDraft;
        resetBooking();
        addAssistantMessage(
            `You're booked for ${slotLabel}. Calendly will send the invite to ${email}, and that email will include the reschedule link.`
        );
        await finalizeSession("booked");
    }

    async function handleBookingReply(value: string) {
        const normalized = value.trim().toLowerCase();

        if (
            normalized === "cancel" ||
            normalized === "stop" ||
            normalized === "never mind" ||
            normalized === "nevermind"
        ) {
            resetBooking();
            addAssistantMessage("No problem. If you want the slot later, hit Book Breakthrough with Greg.");
            return;
        }

        switch (booking.phase) {
            case "name":
                if (value.trim().length < 2) {
                    addAssistantMessage("I need the name Greg should see on the invite. What's your full name?");
                    return;
                }

                booking.draft.name = value.trim();
                booking.phase = "email";
                addAssistantMessage("Good. What's the best email for the invite?");
                return;

            case "email":
                if (!isValidEmail(value.trim())) {
                    addAssistantMessage("That email looks off. What's the best email for the invite?");
                    return;
                }

                booking.draft.email = value.trim().toLowerCase();
                booking.phase = "challenge";
                addAssistantMessage("What's the biggest challenge you want Greg to understand before the call?");
                return;

            case "challenge":
                if (value === CHALLENGE_OTHER_VALUE) {
                    booking.choices = [];
                    addAssistantMessage("No problem. Give me the short version so Greg has real context before the call.");
                    return;
                }

                if (isAmbiguousChallenge(value)) {
                    booking.choices = buildChallengeClarifierChoices();
                    addAssistantMessage(
                        "No problem. Usually it starts with one of these: jobs aren't profitable enough, or people and accountability still land on you. Which is closer?"
                    );
                    return;
                }

                if (value.trim().length < 10) {
                    booking.choices = [];
                    addAssistantMessage(
                        "Give me a little more so Greg has real context. What's the biggest challenge right now?"
                    );
                    return;
                }

                booking.draft.challenge = value.trim();
                booking.choices = [];
                booking.suggestedService = inferServiceInterest();
                booking.phase = "service";
                booking.choices = buildServiceChoices(booking.suggestedService);
                addAssistantMessage(
                    `Sounds like ${booking.suggestedService} is the closest fit. Want me to use that for Greg's prep?`
                );
                return;

            case "service": {
                const selectedService = resolveServiceChoice(value);

                if (!selectedService) {
                    addAssistantMessage(
                        "Use the buttons or tell me Academy, 1-on-1, Mastermind, or Exit Strategy."
                    );
                    return;
                }

                booking.draft.serviceInterest = selectedService;
                await loadAvailability();
                return;
            }

            case "slot": {
                const selectedSlot = resolveSlotChoice(value);

                if (!selectedSlot) {
                    addAssistantMessage("Use one of the slot buttons so I book the right time.");
                    return;
                }

                booking.draft.startTime = selectedSlot.startTime;
                booking.phase = "confirm";
                booking.choices = [
                    { label: "Yes, book it", value: "yes" },
                    { label: "Pick a different time", value: "change-time" },
                ];
                addAssistantMessage(
                    `I’ve got ${formatSlot(selectedSlot.startTime)} for ${booking.draft.name}. Want me to lock it in?`
                );
                return;
            }

            case "confirm":
                if (
                    normalized === "yes" ||
                    normalized === "book it" ||
                    normalized === "book" ||
                    normalized === "confirm"
                ) {
                    booking.choices = [];
                    addAssistantMessage("Locking it in now.");
                    await bookSlot();
                    return;
                }

                if (normalized === "change-time" || normalized === "change time" || normalized === "no") {
                    await loadAvailability();
                    return;
                }

                addAssistantMessage("Say yes to book it, or pick a different time.");
                return;

            default:
                return;
        }
    }

    async function submitUserInput(content: string, value = content) {
        const text = content.trim();
        if (!text || isLoading) return;

        if (didFinalizeSession && lastFinalizeReason !== "booked") {
            startFreshSession(true);
        }

        messages = [...messages, { role: "user", content: text }];
        inputValue = "";
        isLoading = true;
        scheduleIdleFinalize();
        await scrollToBottom();

        try {
            if (booking.active && booking.phase !== "idle") {
                await handleBookingReply(value);
            } else {
                const response = await fetch("/api/chat", {
                    body: JSON.stringify({
                        messages: messages.map((message) => ({
                            content: message.content,
                            role: message.role,
                        })),
                    }),
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                });

                const data = await response.json().catch(() => null);
                const assistantContent =
                    typeof data?.content === "string" && data.content.trim()
                        ? data.content
                        : typeof data?.error === "string" && data.error.trim()
                            ? getChatErrorMessage(data.error)
                            : "Something went wrong. Try again.";

                messages = [
                    ...messages,
                    {
                        role: "assistant",
                        content: assistantContent,
                    },
                ];
            }
        } catch {
            messages = [
                ...messages,
                {
                    role: "assistant",
                    content:
                        "Connection issue. Refresh and try again — or text Greg directly at (415) 699-8512.",
                },
            ];
        }

        await persistSession();
        isLoading = false;
        await scrollToBottom();
    }

    async function sendMessage() {
        await submitUserInput(inputValue);
    }

    async function chooseChoice(choice: Choice) {
        await submitUserInput(choice.label, choice.value);
    }

    async function startBooking() {
        if (didFinalizeSession) {
            startFreshSession(true);
        }

        if (isLoading || booking.active) return;

        booking = {
            active: true,
            choices: [],
            draft: {
                challenge: "",
                email: "",
                name: "",
                serviceInterest: "",
                startTime: "",
                timezone: getBrowserTimezone(),
            },
            phase: "name",
            slots: [],
            suggestedService: inferServiceInterest(),
        };

        addAssistantMessage("Let's get you on Greg's calendar. What's your full name?");
        await persistSession();
        await scrollToBottom();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function openChat() {
        isOpen = true;
        isMinimized = false;
        scheduleIdleFinalize();
        tick().then(() => {
            inputEl?.focus();
            scrollToBottom();
        });
    }

    function closeChat() {
        isOpen = false;
        isMinimized = false;
        void finalizeSession("closed");
    }
</script>

{#if !isOpen}
    <button
        onclick={openChat}
        class="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 flex items-center gap-3 bg-ind-accent text-black font-bold px-5 py-3 shadow-2xl hover:bg-white transition-all duration-300 group sm:right-6 sm:bottom-6"
        aria-label="Chat with Grant"
    >
        <div class="text-left">
            <div class="text-[0.6rem] uppercase tracking-[0.15em] opacity-70 leading-none mb-0.5">ASK</div>
            <div class="text-sm uppercase tracking-wider leading-none">Grant</div>
        </div>
        <MessageSquare size={16} class="ml-1 opacity-70" />
    </button>
{/if}

{#if isOpen}
    <div
        class="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-50 flex flex-col shadow-2xl border border-ind-border bg-[#0d0d0d] rounded-2xl sm:rounded-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[360px] sm:max-w-[calc(100vw-2rem)]"
        style="height: {isMinimized ? 'auto' : 'min(90dvh, 520px)'}; max-height: {isMinimized ? 'none' : 'calc(100dvh - 1rem - env(safe-area-inset-bottom))'};"
    >
        <div
            class="flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-ind-border shrink-0 cursor-pointer rounded-t-2xl sm:rounded-none"
            onclick={() => (isMinimized = !isMinimized)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && (isMinimized = !isMinimized)}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
        >
            <div
                class="shrink-0 rounded-sm bg-black px-2 py-1.5 border border-white/10"
            >
                <img
                    src="/gna-logo-light.png"
                    alt="GNA Inc — Breakthrough Performance"
                    class="h-[18px] w-auto block"
                />
            </div>

            <div class="flex-1 min-w-0">
                <div class="text-white font-bold uppercase tracking-wider text-sm leading-none">
                    Grant
                </div>
                <div class="text-[0.6rem] uppercase tracking-[0.12em] text-ind-accent mt-0.5 leading-none">
                    GNA Inc. Intake
                </div>
            </div>

            <div class="flex items-center gap-2 ml-auto shrink-0">
                <button
                    onclick={(e) => {
                        e.stopPropagation();
                        isMinimized = !isMinimized;
                    }}
                    class="text-ind-steel hover:text-white transition-colors p-2.5 sm:p-1"
                    aria-label="Minimize"
                >
                    <ChevronDown
                        size={16}
                        class="transition-transform duration-300 {isMinimized ? 'rotate-180' : ''}"
                    />
                </button>
                <button
                    onclick={(e) => {
                        e.stopPropagation();
                        closeChat();
                    }}
                    class="text-ind-steel hover:text-white transition-colors p-2.5 sm:p-1"
                    aria-label="Close chat"
                >
                    <X size={16} />
                </button>
            </div>
        </div>

        {#if !isMinimized}
            <div
                bind:this={messagesEl}
                class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                data-lenis-prevent
            >
                {#each messages as msg}
                    <div class="flex gap-3 {msg.role === 'user' ? 'flex-row-reverse' : ''}">
                        {#if msg.role === "assistant"}
                            <div
                                class="w-7 h-7 rounded-full bg-ind-accent flex items-center justify-center font-black text-black text-xs shrink-0 mt-0.5"
                            >
                                G
                            </div>
                        {/if}
                        <div
                            class="max-w-[78%] px-3 py-2.5 text-sm leading-relaxed {msg.role === 'user'
                                ? 'bg-ind-accent text-black font-medium ml-auto'
                                : 'bg-[#1a1a1a] text-ind-fg border border-ind-border/40'}"
                        >
                            {msg.content}
                        </div>
                    </div>
                {/each}

                {#if isLoading}
                    <div class="flex gap-3">
                        <div
                            class="w-7 h-7 rounded-full bg-ind-accent flex items-center justify-center font-black text-black text-xs shrink-0 mt-0.5"
                        >
                            G
                        </div>
                        <div
                            class="bg-[#1a1a1a] border border-ind-border/40 px-3 py-2.5 flex items-center gap-1.5"
                        >
                            <span class="w-1.5 h-1.5 bg-ind-accent rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                            <span class="w-1.5 h-1.5 bg-ind-accent rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                            <span class="w-1.5 h-1.5 bg-ind-accent rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                        </div>
                    </div>
                {/if}
            </div>

            <div class="border-t border-ind-border shrink-0 bg-[#0d0d0d]">
                {#if !booking.active}
                    <div class="px-3 pt-3">
                        <button
                            onclick={startBooking}
                            class="w-full border border-ind-accent/50 text-ind-accent hover:bg-ind-accent hover:text-black transition-colors duration-200 text-[0.65rem] uppercase tracking-[0.14em] font-bold px-3 py-3"
                        >
                            Book Breakthrough with Greg
                        </button>
                    </div>
                {/if}

                {#if booking.active && booking.choices.length}
                    <div class="px-3 pt-3 flex flex-wrap gap-2">
                        {#each booking.choices as choice}
                            <button
                                onclick={() => chooseChoice(choice)}
                                class="text-xs border border-ind-border/60 bg-[#1a1a1a] text-ind-fg hover:border-ind-accent hover:text-ind-accent transition-colors px-3 py-3 min-h-11"
                            >
                                {choice.label}
                            </button>
                        {/each}
                        <button
                            onclick={() => chooseChoice({ label: "Cancel booking", value: "cancel" })}
                            class="text-xs border border-ind-border/30 text-ind-steel hover:text-white transition-colors px-3 py-3 min-h-11"
                        >
                            Cancel
                        </button>
                    </div>
                {/if}

                <div
                    class="p-3 flex gap-2"
                    style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
                >
                    <textarea
                        bind:this={inputEl}
                        bind:value={inputValue}
                        onkeydown={handleKeydown}
                        placeholder={booking.active ? "Reply to Grant..." : "Ask Grant anything..."}
                        rows="1"
                        class="flex-1 bg-[#1a1a1a] border border-ind-border/50 text-ind-fg placeholder-ind-steel/50 text-sm px-3 py-2 resize-none focus:outline-none focus:border-ind-accent/60 transition-colors leading-relaxed"
                        style="min-height: 38px; max-height: 80px;"
                    ></textarea>
                    <button
                        onclick={sendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        class="shrink-0 w-10 h-10 bg-ind-accent hover:bg-white text-black flex items-center justify-center transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>

            <div class="text-center text-[0.55rem] uppercase tracking-[0.12em] text-ind-steel/40 pb-2 shrink-0">
                Powered by GNA Inc.
            </div>
        {/if}
    </div>
{/if}
