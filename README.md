# Kishore Kumar — QA Portfolio

[![CI](https://github.com/kishorekumarrasalay/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/kishorekumarrasalay/portfolio/actions/workflows/ci.yml)

Quality Analyst portfolio (manual testing → SDET path) built with Next.js 16, Tailwind CSS v4, and Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY for AI chat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Edit `src/data/portfolio.ts` for most site copy, metrics, and skills.  
Case studies: `src/data/caseStudies.ts`  
Blog posts: `content/blog/*.md`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |

## Deploy

Deploy on [Vercel](https://vercel.com). Set `ANTHROPIC_API_KEY` in project env for the QA Assistant LLM replies (falls back to the local rule-based assistant if unset).
