# Grant Knowledge System

Grant now uses a source-backed knowledge bundle instead of relying only on a giant system prompt.

## How it works

1. `scripts/build-grant-knowledge.mjs` reads selected Greg/GNA source documents from the local GNA archive.
2. The script compiles a checked-in bundle at `src/data/grant-knowledge.json`.
3. `src/lib/server/grant-knowledge.ts` scores that bundle against the current chat and returns a short, relevant brief.
4. `src/pages/api/chat.ts` adds that brief to the model instructions for the current turn only.

This keeps Railway simple because production only needs the generated JSON file, not access to Google Drive.

## Rebuild the bundle

```bash
npm run build:grant-knowledge
```

## Current source library

- `Sales Content/Sales Materials/GNA_Complete_Offer_Stack.docx`
- `Sales Essentials/GNA Academy Sales Team Intro.pdf`
- `Course Content/3_Steps_To_Power_Academy_Workbook.docx`
- `GNA Workbook - Real Accountability.pdf`
- `Course Content/CFA.pdf`
- `Sales Content/Sales Materials/Measures_of_Successful_Leadership.pdf`
- `Course Content/Five Stages of Business.pdf`
- `Business Operations/GregBot Training Manual.docx`
- `Sales Content/Sales Materials/Pain_Points_And_Coaching_Topics_Reference.docx`
- `Business Operations/GNA Business Assessment.pdf`
- `Marketing Materials/bottleneck-assessment.pdf`
- `Sales Content/Presentations/Team_Empowerment_Overview.docx`
- `Course Content/First Year Program/Production/10 Rules.pdf`

## Guardrails

- The retrieval layer is there to sharpen Grant, not script him.
- Runtime cards intentionally avoid quoting prices in chat.
- The model only gets a few cards per turn so it stays conversational.
