<script lang="ts">
    import { tick } from "svelte";
    import { MessageSquare, X, Send, ChevronDown } from "lucide-svelte";

    type Message = { role: "user" | "assistant"; content: string };

    let isOpen = $state(false);
    let isMinimized = $state(false);
    let messages = $state<Message[]>([
        {
            role: "assistant",
            content:
                "Hey — I'm Grant, Greg's intake assistant. You running a restoration or construction company? Tell me what's going on and I'll tell you straight whether Greg can help.",
        },
    ]);
    let inputValue = $state("");
    let isLoading = $state(false);
    let messagesEl: HTMLElement;
    let inputEl: HTMLTextAreaElement;

    async function scrollToBottom() {
        await tick();
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    async function sendMessage() {
        const text = inputValue.trim();
        if (!text || isLoading) return;

        messages = [...messages, { role: "user", content: text }];
        inputValue = "";
        isLoading = true;
        await scrollToBottom();

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();
            messages = [
                ...messages,
                {
                    role: "assistant",
                    content: data.content ?? "Something went wrong. Try again.",
                },
            ];
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

        isLoading = false;
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
        tick().then(() => {
            inputEl?.focus();
            scrollToBottom();
        });
    }
</script>

<!-- Floating trigger button -->
{#if !isOpen}
    <button
        onclick={openChat}
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ind-accent text-black font-bold pl-4 pr-5 py-3 shadow-2xl hover:bg-white transition-all duration-300 group"
        aria-label="Chat with Grant"
    >
        <!-- "G" avatar -->
        <div class="relative shrink-0">
            <div
                class="w-8 h-8 rounded-full bg-black flex items-center justify-center font-black text-ind-accent text-sm group-hover:text-black group-hover:bg-ind-accent transition-all duration-300 border border-ind-accent/40"
            >
                G
            </div>
            <span
                class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black"
            ></span>
        </div>
        <div class="text-left">
            <div class="text-[0.6rem] uppercase tracking-[0.15em] opacity-70 leading-none mb-0.5">ASK</div>
            <div class="text-sm uppercase tracking-wider leading-none">Grant</div>
        </div>
        <MessageSquare size={16} class="ml-1 opacity-70" />
    </button>
{/if}

<!-- Chat panel -->
{#if isOpen}
    <div
        class="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col shadow-2xl border border-ind-border bg-[#0d0d0d]"
        style="height: {isMinimized ? 'auto' : '520px'};"
    >
        <!-- Header -->
        <div
            class="flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-ind-border shrink-0 cursor-pointer"
            onclick={() => (isMinimized = !isMinimized)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && (isMinimized = !isMinimized)}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
        >
            <!-- "G" avatar -->
            <div class="relative shrink-0">
                <div
                    class="w-9 h-9 rounded-full bg-ind-accent flex items-center justify-center font-black text-black text-sm"
                >
                    G
                </div>
                <span
                    class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#111]"
                ></span>
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
                    class="text-ind-steel hover:text-white transition-colors p-1"
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
                        isOpen = false;
                    }}
                    class="text-ind-steel hover:text-white transition-colors p-1"
                    aria-label="Close chat"
                >
                    <X size={16} />
                </button>
            </div>
        </div>

        {#if !isMinimized}
            <!-- Messages -->
            <div
                bind:this={messagesEl}
                class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
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

            <!-- Input -->
            <div class="border-t border-ind-border shrink-0 p-3 flex gap-2 bg-[#0d0d0d]">
                <textarea
                    bind:this={inputEl}
                    bind:value={inputValue}
                    onkeydown={handleKeydown}
                    placeholder="Ask Grant anything..."
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

            <!-- Footer note -->
            <div class="text-center text-[0.55rem] uppercase tracking-[0.12em] text-ind-steel/40 pb-2 shrink-0">
                Powered by GNA Inc.
            </div>
        {/if}
    </div>
{/if}
