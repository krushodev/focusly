# Focusly Landing Page

The marketing landing page for Focusly — a minimalist Pomodoro timer for deep work.

## Tech Stack

- **Astro** — Static site generator
- **TailwindCSS** — Utility-first CSS framework
- **GSAP** — Animation library

## Project Structure

```
src/
├── components/
│   ├── Hero.astro        # Hero section with CTA
│   ├── Features.astro    # Features showcase
│   ├── HowItWorks.astro  # How it works section
│   ├── Showcase.astro    # App showcase
│   ├── CTA.astro         # Call to action
│   └── Footer.astro      # Footer
├── layouts/
│   └── Layout.astro      # Base layout
├── pages/
│   └── index.astro       # Home page
├── styles/
│   └── global.css        # Global styles
└── public/
    ├── logo.png          # App logo
    └── favicon.svg       # Favicon
```

## Commands

| Command       | Action                               |
| ------------- | ------------------------------------ |
| `bun install` | Install dependencies                 |
| `bun dev`     | Start dev server at `localhost:4321` |
| `bun build`   | Build for production to `./dist/`    |
| `bun preview` | Preview production build locally     |

## Development

```bash
bun install
bun dev
```

## Build

```bash
bun build
```
