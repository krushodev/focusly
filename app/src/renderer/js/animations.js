// GSAP Animation Manager

import { gsap } from 'gsap';

export class AnimationManager {
  constructor() {
    this.breathingTween = null;
    this.ringTween = null;
  }
  
  // Progress ring animation
  animateRing(ringElement, progress, circumference) {
    const offset = circumference * (1 - progress);
    
    gsap.to(ringElement, {
      strokeDashoffset: offset,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  // Reset ring with bounce effect
  resetRing(ringElement) {
    gsap.to(ringElement, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  }
  
  // Breathing animation for timer display
  startBreathing(element) {
    this.stopBreathing();
    this.breathingTween = gsap.to(element, {
      scale: 1.03,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }
  
  stopBreathing(element) {
    if (this.breathingTween) {
      this.breathingTween.kill();
      this.breathingTween = null;
    }
    if (element) {
      gsap.to(element, { scale: 1, duration: 0.3 });
    }
  }
  
  // Session complete flash
  flashComplete(callback) {
    const tl = gsap.timeline({
      onComplete: callback
    });
    
    tl.to('.timer-wrapper', {
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out'
    })
    .to('.timer-wrapper', {
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    })
    .to('.ring-progress', {
      stroke: 'var(--success)',
      duration: 0.3
    }, 0)
    .to('.ring-progress', {
      stroke: 'var(--primary)',
      duration: 0.5,
      delay: 0.5
    });
    
    return tl;
  }
  
  // Button hover effect
  setupButtonHovers() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.02,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    });
  }
  
  // Mode switch animation
  animateModeSwitch(container) {
    gsap.fromTo(container, 
      { opacity: 0.5, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }
  
  // Panel slide in
  slideIn(element, direction = 'right') {
    const x = direction === 'right' ? 100 : -100;
    gsap.fromTo(element,
      { x, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }
  
  // Panel slide out
  slideOut(element, direction = 'right') {
    const x = direction === 'right' ? 100 : -100;
    return gsap.to(element, {
      x,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in'
    });
  }
  
  // Fade in
  fadeIn(element, duration = 0.3) {
    gsap.fromTo(element,
      { opacity: 0 },
      { opacity: 1, duration, ease: 'power2.out' }
    );
  }
  
  // Fade out
  fadeOut(element, duration = 0.3) {
    return gsap.to(element, {
      opacity: 0,
      duration,
      ease: 'power2.in'
    });
  }
  
  // Pulse effect
  pulse(element) {
    gsap.fromTo(element,
      { scale: 1 },
      { 
        scale: 1.1, 
        duration: 0.15, 
        yoyo: true, 
        repeat: 1,
        ease: 'power2.inOut'
      }
    );
  }
  
  // Shake effect (for errors)
  shake(element) {
    gsap.fromTo(element,
      { x: 0 },
      {
        x: 5,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => gsap.set(element, { x: 0 })
      }
    );
  }
  
  // Status label animation
  animateStatus(element, text) {
    gsap.to(element, {
      opacity: 0,
      y: -5,
      duration: 0.15,
      onComplete: () => {
        element.textContent = text;
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.15
        });
      }
    });
  }
  
  // Initial page load animation
  animatePageLoad() {
    const tl = gsap.timeline();
    
    tl.from('.titlebar', {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
    .from('.modes', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .from('.timer-wrapper', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .from('.controls', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .from('.footer-controls', {
      opacity: 0,
      duration: 0.3
    }, '-=0.2');
    
    return tl;
  }
  
  // Break mode visual change
  animateBreakMode(isBreak) {
    if (isBreak) {
      gsap.to('.ring-progress', {
        stroke: 'var(--break-color)',
        duration: 0.5
      });
      gsap.to('.timer-wrapper', {
        filter: 'hue-rotate(60deg)',
        duration: 0.5
      });
    } else {
      gsap.to('.ring-progress', {
        stroke: 'var(--primary)',
        duration: 0.5
      });
      gsap.to('.timer-wrapper', {
        filter: 'hue-rotate(0deg)',
        duration: 0.5
      });
    }
  }
}
