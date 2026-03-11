## Grant Follow-Up Design

### Goal

Turn Grant from a chat widget into a usable intake system:
- save every conversation
- summarize each finished conversation once
- email the summary to Greg and Tyler
- expose saved chats in a simple internal inbox
- surface transcript-driven notes that help improve Grant over time

### KISS Approach

Use the existing `chat_sessions` table as the source of truth.

- keep saving the transcript during the conversation
- add one finalize step that generates a summary and sends one email
- trigger finalize on booked, close, page hide, or idle
- use one token-protected internal page to review chats and Grant improvement notes

### Why This Approach

It builds directly on the current chatbot and avoids extra services, queues, or dashboards.

- no second database
- no background worker requirement
- no CRM dependency
- one summary email per chat session

### Main Pieces

1. `chat-store.ts`
   Extend the current stored session record with summary fields and sent/finalized timestamps.

2. `chat-ops.ts`
   Generate a concise summary, save it, and send a summary email through Resend.

3. `POST /api/chat/finalize`
   Accept a session id plus the latest transcript state, save it, and finalize the session.

4. `ChatBot.svelte`
   Keep the chat conversational, but finalize once a session is meaningfully over.

5. `grant-inbox.astro`
   Read recent chat sessions from Postgres and show summaries, transcripts, and Grant tuning notes.

### Transcript-Driven Tuning

Each summary includes one concrete note on how Grant should improve next time.

That note should stay practical:
- what objection appeared
- what psychological friction showed up
- what Grant should ask or say differently next time

### Success Criteria

- a real chat can be saved
- a real summary email can be sent to Tyler and Greg
- the inbox shows saved chats
- recent chats produce useful improvement notes for Grant
