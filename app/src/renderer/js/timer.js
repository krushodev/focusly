// Pomodoro Timer Engine

const MODES = {
  classic: { work: 25, break: 5, longBreak: 15 },
  deep: { work: 50, break: 10, longBreak: 20 },
  ultra: { work: 90, break: 20, longBreak: 30 },
  custom: { work: 25, break: 5, longBreak: 15 }
};

export class TimerEngine {
  constructor(options = {}) {
    this.mode = options.mode || 'classic';
    this.cyclesBeforeLongBreak = options.cyclesBeforeLongBreak || 4;
    
    // Custom mode settings
    this.customSettings = {
      work: options.customWork || 25,
      break: options.customBreak || 5,
      longBreak: options.customLongBreak || 15
    };
    
    // State
    this.timeLeft = this.getWorkDuration();
    this.totalTime = this.timeLeft;
    this.isActive = false;
    this.isPaused = false;
    this.isBreak = false;
    this.currentCycle = 1;
    this.timerId = null;
    
    // Callbacks
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
  }
  
  getWorkDuration() {
    if (this.mode === 'custom') {
      return this.customSettings.work * 60;
    }
    return MODES[this.mode].work * 60;
  }
  
  getBreakDuration() {
    const isLongBreak = this.currentCycle >= this.cyclesBeforeLongBreak;
    if (this.mode === 'custom') {
      return (isLongBreak ? this.customSettings.longBreak : this.customSettings.break) * 60;
    }
    return (isLongBreak ? MODES[this.mode].longBreak : MODES[this.mode].break) * 60;
  }
  
  setMode(mode) {
    this.mode = mode;
    this.reset();
  }
  
  setCustomSettings(settings) {
    this.customSettings = { ...this.customSettings, ...settings };
    if (this.mode === 'custom') {
      this.reset();
    }
  }
  
  setCycles(cycles) {
    this.cyclesBeforeLongBreak = cycles;
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
  
  resume() {
    if (!this.isPaused) return;
    this.start();
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
      // Work session completed, start break
      this.isBreak = true;
      this.timeLeft = this.getBreakDuration();
      this.totalTime = this.timeLeft;
    } else {
      // Break completed, increment cycle and start work
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
  
  skipToNext() {
    this.complete();
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
  
  getProgress() {
    return this.timeLeft / this.totalTime;
  }
  
  getFormattedTime() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
