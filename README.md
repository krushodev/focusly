<p align="center">
  <img src="app/src/assets/logo.png" alt="Focusly Logo" width="120" />
</p>

<h1 align="center">Focusly</h1>

<p align="center">
  <strong>Focus deeper. Achieve more.</strong>
</p>

<p align="center">
  A minimalist Pomodoro timer designed for deep work. Beautiful, distraction-free, and built to help you enter flow state.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

---

## ✨ Features

### Pomodoro Timer

- **Classic Mode** — 25/5/15 (work/break/long break)
- **Deep Focus** — 50/10/20
- **Ultra Focus** — 90/20/30
- **Custom Mode** — Fully configurable durations
- Configurable cycles before long break
- Session presets
- Local session history

### Notifications

- Native system notifications
- Configurable alarm sounds with ring on session/break completion
- Visual feedback animations

### Personalization

- Dark / Light theme
- Violet & Cyan color palette
- Persistent preferences

### Animations (GSAP)

- Smooth state transitions
- Animated progress ring
- Breathing effect during focus
- Microinteractions on hover/click

---

## 🚀 Project Structure

```
focusly/
├── app/                    # Electron desktop application
│   ├── src/
│   │   ├── main/          # Electron main process
│   │   ├── renderer/      # Frontend UI
│   │   └── assets/        # App assets (logo, sounds)
│   └── package.json
├── landing/               # Astro landing page
│   ├── src/
│   │   ├── components/    # Astro components
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Routes
│   │   └── styles/        # Global styles
│   └── package.json
└── README.md
```

---

## 🛠️ Installation

### Desktop App

```bash
cd app
bun install
bun start
```

### Landing Page

```bash
cd landing
bun install
bun dev
```

---

## 📦 Build

### Desktop App

```bash
cd app
bun run build
```

### Landing Page

```bash
cd landing
bun build
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action            |
| -------- | ----------------- |
| `Space`  | Start/Pause timer |
| `Ctrl+R` | Reset timer       |
| `Escape` | Close panels      |

---

## 🎨 Tech Stack

| Component    | Technology    |
| ------------ | ------------- |
| Desktop App  | Electron      |
| Animations   | GSAP          |
| Frontend     | Vanilla JS    |
| Theming      | CSS Variables |
| Landing Page | Astro         |
| Styling      | TailwindCSS   |

---

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

---

## 🏷️ GitHub Description

```
🍅 Focusly — A minimalist Pomodoro timer for deep work. Built with Electron & Astro. Focus deeper, achieve more.
```

### Suggested Topics/Tags

```
pomodoro, timer, productivity, focus, electron, astro, tailwindcss, gsap, deep-work, time-management, desktop-app, javascript
```
