// Theme Manager

const THEMES = {
  dark: {
    name: 'Dark',
    vars: {
      '--bg': '#0e0f12',
      '--surface': '#15171c',
      '--primary': '#8b5cf6',
      '--primary-glow': 'rgba(139, 92, 246, 0.4)',
      '--text-main': '#ededed',
      '--text-dim': '#9ca3af',
      '--ring-bg': '#27272a',
      '--success': '#10b981',
      '--break-color': '#06b6d4'
    }
  },
  light: {
    name: 'Light',
    vars: {
      '--bg': '#f9fafb',
      '--surface': '#ffffff',
      '--primary': '#7c3aed',
      '--primary-glow': 'rgba(124, 58, 237, 0.2)',
      '--text-main': '#111827',
      '--text-dim': '#6b7280',
      '--ring-bg': '#e5e7eb',
      '--success': '#059669',
      '--break-color': '#0891b2'
    }
  }
};

const GRADIENTS = {
  'gradient-purple': {
    name: 'Purple Dream',
    value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
  },
  'gradient-ocean': {
    name: 'Ocean Deep',
    value: 'linear-gradient(135deg, #0c1821 0%, #1b2838 50%, #0d1b2a 100%)'
  },
  'gradient-forest': {
    name: 'Forest Night',
    value: 'linear-gradient(135deg, #0d1f0d 0%, #1a2f1a 50%, #0a1a0a 100%)'
  },
  'gradient-sunset': {
    name: 'Sunset Glow',
    value: 'linear-gradient(135deg, #1a1423 0%, #2d1f3d 50%, #1a0f1f 100%)'
  },
  'gradient-minimal': {
    name: 'Minimal Dark',
    value: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)'
  },
  'gradient-warm': {
    name: 'Warm Night',
    value: 'linear-gradient(135deg, #1f1a14 0%, #2a2018 50%, #151210 100%)'
  }
};

const COLOR_PRESETS = {
  purple: { primary: '#8b5cf6', name: 'Purple' },
  blue: { primary: '#3b82f6', name: 'Blue' },
  cyan: { primary: '#06b6d4', name: 'Cyan' },
  green: { primary: '#10b981', name: 'Green' },
  orange: { primary: '#f97316', name: 'Orange' },
  pink: { primary: '#ec4899', name: 'Pink' },
  red: { primary: '#ef4444', name: 'Red' },
  yellow: { primary: '#eab308', name: 'Yellow' }
};

export class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.currentGradient = 'gradient-purple';
    this.currentColor = 'purple';
    this.useGradient = true;
  }
  
  init(savedState = {}) {
    this.currentTheme = savedState.theme || 'dark';
    this.currentGradient = savedState.customColors?.background || 'gradient-purple';
    this.currentColor = this.getColorKeyFromPrimary(savedState.customColors?.primary) || 'purple';
    this.useGradient = savedState.useGradient !== false;
    
    this.applyTheme();
    this.applyGradient();
    this.applyColor();
  }
  
  getColorKeyFromPrimary(primary) {
    if (!primary) return 'purple';
    for (const [key, value] of Object.entries(COLOR_PRESETS)) {
      if (value.primary === primary) return key;
    }
    return 'purple';
  }
  
  setTheme(theme) {
    if (!THEMES[theme]) return;
    this.currentTheme = theme;
    this.applyTheme();
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    return this.currentTheme;
  }
  
  applyTheme() {
    const theme = THEMES[this.currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme.vars).forEach(([key, value]) => {
      // Don't override primary if custom color is set
      if (key === '--primary' || key === '--primary-glow') return;
      root.style.setProperty(key, value);
    });
    
    document.body.setAttribute('data-theme', this.currentTheme);
  }
  
  setGradient(gradientKey) {
    if (!GRADIENTS[gradientKey]) return;
    this.currentGradient = gradientKey;
    this.useGradient = true;
    this.applyGradient();
  }
  
  applyGradient() {
    if (this.useGradient && this.currentTheme === 'dark') {
      const gradient = GRADIENTS[this.currentGradient];
      document.body.style.background = gradient.value;
    } else {
      document.body.style.background = '';
    }
  }
  
  toggleGradient() {
    this.useGradient = !this.useGradient;
    this.applyGradient();
    return this.useGradient;
  }
  
  setColor(colorKey) {
    if (!COLOR_PRESETS[colorKey]) return;
    this.currentColor = colorKey;
    this.applyColor();
  }
  
  applyColor() {
    const color = COLOR_PRESETS[this.currentColor];
    const root = document.documentElement;
    
    root.style.setProperty('--primary', color.primary);
    root.style.setProperty('--primary-glow', `${color.primary}66`);
  }
  
  getThemes() {
    return THEMES;
  }
  
  getGradients() {
    return GRADIENTS;
  }
  
  getColorPresets() {
    return COLOR_PRESETS;
  }
  
  getCurrentState() {
    return {
      theme: this.currentTheme,
      gradient: this.currentGradient,
      color: this.currentColor,
      useGradient: this.useGradient,
      primary: COLOR_PRESETS[this.currentColor].primary
    };
  }
}
