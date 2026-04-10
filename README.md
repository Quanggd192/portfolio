# Portfolio Website

Personal website built with Next.js, with an AI career assistant powered by OpenRouter.

## Local development

Add your key in one of these files:

- `website/.env.local`
- workspace root `.env`

Required variable:

```bash
OPENROUTER_API_KEY=your_key_here
```

Run locally:

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## AI career chat

The site includes a server-side API route at:

`/api/career-chat`

It uses:

- OpenRouter endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `openai/gpt-5.4`

The API key stays on the server and is never exposed to the browser.

## Deployment

This version is no longer compatible with GitHub Pages static hosting, because
the AI chat requires a secure server runtime to call OpenRouter.

Use a platform that supports Next.js server routes, such as:

- Vercel
- Render
- Railway
- Fly.io

## Production build

```bash
npm run build
```
