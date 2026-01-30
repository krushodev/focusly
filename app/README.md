# Focusly

A minimal, premium productivity app focused on deep work with smooth animations and maximum customization.

## Features

### Pomodoro Timer

- **Classic Mode**: 25/5/15 (work/break/long break)
- **Deep Focus**: 50/10/20
- **Ultra Focus**: 90/20/30
- **Custom Mode**: Fully configurable durations
- Configurable cycles before long break
- Session presets
- Local session history

### Notifications & Alarms

- Native system notifications
- Configurable alarm sounds
- Visual feedback animations
- Independent volume controls

### Personalization

- Dark / Light theme
- 8 accent color presets
- 6 gradient backgrounds
- Persistent preferences

### Ambient Sounds

- Rain
- White Noise
- Forest
- Coffee Shop
- Ocean Waves
- Fireplace

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

- `Space` - Start/Pause timer
- `Ctrl+R` - Reset timer
- `Escape` - Close panels

## Architecture

```
src/
├── main/
│   ├── main.js      # Electron main process
│   └── preload.js   # IPC bridge
└── renderer/
    ├── index.html   # Main UI
    ├── styles.css   # Styling
    ├── app.js       # Main app logic
    └── js/
        ├── timer.js      # Pomodoro engine
        ├── sounds.js     # Sound manager
        ├── themes.js     # Theme manager
        ├── animations.js # GSAP animations
        └── store.js      # Persistent storage
```

## Tech Stack

- **Electron** - Desktop app framework
- **GSAP** - Animation library
- **Vanilla JS** - No framework overhead
- **CSS Variables** - Dynamic theming
