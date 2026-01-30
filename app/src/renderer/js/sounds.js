// Sound Manager with external API sounds

const AMBIENT_SOUNDS = {
  rain: {
    name: 'Rain',
    url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112c5d1.mp3',
    icon: '🌧️'
  },
  whitenoise: {
    name: 'White Noise',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_6c4f5f2c6a.mp3',
    icon: '📻'
  },
  forest: {
    name: 'Forest',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    icon: '🌲'
  },
  coffeeshop: {
    name: 'Coffee Shop',
    url: 'https://cdn.pixabay.com/audio/2021/08/08/audio_dc39bde808.mp3',
    icon: '☕'
  },
  ocean: {
    name: 'Ocean Waves',
    url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3',
    icon: '🌊'
  },
  fireplace: {
    name: 'Fireplace',
    url: 'https://cdn.pixabay.com/audio/2021/10/07/audio_8b1c7e1e3d.mp3',
    icon: '🔥'
  }
};

const ALARM_SOUNDS = {
  gentle: {
    name: 'Gentle Bell',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b87c5.mp3'
  },
  chime: {
    name: 'Chime',
    url: 'https://cdn.pixabay.com/audio/2022/07/19/audio_d4e8c89f0c.mp3'
  },
  digital: {
    name: 'Digital',
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_d1718ab41b.mp3'
  }
};

export class SoundManager {
  constructor() {
    this.ambientAudio = null;
    this.alarmAudio = null;
    this.currentAmbient = null;
    this.ambientVolume = 0.5;
    this.alarmVolume = 0.7;
    this.isPlaying = false;
    this.currentAlarm = 'gentle';
    
    // Preload alarm sound
    this.preloadAlarm();
  }
  
  preloadAlarm() {
    this.alarmAudio = new Audio(ALARM_SOUNDS[this.currentAlarm].url);
    this.alarmAudio.volume = this.alarmVolume;
  }
  
  setAmbientSound(soundKey) {
    if (!AMBIENT_SOUNDS[soundKey]) return;
    
    const wasPlaying = this.isPlaying;
    
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio = null;
    }
    
    this.currentAmbient = soundKey;
    this.ambientAudio = new Audio(AMBIENT_SOUNDS[soundKey].url);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = this.ambientVolume;
    
    if (wasPlaying) {
      this.playAmbient();
    }
  }
  
  setAlarmSound(soundKey) {
    if (!ALARM_SOUNDS[soundKey]) return;
    this.currentAlarm = soundKey;
    this.preloadAlarm();
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
    if (!this.ambientAudio && this.currentAmbient) {
      this.setAmbientSound(this.currentAmbient);
    }
    
    if (this.ambientAudio) {
      this.ambientAudio.play().catch(e => {
        console.warn('Could not play ambient sound:', e);
      });
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
      this.alarmAudio.play().catch(e => {
        console.warn('Could not play alarm:', e);
      });
    }
  }
  
  stopAlarm() {
    if (this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio.currentTime = 0;
    }
  }
  
  getAmbientSounds() {
    return AMBIENT_SOUNDS;
  }
  
  getAlarmSounds() {
    return ALARM_SOUNDS;
  }
  
  getCurrentAmbient() {
    return this.currentAmbient;
  }
  
  isAmbientPlaying() {
    return this.isPlaying;
  }
}
