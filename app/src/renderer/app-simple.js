// ===== TIMER ENGINE =====
class TimerEngine {
  constructor(options = {}) {
    this.mode = options.mode || 'classic';
    this.cyclesBeforeLongBreak = options.cyclesBeforeLongBreak || 4;

    this.customSettings = {
      work: options.customWork || 25,
      break: options.customBreak || 5,
      longBreak: options.customLongBreak || 15
    };

    this.timeLeft = this.getWorkDuration();
    this.totalTime = this.timeLeft;
    this.isActive = false;
    this.isPaused = false;
    this.isBreak = false;
    this.currentCycle = 1;
    this.timerId = null;

    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
  }

  getWorkDuration() {
    if (this.mode === 'custom') {
      return this.customSettings.work * 60;
    }
    const MODES = {
      classic: 25,
      deep: 50,
      ultra: 90
    };
    return MODES[this.mode] * 60;
  }

  getBreakDuration() {
    const isLongBreak = this.currentCycle >= this.cyclesBeforeLongBreak;
    if (this.mode === 'custom') {
      return (isLongBreak ? this.customSettings.longBreak : this.customSettings.break) * 60;
    }
    const BREAKS = {
      classic: { short: 5, long: 15 },
      deep: { short: 10, long: 20 },
      ultra: { short: 20, long: 30 }
    };
    const breaks = BREAKS[this.mode];
    return (isLongBreak ? breaks.long : breaks.short) * 60;
  }

  setMode(mode) {
    this.mode = mode;
    this.reset();
  }

  start() {
    if (this.isActive && !this.isPaused) return;

    this.isActive = true;
    this.isPaused = false;

    this.timerId = setInterval(() => this.tick(), 1000);
    this.onStateChange(this.getState());
  }

  pause() {
    if (!this.isActive || this.isPaused) return;

    clearInterval(this.timerId);
    this.isPaused = true;
    this.onStateChange(this.getState());
  }

  toggle() {
    if (!this.isActive) {
      this.start();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.start();
  }

  reset() {
    clearInterval(this.timerId);
    this.isActive = false;
    this.isPaused = false;
    this.isBreak = false;
    this.timeLeft = this.getWorkDuration();
    this.totalTime = this.timeLeft;
    this.onStateChange(this.getState());
    this.onTick(this.timeLeft, this.totalTime);
  }

  fullReset() {
    this.currentCycle = 1;
    this.reset();
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.onTick(this.timeLeft, this.totalTime);
    } else {
      this.complete();
    }
  }

  complete() {
    clearInterval(this.timerId);
    this.isActive = false;

    const completedSession = {
      mode: this.mode,
      type: this.isBreak ? 'break' : 'work',
      duration: this.totalTime,
      cycle: this.currentCycle
    };

    if (!this.isBreak) {
      this.isBreak = true;
      this.timeLeft = this.getBreakDuration();
      this.totalTime = this.timeLeft;
    } else {
      this.isBreak = false;
      if (this.currentCycle >= this.cyclesBeforeLongBreak) {
        this.currentCycle = 1;
      } else {
        this.currentCycle++;
      }
      this.timeLeft = this.getWorkDuration();
      this.totalTime = this.timeLeft;
    }

    this.onComplete(completedSession);
    this.onStateChange(this.getState());
    this.onTick(this.timeLeft, this.totalTime);
  }

  getState() {
    return {
      mode: this.mode,
      timeLeft: this.timeLeft,
      totalTime: this.totalTime,
      isActive: this.isActive,
      isPaused: this.isPaused,
      isBreak: this.isBreak,
      currentCycle: this.currentCycle,
      cyclesBeforeLongBreak: this.cyclesBeforeLongBreak
    };
  }

  getFormattedTime() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// ===== SOUND MANAGER =====
class SoundManager {
  constructor() {
    this.ambientAudio = null;
    this.alarmAudio = null;
    this.currentAmbient = null;
    this.ambientVolume = 0.5;
    this.alarmVolume = 0.7;
    this.isPlaying = false;
    this.preloadAlarm();
  }

