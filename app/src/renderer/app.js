// GSAP is loaded globally

// ===== APP INITIALIZATION =====
(async function () {
  // Load modules dynamically
  const { TimerEngine } = await import('./js/timer.js');
  const { SoundManager } = await import('./js/sounds.js');
  const { ThemeManager } = await import('./js/themes.js');
  const { AnimationManager } = await import('./js/animations.js');
  const { Store } = await import('./js/store.js');

  // ===== INITIALIZATION =====
  const store = Store;
  store.init();

  const soundManager = new SoundManager();
  const themeManager = new ThemeManager();
  const animations = new AnimationManager();

  // ===== DOM ELEMENTS =====
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
    // Panels
    soundPanel: document.getElementById('sound-panel'),
    themePanel: document.getElementById('theme-panel'),
    settingsPanel: document.getElementById('settings-panel'),
    historyPanel: document.getElementById('history-panel'),
    panelOverlay: document.getElementById('panel-overlay'),
    // Sound panel
    soundGrid: document.getElementById('sound-grid'),
    ambientVolume: document.getElementById('ambient-volume'),
    alarmVolume: document.getElementById('alarm-volume'),
    // Theme panel
    colorGrid: document.getElementById('color-grid'),
    gradientGrid: document.getElementById('gradient-grid'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    // Settings panel
    customWork: document.getElementById('custom-work'),
    customBreak: document.getElementById('custom-break'),
    customLongBreak: document.getElementById('custom-long-break'),
    cyclesCount: document.getElementById('cycles-count'),
    presetsList: document.getElementById('presets-list'),
    btnSavePreset: document.getElementById('btn-save-preset'),
    // History panel
    historyList: document.getElementById('history-list'),
    totalSessions: document.getElementById('total-sessions'),
    totalTime: document.getElementById('total-time')
  };

  // ===== SETUP PROGRESS RING =====
  const radius = 120;
  const circumference = radius * 2 * Math.PI;
  els.ring.style.strokeDasharray = `${circumference} ${circumference}`;
  els.ring.style.strokeDashoffset = 0;

  // ===== TIMER ENGINE =====
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
      // Play alarm
      soundManager.playAlarm();

      // Show notification
      const isBreak = session.type === 'work';
      window.api.notify({
        title: 'Focusly',
        body: isBreak ? 'Great work! Time for a break.' : 'Break over! Ready to focus?'
      });

      // Save to history
      if (session.type === 'work') {
        store.addSession(session);
        updateHistoryUI();
      }

      // Animation
      animations.flashComplete();
    },

    onStateChange: state => {
      updateUIState(state);
    }
  });

  // ===== UI UPDATE FUNCTIONS =====
  function updateUIState(state) {
    // Update button text
    if (!state.isActive) {
      els.btnMain.textContent = state.isBreak ? 'Start Break' : 'Start Focus';
      els.status.textContent = 'Ready';
      animations.stopBreathing(els.display);
    } else if (state.isPaused) {
      els.btnMain.textContent = 'Resume';
      els.status.textContent = 'Paused';
      animations.stopBreathing(els.display);
    } else {
      els.btnMain.textContent = 'Pause';
      els.status.textContent = state.isBreak ? 'Relaxing...' : 'Focusing...';
      animations.startBreathing(els.display);
    }

    // Update session type label
    els.sessionType.textContent = state.isBreak ? 'Break Time' : 'Focus Session';

    // Update cycle indicator
    updateCycleIndicator(state.currentCycle, state.cyclesBeforeLongBreak);

    // Update ring color for break
    animations.animateBreakMode(state.isBreak);

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

    animations.animateModeSwitch(els.display);
  }

  // ===== PANEL MANAGEMENT =====
  let activePanel = null;

  function openPanel(panelId) {
    if (activePanel) closePanel();

    const panel = document.getElementById(panelId);
    panel.classList.add('open');
    els.panelOverlay.classList.add('open');
    activePanel = panelId;

    animations.slideIn(panel);
  }

  function closePanel() {
    if (!activePanel) return;

    const panel = document.getElementById(activePanel);
    panel.classList.remove('open');
    els.panelOverlay.classList.remove('open');
    activePanel = null;
  }

  // ===== SOUND PANEL =====
  function initSoundPanel() {
    const sounds = soundManager.getAmbientSounds();
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

        // Play preview
        if (!timer.getState().isActive) {
          soundManager.playAmbient();
          setTimeout(() => soundManager.pauseAmbient(), 2000);
        }
      });

      els.soundGrid.appendChild(btn);
    });

    // Volume controls
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

  // ===== THEME PANEL =====
  function initThemePanel() {
    // Color presets
    const colors = themeManager.getColorPresets();
    els.colorGrid.innerHTML = '';

    Object.entries(colors).forEach(([key, color]) => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.style.background = color.primary;
      btn.title = color.name;
      btn.dataset.color = key;

      if (themeManager.getCurrentState().color === key) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        themeManager.setColor(key);
        store.update('customColors', {
          ...store.get('customColors'),
          primary: color.primary
        });
      });

      els.colorGrid.appendChild(btn);
    });

    // Gradient presets
    const gradients = themeManager.getGradients();
    els.gradientGrid.innerHTML = '';

    Object.entries(gradients).forEach(([key, gradient]) => {
      const btn = document.createElement('button');
      btn.className = 'gradient-btn';
      btn.style.background = gradient.value;
      btn.title = gradient.name;
      btn.dataset.gradient = key;

      if (themeManager.getCurrentState().gradient === key) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.gradient-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        themeManager.setGradient(key);
        store.update('customColors', {
          ...store.get('customColors'),
          background: key
        });
      });

      els.gradientGrid.appendChild(btn);
    });

    // Theme toggle
    els.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        els.themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        themeManager.setTheme(btn.dataset.theme);
        themeManager.applyGradient();
        store.update('theme', btn.dataset.theme);
      });
    });
  }

  // ===== SETTINGS PANEL =====
  function initSettingsPanel() {
    // Load saved values
    els.customWork.value = store.get('customWork');
    els.customBreak.value = store.get('customBreak');
    els.customLongBreak.value = store.get('customLongBreak');
    els.cyclesCount.value = store.get('cyclesBeforeLongBreak');

    // Custom timer inputs
    els.customWork.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 25;
      store.update('customWork', val);
      timer.setCustomSettings({ work: val });
    });

    els.customBreak.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 5;
      store.update('customBreak', val);
      timer.setCustomSettings({ break: val });
    });

    els.customLongBreak.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 15;
      store.update('customLongBreak', val);
      timer.setCustomSettings({ longBreak: val });
    });

    els.cyclesCount.addEventListener('change', e => {
      const val = parseInt(e.target.value) || 4;
      store.update('cyclesBeforeLongBreak', val);
      timer.setCycles(val);
      updateCycleIndicator(timer.getState().currentCycle, val);
    });

    // Save preset
    els.btnSavePreset.addEventListener('click', () => {
      const preset = {
        name: `Preset ${store.get('presets').length + 1}`,
        work: parseInt(els.customWork.value),
        break: parseInt(els.customBreak.value),
        longBreak: parseInt(els.customLongBreak.value),
        cycles: parseInt(els.cyclesCount.value)
      };
      store.addPreset(preset);
      updatePresetsUI();
    });

    updatePresetsUI();
  }

  function updatePresetsUI() {
    const presets = store.get('presets');
    els.presetsList.innerHTML = '';

    if (presets.length === 0) {
      els.presetsList.innerHTML = '<div class="empty-state">No presets saved</div>';
      return;
    }

    presets.forEach(preset => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.innerHTML = `
      <div>
        <div class="preset-name">${preset.name}</div>
        <div class="preset-details">${preset.work}/${preset.break}/${preset.longBreak} • ${preset.cycles} cycles</div>
      </div>
      <button class="preset-delete" data-id="${preset.id}">×</button>
    `;

      item.addEventListener('click', e => {
        if (e.target.classList.contains('preset-delete')) {
          store.removePreset(preset.id);
          updatePresetsUI();
          return;
        }

        // Apply preset
        els.customWork.value = preset.work;
        els.customBreak.value = preset.break;
        els.customLongBreak.value = preset.longBreak;
        els.cyclesCount.value = preset.cycles;

        store.update('customWork', preset.work);
        store.update('customBreak', preset.break);
        store.update('customLongBreak', preset.longBreak);
        store.update('cyclesBeforeLongBreak', preset.cycles);

        timer.setCustomSettings({
          work: preset.work,
          break: preset.break,
          longBreak: preset.longBreak
        });
        timer.setCycles(preset.cycles);

        // Switch to custom mode
        switchMode('custom');
      });

      els.presetsList.appendChild(item);
    });
  }

  // ===== HISTORY PANEL =====
  function updateHistoryUI() {
    const history = store.get('history');

    // Stats
    const workSessions = history.filter(s => s.type === 'work');
    const totalMinutes = workSessions.reduce((acc, s) => acc + s.duration / 60, 0);

    els.totalSessions.textContent = workSessions.length;
    els.totalTime.textContent = totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m` : `${Math.round(totalMinutes)}m`;

    // List
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

  // ===== EVENT LISTENERS =====

  // Main controls
  els.btnMain.addEventListener('click', () => timer.toggle());
  els.btnReset.addEventListener('click', () => timer.fullReset());
  els.btnSkip.addEventListener('click', () => timer.skipToNext());

  // Mode buttons
  els.modeBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Panel buttons
  els.btnSound.addEventListener('click', () => openPanel('sound-panel'));
  els.btnTheme.addEventListener('click', () => openPanel('theme-panel'));
  els.btnSettings.addEventListener('click', () => openPanel('settings-panel'));
  els.btnHistory.addEventListener('click', () => openPanel('history-panel'));

  // Panel close buttons
  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', closePanel);
  });

  // Overlay click to close
  els.panelOverlay.addEventListener('click', closePanel);

  // Window controls
  document.getElementById('btn-min').addEventListener('click', () => window.api.minimize());
  document.getElementById('btn-max').addEventListener('click', () => window.api.maximize());
  document.getElementById('btn-close').addEventListener('click', () => window.api.close());

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !activePanel) {
      e.preventDefault();
      timer.toggle();
    }
    if (e.code === 'Escape') {
      if (activePanel) closePanel();
    }
    if (e.code === 'KeyR' && e.ctrlKey) {
      e.preventDefault();
      timer.fullReset();
    }
  });

  // ===== INITIALIZATION =====
  function init() {
    // Initialize theme
    themeManager.init({
      theme: store.get('theme'),
      customColors: store.get('customColors')
    });

    // Initialize sound
    soundManager.setAmbientSound(store.get('ambientSound') || 'rain');
    soundManager.setAmbientVolume(store.get('ambientVolume'));
    soundManager.setAlarmVolume(store.get('alarmVolume'));

    // Initialize panels
    initSoundPanel();
    initThemePanel();
    initSettingsPanel();
    updateHistoryUI();

    // Set initial mode
    const savedMode = store.get('currentMode');
    els.modeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === savedMode);
    });

    // Update theme buttons
    els.themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === store.get('theme'));
    });

    // Initial UI update
    els.display.textContent = timer.getFormattedTime();
    updateCycleIndicator(1, store.get('cyclesBeforeLongBreak'));

    // Page load animation
    animations.animatePageLoad();
    animations.setupButtonHovers();
  }

  // Start app
  init();
})(); // Close async function
