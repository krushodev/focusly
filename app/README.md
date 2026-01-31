# Focusly Desktop App

A minimal, premium productivity app focused on deep work with smooth animations and a beautiful violet & cyan color palette.

## Features

### Pomodoro Timer

- **Classic Mode** — 25/5/15 (work/break/long break)
- **Deep Focus** — 50/10/20
- **Ultra Focus** — 90/20/30
- **Custom Mode** — Fully configurable durations
- Configurable cycles before long break
- Session presets
- Local session history

### Notifications & Alarms

- Native system notifications
- Ring sound on session/break completion
- Configurable notification volume
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

## Installation

```bash
bun install
```

## Development

```bash
bun start
```

## Build

```bash
bun run build
```

## Keyboard Shortcuts

| Shortcut | Action            |
| -------- | ----------------- |
| `Space`  | Start/Pause timer |
| `Ctrl+R` | Reset timer       |
| `Escape` | Close panels      |

## Architecture

```
src/
├── main/
│   ├── main.js        # Electron main process
│   └── preload.js     # IPC bridge
├── renderer/
│   ├── index.html     # Main UI
│   ├── styles.css     # Styling
│   └── app-simple.js  # Main app logic
└── assets/
    └── logo.png       # App logo
```

## Tech Stack

- **Electron** — Desktop app framework
- **GSAP** — Animation library
- **Vanilla JS** — No framework overhead
- **CSS Variables** — Dynamic theming