  preloadAlarm() {
    this.alarmAudio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b87c5.mp3');
    this.alarmAudio.volume = this.alarmVolume;
  }

  setAmbientSound(soundKey) {
    const sounds = {
      rain: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112c5d1.mp3',
      whitenoise: 'https://cdn.pixabay.com/audio/2022/03/10/audio_6c4f5f2c6a.mp3',
      forest: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
      coffeeshop: 'https://cdn.pixabay.com/audio/2021/08/08/audio_dc39bde808.mp3'
    };

    if (!sounds[soundKey]) return;

    const wasPlaying = this.isPlaying;

    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio = null;
    }

    this.currentAmbient = soundKey;
    this.ambientAudio = new Audio(sounds[soundKey]);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = this.ambientVolume;

    if (wasPlaying) {
      this.playAmbient();
    }
  }

  setAmbientVolume(volume) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.ambientVolume;
    }
  }

  setAlarmVolume(volume) {
    this.alarmVolume = Math.max(0, Math.min(1, volume));
    if (this.alarmAudio) {
      this.alarmAudio.volume = this.alarmVolume;
    }
  }

  playAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.play().catch(e => console.warn('Could not play ambient sound:', e));
      this.isPlaying = true;
    }
  }

  pauseAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.isPlaying = false;
    }
  }

  toggleAmbient() {
    if (this.isPlaying) {
      this.pauseAmbient();
    } else {
      this.playAmbient();
    }
    return this.isPlaying;
  }

  playAlarm() {
    if (this.alarmAudio) {
      this.alarmAudio.currentTime = 0;
      this.alarmAudio.play().catch(e => console.warn('Could not play alarm:', e));
    }
  }

  getCurrentAmbient() {
    return this.currentAmbient;
  }

  isAmbientPlaying() {
    return this.isPlaying;
  }
}

// ===== STORE =====
class Store {
  constructor() {
    this.state = {
      currentMode: 'classic',
      customWork: 25,
      customBreak: 5,
      customLongBreak: 15,
      cyclesBeforeLongBreak: 4,
      theme: 'dark',
      customColors: { primary: '#8b5cf6' },
      ambientSound: 'rain',
      ambientVolume: 0.5,
      alarmVolume: 0.7,
      history: [],
      presets: []
    };
  }

  init() {
    const saved = localStorage.getItem('focusly_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.warn('Failed to parse saved state, using defaults');
      }
    }
    return this.state;
  }

  save() {
    localStorage.setItem('focusly_state', JSON.stringify(this.state));
  }

  update(key, value) {
    this.state[key] = value;
    this.save();
  }

  get(key) {
    return this.state[key];
  }

  addSession(session) {
    this.state.history.unshift({
      ...session,
      id: Date.now(),
      date: new Date().toISOString()
    });
    if (this.state.history.length > 100) {
      this.state.history = this.state.history.slice(0, 100);
    }
    this.save();
  }
}

