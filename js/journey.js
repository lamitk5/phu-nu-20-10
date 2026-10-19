/**
 * Hành trình Vườn 20/10:
 * gate → garden (đánh thức hoa 3D) → letter
 * Parallax chuột / cảm ứng trên thế giới vườn
 */

class GardenJourney {
  constructor() {
    this.body = document.body;
    this.stageGate = document.getElementById('stageGate');
    this.stageGarden = document.getElementById('stageGarden');
    this.stageLetter = document.getElementById('stageLetter');
    this.enterBtn = document.getElementById('enterGardenBtn');
    this.secretBtn = document.getElementById('secretLetterBtn');
    this.backBtn = document.getElementById('backToGardenBtn');
    this.gardenWorld = document.getElementById('gardenWorld');
    this.gardenHint = document.getElementById('gardenHint');
    this.awakeCountEl = document.getElementById('awakeCount');
    this.progressDots = document.querySelectorAll('.progress-dots i');
    this.blooms = Array.from(document.querySelectorAll('.bloom-3d'));

    this.stage = 'gate';
    this.awakeNeeded = 3;
    this.awakeCount = 0;
    this.secretUnlocked = false;

    this.parallaxX = 0;
    this.parallaxY = 0;
    this.targetPX = 0;
    this.targetPY = 0;

    this.init();
  }

  init() {
    this.enterBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.goTo('garden');
    });

    this.secretBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.goTo('letter');
    });

    this.backBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.goTo('garden');
      if (window.cardController?.isOpen) {
        window.cardController.closeCard();
      }
    });

    this.blooms.forEach((bloom) => {
      bloom.addEventListener('click', (e) => {
        e.stopPropagation();
        this.awakenBloom(bloom);
      });
    });

    window.addEventListener('mousemove', (e) => {
      if (this.stage !== 'garden') return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.targetPX = ((e.clientX - cx) / cx) * 18;
      this.targetPY = ((e.clientY - cy) / cy) * 12;
    }, { passive: true });

    window.addEventListener('deviceorientation', (e) => {
      if (this.stage !== 'garden' || e.gamma == null || e.beta == null) return;
      this.targetPX = Math.max(-18, Math.min(18, e.gamma * 0.6));
      this.targetPY = Math.max(-12, Math.min(12, (e.beta - 45) * 0.35));
    }, { passive: true });

    this.loopParallax();
  }

  loopParallax() {
    const tick = () => {
      this.parallaxX += (this.targetPX - this.parallaxX) * 0.08;
      this.parallaxY += (this.targetPY - this.parallaxY) * 0.08;

      if (this.stage === 'garden' && this.gardenWorld) {
        this.gardenWorld.querySelectorAll('.parallax-layer').forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth || '0.3');
          layer.style.transform =
            `translate3d(${(this.parallaxX * depth).toFixed(2)}px, ${(this.parallaxY * depth).toFixed(2)}px, 0)` +
            ` rotateY(${(this.parallaxX * depth * 0.15).toFixed(2)}deg)` +
            ` rotateX(${(-this.parallaxY * depth * 0.12).toFixed(2)}deg)`;
        });
      }

      requestAnimationFrame(tick);
    };
    tick();
  }

  goTo(stage) {
    if (stage === this.stage) return;

    const prev = this.stage;
    this.stage = stage;
    this.body.dataset.stage = stage;

    [this.stageGate, this.stageGarden, this.stageLetter].forEach((el) => {
      if (!el) return;
      el.classList.remove('is-active');
      el.hidden = true;
    });

    const map = {
      gate: this.stageGate,
      garden: this.stageGarden,
      letter: this.stageLetter
    };

    const next = map[stage];
    if (next) {
      next.hidden = false;
      // Force reflow for transition
      void next.offsetWidth;
      next.classList.add('is-active');
    }

    if (stage === 'garden') {
      if (window.audioManager && !window.audioManager.isPlaying) {
        window.audioManager.initAudioContext();
        window.audioManager.startMelody();
      }
      if (window.petalEngine?.burst) {
        window.petalEngine.burst();
      }
    }

    if (stage === 'letter') {
      if (window.audioManager) {
        window.audioManager.playOpenChime?.();
      }
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 90,
          origin: { y: 0.45 },
          colors: ['#e07a5f', '#c9a66b', '#6b9b7e', '#f0a59a']
        });
      }
    }

    if (prev === 'letter' && stage === 'garden' && window.wishesManager) {
      // Keep wishes if any; no hard clear needed
    }

    if (window.lucide) lucide.createIcons();
  }

  awakenBloom(bloom) {
    if (bloom.classList.contains('is-awake')) return;

    bloom.classList.add('is-awake');
    bloom.setAttribute('aria-pressed', 'true');

    if (window.audioManager) {
      window.audioManager.playPopSound?.();
    }

    if (typeof confetti === 'function') {
      const rect = bloom.getBoundingClientRect();
      confetti({
        particleCount: 28,
        spread: 55,
        startVelocity: 22,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#e07a5f', '#f0a59a', '#c9a66b', '#fff']
      });
    }

    if (window.petalEngine?.burst) {
      window.petalEngine.burst();
    }

    this.awakeCount = Math.min(this.awakeNeeded, this.awakeCount + 1);
    this.updateProgress();

    if (this.awakeCount >= this.awakeNeeded && !this.secretUnlocked) {
      this.unlockSecret();
    }
  }

  updateProgress() {
    if (this.awakeCountEl) {
      this.awakeCountEl.textContent = String(this.awakeCount);
    }
    this.progressDots.forEach((dot, i) => {
      dot.dataset.awake = i < this.awakeCount ? '1' : '0';
    });
  }

  unlockSecret() {
    this.secretUnlocked = true;
    if (this.gardenHint) {
      this.gardenHint.textContent = 'Một phong thư vừa nở giữa vườn — hãy mở ra';
    }
    if (this.secretBtn) {
      this.secretBtn.hidden = false;
      requestAnimationFrame(() => {
        this.secretBtn.classList.add('is-visible');
      });
    }
    if (window.audioManager) {
      window.audioManager.playOpenChime?.();
    }
  }
}

window.gardenJourney = new GardenJourney();
