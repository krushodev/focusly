// Persistent state management with localStorage

const STORAGE_KEY = 'focusly_state';

const defaultState = {
  // Timer settings
  currentMode: 'classic',
  customWork: 25,
  customBreak: 5,
  customLongBreak: 15,
  cyclesBeforeLongBreak: 4,
  
  // Session tracking
  currentCycle: 1,
  isBreak: false,
  completedSessions: 0,
  
  // Preferences
  theme: 'dark',
  customColors: {
    primary: '#8b5cf6',
    background: 'gradient-purple'
  },
  
  // Sound settings
  soundEnabled: false,
  ambientSound: 'rain',
  ambientVolume: 0.5,
  alarmVolume: 0.7,
  
  // Session history
  history: [],
  
  // Presets
  presets: []
};

export const Store = {
  state: { ...defaultState },
  
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...defaultState, ...parsed };
      } catch (e) {
        console.warn('Failed to parse saved state, using defaults');
        this.state = { ...defaultState };
      }
    }
    return this.state;
  },
  
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  },
  
  update(key, value) {
    this.state[key] = value;
    this.save();
  },
  
  get(key) {
    return this.state[key];
  },
  
  addSession(session) {
    this.state.history.unshift({
      ...session,
      id: Date.now(),
      date: new Date().toISOString()
    });
    // Keep only last 100 sessions
    if (this.state.history.length > 100) {
      this.state.history = this.state.history.slice(0, 100);
    }
    this.save();
  },
  
  addPreset(preset) {
    this.state.presets.push({
      ...preset,
      id: Date.now()
    });
    this.save();
  },
  
  removePreset(id) {
    this.state.presets = this.state.presets.filter(p => p.id !== id);
    this.save();
  },
  
  reset() {
    this.state = { ...defaultState };
    this.save();
  }
};