// ===== MAIN APP =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  const store = new Store();
  store.init();

  const soundManager = new SoundManager();
  soundManager.setAmbientSound(store.get('ambientSound') || 'rain');
  soundManager.setAmbientVolume(store.get('ambientVolume'));
  soundManager.setAlarmVolume(store.get('alarmVolume'));

  // DOM Elements
  const els = {
    display: document.getElementById('time-display'),
    status: document.getElementById('status-label'),
    sessionType: document.getElementById('session-type'),
    ring: document.querySelector('.ring-progress'),
    btnMain: document.getElementById('btn-main'),
    btnReset: document.getElementById('btn-reset'),
    btnSkip: document.getElementById('btn-skip'),
    btnSound: document.getElementById('btn-sound'),
    btnTheme: document.getElementById('btn-theme'),
    btnSettings: document.getElementById('btn-settings'),
    btnHistory: document.getElementById('btn-history'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    cycleIndicator: document.getElementById('cycle-indicator'),
    soundPanel: document.getElementById('sound-panel'),
    themePanel: document.getElementById('theme-panel'),
    settingsPanel: document.getElementById('settings-panel'),
    historyPanel: document.getElementById('history-panel'),
    panelOverlay: document.getElementById('panel-overlay'),
    soundGrid: document.getElementById('sound-grid'),
    ambientVolume: document.getElementById('ambient-volume'),
    alarmVolume: document.getElementById('alarm-volume'),
    colorGrid: document.getElementById('color-grid'),
    gradientGrid: document.getElementById('gradient-grid'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    customWork: document.getElementById('custom-work'),
    customBreak: document.getElementById('custom-break'),
    customLongBreak: document.getElementById('custom-long-break'),
    cyclesCount: document.getElementById('cycles-count'),
    presetsList: document.getElementById('presets-list'),
    btnSavePreset: document.getElementById('btn-save-preset'),
    historyList: document.getElementById('history-list'),
    totalSessions: document.getElementById('total-sessions'),
    totalTime: document.getElementById('total-time')
  };

  // Setup progress ring
  const radius = 120;
  const circumference = radius * 2 * Math.PI;
  els.ring.style.strokeDasharray = `${circumference} ${circumference}`;
  els.ring.style.strokeDashoffset = 0;

  // Timer
  const timer = new TimerEngine({
    mode: store.get('currentMode'),
    customWork: store.get('customWork'),
    customBreak: store.get('customBreak'),
    customLongBreak: store.get('customLongBreak'),
    cyclesBeforeLongBreak: store.get('cyclesBeforeLongBreak'),

    onTick: (timeLeft, totalTime) => {
      els.display.textContent = timer.getFormattedTime();
      const progress = timeLeft / totalTime;
      const offset = circumference * (1 - progress);
      gsap.to(els.ring, {
        strokeDashoffset: offset,
        duration: 0.5,
        ease: 'power2.out'
      });
    },

    onComplete: session => {
      soundManager.playAlarm();
      window.api.notify({
        title: 'Focusly',
        body: session.type === 'work' ? 'Great work! Time for a break.' : 'Break over! Ready to focus?'
      });

      if (session.type === 'work') {
        store.addSession(session);
        updateHistoryUI();
      }

      // Flash animation
      gsap
        .fromTo('.timer-wrapper', {
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out'
        })
        .to('.timer-wrapper', {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        });
    },

    onStateChange: state => {
      updateUIState(state);
    }
  });

  // UI Functions
  function updateUIState(state) {
    if (!state.isActive) {
      els.btnMain.textContent = state.isBreak ? 'Start Break' : 'Start Focus';
      els.status.textContent = 'Ready';
      gsap.to(els.display, { scale: 1, duration: 0.3 });
    } else if (state.isPaused) {
      els.btnMain.textContent = 'Resume';
      els.status.textContent = 'Paused';
      gsap.to(els.display, { scale: 1, duration: 0.3 });
    } else {
      els.btnMain.textContent = 'Pause';
      els.status.textContent = state.isBreak ? 'Relaxing...' : 'Focusing...';
      gsap.to(els.display, {
        scale: 1.03,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }

    els.sessionType.textContent = state.isBreak ? 'Break Time' : 'Focus Session';
    updateCycleIndicator(state.currentCycle, state.cyclesBeforeLongBreak);

    // Update ring color for break
    if (state.isBreak) {
      els.ring.style.stroke = 'var(--break-color)';
    } else {
      els.ring.style.stroke = 'var(--primary)';
    }

    // Control ambient sound
    if (state.isActive && !state.isPaused && soundManager.getCurrentAmbient()) {
      soundManager.playAmbient();
    } else {
      soundManager.pauseAmbient();
    }
  }

  function updateCycleIndicator(current, total) {
    els.cycleIndicator.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const dot = document.createElement('span');
      dot.className = 'cycle-dot';
      if (i < current) dot.classList.add('completed');
      if (i === current) dot.classList.add('active');
      els.cycleIndicator.appendChild(dot);
    }
  }

  function switchMode(mode) {
    timer.setMode(mode);
    store.update('currentMode', mode);

    els.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  // Panel management
  let activePanel = null;

  function openPanel(panelId) {
    if (activePanel) closePanel();

    const panel = document.getElementById(panelId);
    panel.classList.add('open');
    els.panelOverlay.classList.add('open');
    activePanel = panelId;
  }

  function closePanel() {
    if (!activePanel) return;

    const panel = document.getElementById(activePanel);
    panel.classList.remove('open');
    els.panelOverlay.classList.remove('open');
    activePanel = null;
  }

  // Event Listeners
  els.btnMain.addEventListener('click', () => timer.toggle());
  els.btnReset.addEventListener('click', () => timer.fullReset());
  els.btnSkip.addEventListener('click', () => timer.complete());

  els.modeBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  els.btnSound.addEventListener('click', () => openPanel('sound-panel'));
  els.btnTheme.addEventListener('click', () => openPanel('theme-panel'));
  els.btnSettings.addEventListener('click', () => openPanel('settings-panel'));
  els.btnHistory.addEventListener('click', () => openPanel('history-panel'));

  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', closePanel);
  });

  els.panelOverlay.addEventListener('click', closePanel);

  // Window controls
  document.getElementById('btn-min').addEventListener('click', () => window.api.minimize());
  document.getElementById('btn-max').addEventListener('click', () => window.api.maximize());
  document.getElementById('btn-close').addEventListener('click', () => window.api.close());

  // Sound panel
  function initSoundPanel() {
    const sounds = {
      rain: { name: 'Rain', icon: '🌧️' },
      whitenoise: { name: 'White Noise', icon: '📻' },
      forest: { name: 'Forest', icon: '🌲' },
      coffeeshop: { name: 'Coffee Shop', icon: '☕' }
    };

    els.soundGrid.innerHTML = '';

    Object.entries(sounds).forEach(([key, sound]) => {
      const btn = document.createElement('button');
      btn.className = 'sound-btn';
      btn.dataset.sound = key;
      btn.innerHTML = `
        <span class="sound-icon">${sound.icon}</span>
        <span class="sound-name">${sound.name}</span>
      `;

      if (store.get('ambientSound') === key) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        soundManager.setAmbientSound(key);
        store.update('ambientSound', key);
      });

      els.soundGrid.appendChild(btn);
    });

    els.ambientVolume.value = store.get('ambientVolume') * 100;
    els.alarmVolume.value = store.get('alarmVolume') * 100;

    els.ambientVolume.addEventListener('input', e => {
      const vol = e.target.value / 100;
      soundManager.setAmbientVolume(vol);
      store.update('ambientVolume', vol);
    });

    els.alarmVolume.addEventListener('input', e => {
      const vol = e.target.value / 100;
      soundManager.setAlarmVolume(vol);
      store.update('alarmVolume', vol);
    });
  }

  // Theme panel
  function initThemePanel() {
    const colors = {
      purple: '#8b5cf6',
      blue: '#3b82f6',
      cyan: '#06b6d4',
      green: '#10b981',
      orange: '#f97316',
      pink: '#ec4899',
      red: '#ef4444',
      yellow: '#eab308'
    };

    els.colorGrid.innerHTML = '';

    Object.entries(colors).forEach(([key, color]) => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.style.background = color;
      btn.title = key;
      btn.dataset.color = key;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Apply color with higher specificity
        const root = document.documentElement;
        root.style.setProperty('--primary', color);
        root.style.setProperty('--primary-glow', `${color}66`);

        // Also apply to theme-specific selectors
        const style = document.createElement('style');
        style.textContent = `
          [data-theme="light"] { --primary: ${color} !important; --primary-glow: ${color}66 !important; }
          [data-theme="dark"] { --primary: ${color} !important; --primary-glow: ${color}66 !important; }
        `;

        // Remove old style if exists
        const oldStyle = document.getElementById('custom-color-style');
        if (oldStyle) oldStyle.remove();

        style.id = 'custom-color-style';
        document.head.appendChild(style);

        // Save to store
        store.update('customColors', { primary: color });
      });

      els.colorGrid.appendChild(btn);
    });

    // Theme toggle
    els.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        els.themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.setAttribute('data-theme', btn.dataset.theme);
        store.update('theme', btn.dataset.theme);
      });
    });
  }

  // Settings panel
  function initSettingsPanel() {
    els.customWork.value = store.get('customWork');
    els.customBreak.value = store.get('customBreak');
    els.customLongBreak.value = store.get('customLongBreak');
    els.cyclesCount.value = store.get('cyclesBeforeLongBreak');

    els.customWork.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 25;
      store.update('customWork', val);
      timer.customSettings.work = val;
    });

    els.customBreak.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 5;
      store.update('customBreak', val);
      timer.customSettings.break = val;
    });

    els.customLongBreak.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 15;
      store.update('customLongBreak', val);
      timer.customSettings.longBreak = val;
    });

    els.cyclesCount.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 4;
      store.update('cyclesBeforeLongBreak', val);
      timer.cyclesBeforeLongBreak = val;
      updateCycleIndicator(timer.getState().currentCycle, val);
    });
  }

  // History panel
  function updateHistoryUI() {
    const history = store.get('history');
    const workSessions = history.filter(s => s.type === 'work');
    const totalMinutes = workSessions.reduce((acc, s) => acc + s.duration / 60, 0);

    els.totalSessions.textContent = workSessions.length;
    els.totalTime.textContent = totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m` : `${Math.round(totalMinutes)}m`;

    els.historyList.innerHTML = '';

    if (history.length === 0) {
      els.historyList.innerHTML = '<div class="empty-state">No sessions yet</div>';
      return;
    }

    history.slice(0, 20).forEach(session => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const date = new Date(session.date);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      item.innerHTML = `
        <div>
          <div class="history-mode">${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}</div>
          <div class="history-type">${session.type}</div>
        </div>
        <div>
          <div class="history-duration">${Math.round(session.duration / 60)} min</div>
          <div class="history-date">${dateStr} ${timeStr}</div>
        </div>
      `;

      els.historyList.appendChild(item);
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !activePanel) {
      e.preventDefault();
      timer.toggle();
    }
    if (e.code === 'Escape') {
      if (activePanel) closePanel();
    }
  });

  // Initialize
  function init() {
    // Set initial mode
    const savedMode = store.get('currentMode');
    els.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === savedMode);
    });

    // Update theme buttons
    els.themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === store.get('theme'));
    });

    // Apply saved theme
    document.body.setAttribute('data-theme', store.get('theme'));

    // Apply saved custom colors if any
    const savedColors = store.get('customColors');
    if (savedColors && savedColors.primary) {
      const color = savedColors.primary;

      // Apply color with higher specificity
      const root = document.documentElement;
      root.style.setProperty('--primary', color);
      root.style.setProperty('--primary-glow', `${color}66`);

      // Also apply to theme-specific selectors
      const style = document.createElement('style');
      style.textContent = `
        [data-theme="light"] { --primary: ${color} !important; --primary-glow: ${color}66 !important; }
        [data-theme="dark"] { --primary: ${color} !important; --primary-glow: ${color}66 !important; }
      `;

      style.id = 'custom-color-style';
      document.head.appendChild(style);
    }

    // Initial UI update
    els.display.textContent = timer.getFormattedTime();
    updateCycleIndicator(1, store.get('cyclesBeforeLongBreak'));

    // Initialize panels
    initSoundPanel();
    initThemePanel();
    initSettingsPanel();
    updateHistoryUI();

    // Page load animation
    gsap
      .from('.titlebar', {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
      .from(
        '.modes',
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        },
        '-=0.2'
      )
      .from(
        '.timer-wrapper',
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      )
      .from(
        '.controls',
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        },
        '-=0.2'
      );
  }

  init();
});
