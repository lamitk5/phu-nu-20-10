/**
 * Module Âm thanh (Audio Engine):
 * - Tự động phát nhạc nền phong cách Hộp nhạc (Music Box) / Piano du dương bằng Web Audio API
 * - Không lo lỗi link MP3 chết hoặc không có mạng
 * - Hỗ trợ phát cả file MP3 tùy chọn nếu người dùng dán link
 * - Tích hợp hiệu ứng âm thanh (SFX): Tiếng mở thiệp bí mật, tiếng nổ bong bóng lời chúc
 */

class RomanticAudioManager {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.synthInterval = null;
    this.bgAudioEl = document.getElementById('bgAudio');
    this.toggleBtn = document.getElementById('musicToggleBtn');
    
    // Giai điệu lãng mạn nhẹ nhàng (Nốt nhạc tần số Hz: C4 - G3 - A3 - E3 - F3 - C3 - F3 - G3)
    this.notes = [
      261.63, 329.63, 392.00, 523.25, // C - E - G - C
      196.00, 293.66, 392.00, 493.88, // G - D - G - B
      220.00, 261.63, 329.63, 440.00, // A - C - E - A
      164.81, 246.94, 329.63, 392.00, // E - B - E - G
      174.61, 261.63, 349.23, 440.00, // F - C - F - A
      261.63, 329.63, 392.00, 523.25, // C - E - G - C
      174.61, 220.00, 349.23, 440.00, // F - A - F - A
      196.00, 246.94, 293.66, 392.00  // G - B - D - G
    ];
    this.noteIndex = 0;
  }

  // Khởi tạo AudioContext khi có tương tác người dùng
  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Tạo nốt nhạc hộp nhạc ngọt ngào với màng lọc và độ ngân chuông (Decay)
  playMusicBoxNote(freq) {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    // Dùng sóng Sine kết hợp Triangle tạo âm sắc ấm áp như phím đàn Kalimba / Music Box
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Bộ lọc Lowpass làm mềm âm thanh, không bị chói tai
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);

    // Envelope âm lượng: bật nhẹ và ngân dài 1.5 giây
    gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.6);
  }

  // Bắt đầu chuỗi giai điệu du dương
  startMelody() {
    this.initAudioContext();
    this.isPlaying = true;
    this.toggleBtn?.classList.add('playing');

    if (this.synthInterval) clearInterval(this.synthInterval);
    
    // Mỗi 380ms gảy một phím nốt
    this.synthInterval = setInterval(() => {
      const freq = this.notes[this.noteIndex];
      this.playMusicBoxNote(freq);
      this.noteIndex = (this.noteIndex + 1) % this.notes.length;
    }, 420);
  }

  // Dừng phát nhạc
  stopMelody() {
    this.isPlaying = false;
    this.toggleBtn?.classList.remove('playing');
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.bgAudioEl && !this.bgAudioEl.paused) {
      this.bgAudioEl.pause();
    }
  }

  // Bật / Tắt luân phiên
  toggle() {
    if (this.isPlaying) {
      this.stopMelody();
    } else {
      this.startMelody();
    }
  }

  // Âm thanh khi mở thiệp thần kỳ (Magic Chime)
  playOpenChime() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq);
      }, idx * 100);
    });
  }

  // Âm thanh pháo nhỏ hoặc bong bóng nổ (Pop SFX)
  playPopSound() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }
}

// Khởi tạo instance toàn cục
window.audioManager = new RomanticAudioManager();
