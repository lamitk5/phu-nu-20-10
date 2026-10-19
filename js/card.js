/**
 * Thiệp 3D — parallax + mở/đóng (chỉ hoạt động ở stage letter)
 */

class Interactive3DCard {
  constructor() {
    this.scene = document.getElementById('cardScene');
    this.wrapper = document.getElementById('cardWrapper');
    this.openBtn = document.getElementById('openCardBtn');
    this.closeBtn = document.getElementById('closeCardBtn');
    this.triggerShowerBtn = document.getElementById('triggerShowerBtn');

    this.isOpen = false;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.currentRotateX = 0;
    this.currentRotateY = 0;

    this.init();
  }

  isLetterStage() {
    return document.body.dataset.stage === 'letter';
  }

  init() {
    this.initEvents();
    this.initParallaxLoop();
  }

  initEvents() {
    this.openBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openCard();
    });

    this.closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeCard();
    });

    this.triggerShowerBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.wishesManager) {
        window.wishesManager.triggerFullShower();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isLetterStage() || this.isOpen) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      this.targetRotateY = deltaX * 14;
      this.targetRotateX = -deltaY * 10;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.targetRotateX = 0;
      this.targetRotateY = 0;
    });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (!this.isLetterStage() || this.isOpen || e.gamma == null || e.beta == null) return;
        const clampY = Math.max(-25, Math.min(25, e.gamma));
        const clampX = Math.max(-20, Math.min(20, e.beta - 45));
        this.targetRotateY = (clampY / 25) * 12;
        this.targetRotateX = -(clampX / 20) * 10;
      }, { passive: true });
    }

    let touchStartX = 0;
    let touchStartY = 0;

    this.wrapper?.addEventListener('touchstart', (e) => {
      if (!this.isLetterStage() || this.isOpen) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.wrapper?.addEventListener('touchmove', (e) => {
      if (!this.isLetterStage() || this.isOpen) return;
      const moveX = (e.touches[0].clientX - touchStartX) / 10;
      const moveY = (e.touches[0].clientY - touchStartY) / 10;
      this.targetRotateY = Math.max(-14, Math.min(14, moveX));
      this.targetRotateX = Math.max(-10, Math.min(10, -moveY));
    }, { passive: true });

    this.wrapper?.addEventListener('touchend', () => {
      this.targetRotateX = 0;
      this.targetRotateY = 0;
    }, { passive: true });
  }

  initParallaxLoop() {
    const updateTilt = () => {
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.08;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.08;

      if (this.wrapper) {
        if (this.isLetterStage() && !this.isOpen) {
          this.wrapper.style.transform =
            `rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg)`;
        } else {
          this.wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
      }

      requestAnimationFrame(updateTilt);
    };
    updateTilt();
  }

  openCard() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.scene?.classList.add('is-open');

    if (window.audioManager) {
      window.audioManager.playOpenChime();
      if (!window.audioManager.isPlaying) {
        setTimeout(() => window.audioManager.startMelody(), 600);
      }
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#e07a5f', '#f0a59a', '#c9a66b', '#6b9b7e']
      });
    }

    if (window.wishesManager) {
      window.wishesManager.startFloatingShower();
    }
  }

  closeCard() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.scene?.classList.remove('is-open');
  }
}

window.cardController = new Interactive3DCard();
