# El Rabón Farm

A bilingual farm showcase and event rental website — built entirely through **agentic AI development** using the [Ralph pattern](https://github.com/anthropics/claude-code/blob/main/tips/AFK_CODING.md) (autonomous iteration loops with Claude Code).

This project is a playground to explore how far AI-assisted development can take a real-world web project — from initial scaffolding through CI/CD, testing, and production deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro 5](https://astro.build/) — static site generation with hybrid rendering |
| **UI Components** | [React 19](https://react.dev/) — interactive islands (contact form, lightbox) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) — utility-first with custom earthy color palette |
| **Language** | TypeScript 5 — strict mode |
| **Testing** | Vitest + Testing Library + happy-dom |
| **Deployment** | [Vercel](https://vercel.com/) — static output with edge API routes |
| **Package Manager** | pnpm 9 |
| **CI/CD** | GitHub Actions |

## Architecture

```
src/
├── assets/images/       # Farm photography
├── components/          # Astro + React components
│   ├── ContactForm.tsx  # React — validated contact form
│   ├── Lightbox.tsx     # React — image viewer with keyboard/touch nav
│   ├── Header.astro     # Sticky nav, mobile menu, language switcher
│   ├── Footer.astro
│   └── SEO.astro        # OG/Twitter meta tags
├── i18n/                # Bilingual support (ES default + EN)
│   ├── es.json
│   ├── en.json
│   └── utils.ts
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── [lang]/          # Static paths for /es/* and /en/*
│   │   ├── index.astro  # Home — hero, about, gallery preview, CTA
│   │   ├── gallery.astro# Full image gallery with lightbox
│   │   └── contact.astro# Contact form + map + info
│   └── api/
│       └── contact.ts   # POST endpoint with server-side validation
├── styles/
│   └── global.css
└── tests/
    └── api/
        └── contact.test.ts
```

**Key patterns:** Astro islands architecture — static HTML pages with React hydrated only where interactivity is needed. Language-based routing via `[lang]` dynamic segments with `getStaticPaths()`.

## Features

- **Bilingual (ES/EN)** — Language switcher with path-aware routing, 50+ translation keys per locale
- **Image Gallery** — Responsive grid with lightbox viewer, keyboard navigation (arrows/escape), and touch swipe support
- **Contact Form** — Client + server validation, loading states, error recovery, API endpoint on Vercel edge
- **Responsive Design** — Mobile-first with sticky transparent header, hamburger menu, optimized images via Sharp
- **SEO** — Canonical URLs, Open Graph, Twitter Cards, locale-aware meta tags

## Agentic Development Highlights

This project was developed using AI-driven autonomous workflows:

- **Project scaffolding** — Full Astro + React + Tailwind setup generated from a product requirements document
- **CI/CD pipeline** — GitHub Actions workflow (type-check → build → test) configured and debugged through iterative AI loops
- **Test coverage at ~95%** — Component tests, API route tests, and interaction tests written and refined across multiple autonomous iterations (statements: 94.6%, branches: 92.9%)
- **Security practices** — Server-side form validation, input sanitization, proper `.gitignore` for secrets, ARIA accessibility attributes
- **Iterative refinement** — Ralph pattern scripts (`afk-ralph.sh`, `ralph-once.sh`, `test-coverage-ralph.sh`) drive unattended improvement cycles

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Type-check
pnpm typecheck

# Build for production
pnpm build
```

## License

ISC
