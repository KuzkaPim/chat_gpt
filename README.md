# Chat GPT (MVP)

Minimal chat application prototype built with Next.js and an OpenAI-compatible SDK. This repository is an MVP intended for demonstration and portfolio use, not production.

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- @ai-sdk/openai

## Requirements

- Node.js 18+
- pnpm

## Setup

1. Install dependencies:

pnpm install

2. Add environment variables:

Create a file named `.env.local` with at least:

```env
OPENAI_API_KEY=sk-...
```

3. Run locally:

pnpm dev

4. Build for production:

pnpm build
pnpm start

## Notes

- This is an MVP. Minimal error handling and no production hardening.
- Known issue: streaming responses may be buffered by mobile Safari, which can cause slow or delayed loading on iOS devices.

## License

No license specified.
