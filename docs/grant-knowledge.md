# Grant Knowledge System

Grant now runs on an archive-backed knowledge bundle instead of a small hand-picked source list.

## How it works

1. `scripts/build-grant-knowledge.mjs` scans the accessible GNA archive roots, extracts readable text, removes obvious junk, and dedupes mirrored copies.
2. The script compiles a checked-in bundle at `src/data/grant-knowledge.json`.
3. `src/lib/server/grant-knowledge.ts` imports that bundle into the server build, scores it against the current chat, and returns a short turn-level brief.
4. `src/pages/api/chat.ts` adds that brief to the model instructions for the current turn only.

This keeps Railway simple because production only needs the generated JSON file that ships in the app build, not live access to Google Drive or OneDrive.

## Rebuild the bundle

```bash
npm run build:grant-knowledge
```

Optional override:

```bash
GNA_SOURCE_ROOTS="/abs/path/one:/abs/path/two" npm run build:grant-knowledge
```

`GNA_SOURCE_ROOTS` is path-delimited, so on macOS you can pass multiple roots separated by `:`.

Required local tools:
- `textutil`
- `pdftotext`
- `python3`
- `strings`

## Current corpus

The default build currently sweeps the accessible archive mirrors at:

- `Legacy Root/Clients/GNA`
- `OneDrive GNA (Tyler)`
- `Archived Downloads/Greg Documents`
- `Archived Downloads/GNA Academy Sales Team docs`

It also explicitly allows a small set of loose archive files outside those roots when they add unique value, including:

- `Greg_Neil_Voice_Profile_Analysis.md`
- `Greg_LinkedIn_Posts_REVISED.md`
- `Three_Steps_to_Power_-_GNA_Academy_Workbook.docx`
- `GNA PL Diagnostic.pdf`
- `Jun - Great Leadership Really Means You’re the Head Coach.docx`
- `2_12_2020_Plan Right-Win Big_FINAL.pptx`

The latest generated bundle includes:

- `84` source documents
- `742` knowledge cards
- `256` skipped files that were duplicates, unreadable placeholders, or low-signal docs

Notable included material now goes well beyond the original prompt pack:

- core offers and Academy materials
- Five Stages / Three Steps / Five Steps / Seven Steps frameworks
- delegation blueprint
- mastermind syllabus, agendas, and promotion language
- hiring, burnout, emotional intelligence, and performance docs
- executive summary and company positioning docs
- financial consulting outline
- P&L diagnostic and planning workshop material
- LinkedIn outreach and Greg voice-analysis material

## Duplicate handling

The archive has many mirrored and renamed copies of the same content.

The builder now:

- keeps one canonical text copy for each unique document body
- preserves important semantic aliases when two different file names carry the same text

Example:

- `Freedom_Workshop_10_Email_Sequence.docx` and `Mastermind_Promotion_10_Email_Sequence.docx` currently share the same text body
- `Pain_Points_And_Coaching_Topics_Reference.docx` and `The_Pain_Sales_Script.docx` currently share the same text body

Grant keeps the text once, but the bundle still preserves both source identities so curated cards can reference the correct sales concept without duplicating content.

## Guardrails

- The retrieval layer is there to sharpen Grant, not script him.
- The main prompt still owns Grant's posture, rules, and sales behavior.
- Runtime cards intentionally avoid quoting prices in chat.
- Transactional turns like booking logistics intentionally skip retrieval so the chat stays clean when it is time to book.
- The model only gets a few cards per turn so it stays conversational.
- Long paragraphs are split before bundling so the retrieval layer does not drown Grant in giant raw chunks.
