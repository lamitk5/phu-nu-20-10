/**
 * ============================================================================
 * WEBSITE QUÀ TẶNG 20/10 - MULTI-SCENE INTERACTIVE 3D WEB EXPERIENCE
 * 6 Phân cảnh tương tác chuẩn kịch bản:
 * Scene 1: Vũ trụ & Hoa hồng nở tràn màn hình (Rose Bloom)
 * Scene 2: Thiệp Lịch Tháng 10 & Trái Tim Ghép Ảnh (Photo Mosaic Heart)
 * Scene 3: Không gian 3D Bông Hoa Ánh Sáng & Cơn Mưa Lời Chúc (3D Galaxy Wishes)
 * Scene 4: Quả Cầu Ảnh 3D & Tường Lưới Ảnh Biến Hình (Photo Sphere -> Grid Wall)
 * Scene 5: Phong Bì Thư Tình Yêu (Animated 3D Envelope)
 * Scene 6: Bức Thư Tay Chạy Chữ (Typewriter Love Letter)
 * ============================================================================
 */

/* ============================================================================
 * CẤU HÌNH CONFIG CHÍNH: DỄ DÀNG TÙY BIẾN ẢNH, LỜI CHÚC, THƯ VÀ NHẠC NỀN
 * ============================================================================ */
// Khai báo chính xác danh sách 10 ảnh thực tế trong thư mục images/
const PHOTO_LIST = [
  'images/1.jpg',
  'images/2.jpg',
  'images/3.jpg',
  'images/4.jpg',
  'images/5.jpg',
  'images/6.jpg',
  'images/7.jpg',
  'images/8.jpg',
  'images/9.jpg',
  'images/10.jpg'
];

console.log("Đang load ảnh:", PHOTO_LIST);

const DEFAULT_PHOTOS = PHOTO_LIST.slice();

const CONFIG = {
  // 5 file ảnh hoa hồng tách nền PNG chân thực trong thư mục picture
  roseImages: [
    "picture/rose1.png",
    "picture/rose2.png",
    "picture/rose3.png",
    "picture/rose4.png",
    "picture/rose5.png"
  ],

  // Danh sách ảnh kỷ niệm đang dùng (mặc định lấy từ DEFAULT_PHOTOS, có thể ghi đè bởi ảnh tải lên)
  photos: DEFAULT_PHOTOS.slice(),

  // Danh sách các câu chúc 20/10 ngọt ngào
  wishes: [
    "Chúc mi 20/10 luôn xinh đẹp và rạng ngời! 🌸",
    "Mong mi luôn vui vẻ, hạnh phúc và bình yên",
    "Cảm ơn m đã giúp t bớt bơ vơ trong khoảng thời gian t khó khăn nhất",
    "Cảm ơn mi rất nhiều 💖",
    "Chúc bông hoa xinh đẹp nhất luôn tỏa ngát hương thơm 🌹",
    "Chúc cho lúc nào cũng nở những nụ cười rạng rỡ he 🌺",
    "Chúc mọi ước mơ ngọt ngào của mi đều trở thành hiện thực ⭐",
    "Hãy luôn tự tin, kiêu hãnh và rạng rỡ như ánh dương nhé ☀️"
  ],

  // Nội dung bức thư tay gõ chữ (Scene 6)
  letterContent: `Hôm nay là ngày 20/10 - ngày dành riêng cho những người phụ nữ tuyệt vời nhất, luôn tỏa sáng và dịu dàng. Cảm ơn mi vì dù mn có quay lưng vs t thì mi vẫn ở đây, vẫn tin tưởng t và lắng nghe t.

Chúc mi một ngày 20/10 ngập tràn hạnh phúc, luôn giữ trọn nụ cười rạng rỡ trên môi và đạt được mọi điều mà m hằng ấp ủ. Dù cuộc sống có bận rộn đến đâu, hãy luôn nhớ rằng t vẫn luôn ở đây,có thể không mang danh ny nhưng vẫn luôn lắng nghe và đồng hành cùng m qua mọi chặng đường.

CHúc mi 20/10 luon rực rỡ nhé! ❤️`,

  // Link nhạc nền MP3 (Tự động phát bài hát ngọt ngào kết hợp bộ tổng hợp Music Box)
  musicUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Keshco/Filament_Flotsam/Keshco_-_04_-_Warm_Heart.mp3"
};

/* ============================================================================
 * TRÌNH QUẢN LÝ ÂM THANH HYBRID (WEB AUDIO SYNTH + MP3 FALLBACK)
 * ============================================================================ */
class RomanticAudioManager {
  constructor() {
    this.audioEl = document.getElementById("bgAudio");
    this.toggleBtn = document.getElementById("audioToggleBtn");
    this.audioCtx = null;
    this.synthTimer = null;
    this.isPlaying = false;
    this.noteIdx = 0;

    // Giai điệu Canon In D nhẹ nhàng bằng Web Audio API
    this.melody = [
      261.63, 392.00, 440.00, 329.63, 349.23, 261.63, 349.23, 392.00,
      523.25, 392.00, 440.00, 329.63, 349.23, 261.63, 349.23, 392.00
    ];

    if (this.audioEl && CONFIG.musicUrl) {
      this.audioEl.src = CONFIG.musicUrl;
      this.audioEl.volume = 0.65;
    }

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playKalimbaNote(freq) {
    if (!this.audioCtx || this.audioCtx.state === "suspended") return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  startSynth() {
    if (this.synthTimer) return;
    this.synthTimer = setInterval(() => {
      if (this.isPlaying) {
        const freq = this.melody[this.noteIdx % this.melody.length];
        this.playKalimbaNote(freq);
        this.noteIdx++;
      }
    }, 450);
  }

  play() {
    this.initContext();
    this.isPlaying = true;

    if (this.audioEl) {
      this.audioEl.play().catch(() => {
        // Nếu phát MP3 lỗi do mạng/CORS, tự động phát synth Kalimba
        this.startSynth();
      });
    } else {
      this.startSynth();
    }

    if (this.toggleBtn) {
      this.toggleBtn.classList.add("playing");
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.audioEl) this.audioEl.pause();
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.toggleBtn) {
      this.toggleBtn.classList.remove("playing");
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

/* ============================================================================
 * BACKGROUND STARFIELD CANVAS (VŨ TRỤ SAO BĂNG LẤP LÁNH - TỐI ƯU MOBILE)
 * ============================================================================ */
class StarfieldEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.stars = [];
    this.isMobile = window.innerWidth <= 768;
    this.numStars = this.isMobile ? 40 : 120;
    this.isRunning = true;
    this.animId = null;

    this.resize();
    this.initStars();
    window.addEventListener("resize", () => this.resize());
    this.animate();
  }

  resize() {
    this.isMobile = window.innerWidth <= 768;
    this.numStars = this.isMobile ? 40 : 120;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    if (this.stars.length !== this.numStars) {
      this.initStars();
    }
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.3 ? "#ffccd5" : "#ffffff"
      });
    }
  }

  pause() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;
    this.animId = requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.width, this.height);
    const hasShadow = !this.isMobile;

    for (let s of this.stars) {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      if (hasShadow) {
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = s.color;
      } else {
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
}

/* ============================================================================
 * SCENE 1: CANVAS 2D FLOWER ENGINE (HIGH PERFORMANCE 60FPS ROSE EXPLOSION)
 * ============================================================================ */
class CanvasFlowerEngine {
  constructor(canvasId, onFullCoverage) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.onFullCoverage = onFullCoverage;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = window.innerWidth <= 768;
    // Mobile: pixel ratio cố định 1 để tiết kiệm GPU
    this.dpr = this.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    this.offscreenImages = [];
    this.imagesLoaded = false;

    this.bouquetRoses = [];
    this.explosionRoses = [];
    this.state = "idle"; // "idle" | "exploding" | "fading" | "hidden"
    this.startTime = 0;
    this.fadeStartTime = 0;
    this.fadeDuration = 1150;
    this.animId = null;

    // Frame-throttle: mobile giới hạn ~30 FPS để tiết kiệm GPU
    this._lastFrameTime = 0;
    this._frameBudget = this.isMobile ? 32 : 16; // ms per frame (30fps / 60fps)

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.initCanvas();
    this.preloadImages();
    window.addEventListener("resize", this.handleResize);
  }

  initCanvas() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    this._frameBudget = this.isMobile ? 32 : 16;
    this.initCanvas();
    if (this.state === "idle") {
      this.initBouquet();
    }
  }

  // Preload ảnh hoa: GIỮ NGUYÊN 100% CÁNH HOA TỰ NHIÊN - TUYỆT ĐỐI KHÔNG CẮT TRÒN
  preloadImages() {
    const list = CONFIG.roseImages;
    let loadedCount = 0;

    list.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return;

        // Mobile: 200px offscreen đủ cho hiển thị 150px-260px, tiết kiệm VRAM 4x so với 400px
        const size = this.isMobile ? 200 : 320;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = size;
        offCanvas.height = size;
        // willReadFrequently: false vì chúng ta chỉ vẽ không đọc — tối ưu GPU raster path
        const offCtx = offCanvas.getContext("2d", { willReadFrequently: false });

        // Đồng bộ tone màu ấm áp tươi tắn
        if ("filter" in offCtx) {
          offCtx.filter = "brightness(1.05) saturate(1.1)";
        }

        // object-fit: contain giữ chuẩn tỷ lệ cánh hoa gốc, không méo hình
        const pad = this.isMobile ? 6 : 10;
        const maxDraw = size - pad * 2;
        const aspect = img.naturalWidth / img.naturalHeight;
        let dw, dh;
        if (aspect >= 1) {
          dw = maxDraw;
          dh = maxDraw / aspect;
        } else {
          dh = maxDraw;
          dw = maxDraw * aspect;
        }
        const dx = (size - dw) / 2;
        const dy = (size - dh) / 2;

        // Đổ bóng nhẹ - KHÔNG clip tròn, KHÔNG lẹm cánh
        offCtx.shadowColor = "rgba(0, 0, 0, 0.12)";
        offCtx.shadowBlur = this.isMobile ? 6 : 10;
        offCtx.shadowOffsetY = 3;
        offCtx.drawImage(img, dx, dy, dw, dh);

        this.offscreenImages[idx] = offCanvas;
        loadedCount++;
        if (loadedCount === list.length) {
          this.imagesLoaded = true;
          this.startLoop();
        }
      };
      img.onerror = () => {
        console.warn(`[CanvasFlowerEngine] Không tải được ảnh hoa: ${src}`);
        loadedCount++;
        if (loadedCount === list.length) {
          this.imagesLoaded = true;
          this.startLoop();
        }
      };
    });
  }

  // 1. Trạng thái ban đầu: Cụm hoa trung tâm tự nhiên, cánh hoa đầy đặn
  initBouquet() {
    this.bouquetRoses = [];
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Mobile: giảm số bông bouquet từ 18 xuống 8 để giảm drawImage mỗi frame
    const rings = this.isMobile
      ? [{ count: 2, maxR: 0 }, { count: 3, maxR: 40 }, { count: 3, maxR: 70 }]
      : [{ count: 4, maxR: 0 }, { count: 6, maxR: 60 }, { count: 8, maxR: 100 }];

    rings.forEach(({ count, maxR }) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const r = Math.random() * maxR;
        const size = this.isMobile ? 130 + Math.random() * 30 : 155 + Math.random() * 30;
        this.bouquetRoses.push({
          imgIdx: Math.floor(Math.random() * this.offscreenImages.length),
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          size,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.003
        });
      }
    });
  }

  // 2. MẬT ĐỘ VÀ KÍCH THƯỚC PHỦ KÍN 100% MÀN HÌNH
  initExplosion() {
    this.explosionRoses = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxR = Math.hypot(cx, cy) * 1.08;

    const desktopRings = [
      { count: 1,  rFrac: 0.00 },
      { count: 6,  rFrac: 0.09 },
      { count: 11, rFrac: 0.18 },
      { count: 16, rFrac: 0.28 },
      { count: 21, rFrac: 0.39 },
      { count: 26, rFrac: 0.51 },
      { count: 30, rFrac: 0.64 },
      { count: 32, rFrac: 0.77 },
      { count: 32, rFrac: 0.90 },
      { count: 25, rFrac: 1.04 }
    ];

    // Mobile: giảm từ 96 xuống còn 62 bông — đủ phủ kín, tăng đáng kể FPS
    const mobileRings = [
      { count: 1,  rFrac: 0.00 },
      { count: 4,  rFrac: 0.14 },
      { count: 8,  rFrac: 0.28 },
      { count: 12, rFrac: 0.44 },
      { count: 15, rFrac: 0.62 },
      { count: 13, rFrac: 0.82 },
      { count: 9,  rFrac: 1.02 }
    ];

    const rings = this.isMobile ? mobileRings : desktopRings;
    const totalRings = rings.length;

    // Mobile: nở nhanh hơn trong 2s (cũ 2350ms) để người dùng không thấy lag delay
    const totalBloomMs = this.isMobile ? 1900 : 2350;

    rings.forEach((ring, ringIdx) => {
      const ringOffsetAngle = Math.random() * Math.PI * 2;
      const ringDelay = (ringIdx / (totalRings - 1)) * totalBloomMs;

      for (let j = 0; j < ring.count; j++) {
        const angle = ring.count === 1
          ? 0
          : (j / ring.count) * Math.PI * 2 + ringOffsetAngle + (Math.random() - 0.5) * (Math.PI / ring.count);

        const r = ring.rFrac === 0
          ? 0
          : ring.rFrac * maxR + (Math.random() - 0.5) * (this.isMobile ? 12 : 20);

        const targetX = cx + Math.cos(angle) * r;
        const targetY = cy + Math.sin(angle) * r;

        // Mobile: kích thước 150px-240px (giảm từ 260px) để vẽ nhanh hơn
        const size = this.isMobile
          ? Math.floor(150 + Math.random() * 90)
          : Math.floor(180 + Math.random() * 180);

        const rot = Math.random() * Math.PI * 2;
        // Mobile: rút thời gian mỗi bông nở từ 850-1000ms xuống 620-780ms
        const duration = this.isMobile
          ? 600 + Math.random() * 150
          : 850 + Math.random() * 150;

        // Jitter delay nhỏ hơn trên mobile để các vòng nở nhanh liền mạch
        const flowerDelay = Math.max(0, ringDelay + (Math.random() - 0.5) * (this.isMobile ? 80 : 140));

        this.explosionRoses.push({
          imgIdx: Math.floor(Math.random() * this.offscreenImages.length),
          x: targetX,
          y: targetY,
          targetSize: size,
          rot,
          // Lưu sẵn rotSpeed nhân sẵn 0.04 để tránh nhân lại mỗi frame
          rotRate: (Math.random() - 0.5) * 0.003 * 0.04,
          delay: flowerDelay,
          duration
        });
      }
    });
  }

  startExplosion() {
    if (this.state === "exploding" || this.state === "fading") return;
    this.state = "exploding";
    this.startTime = performance.now();
    this.initBouquet();
    this.initExplosion();
    this.startLoop();

    // Mobile nở nhanh hơn: onFullCoverage sau 2.4s (cũ 3.5s)
    const coverageDelay = this.isMobile ? 2400 : 3500;
    setTimeout(() => {
      if (this.onFullCoverage) this.onFullCoverage();
    }, coverageDelay);
  }

  // 3. Tan biến sang Scene 2: Mờ dần (opacity -> 0) và phóng to nhẹ trong 1.15s, sau đó dọn dẹp canvas
  fadeOutToScene2(callback) {
    if (this.state === "fading" || this.state === "hidden") return;
    this.state = "fading";
    this.fadeStartTime = performance.now();

    setTimeout(() => {
      this.state = "hidden";
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.canvas) {
        this.canvas.style.display = "none";
      }
      if (callback) callback();
    }, this.fadeDuration);
  }

  reset() {
    this.state = "idle";
    this._lastFrameTime = 0;
    if (this.canvas) {
      this.canvas.style.display = "block";
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    this.bouquetRoses = [];
    this.explosionRoses = [];
    this.startLoop();
  }

  startLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.state !== "hidden") {
      this.animId = requestAnimationFrame(this.animate);
    }
  }

  animate(now) {
    if (this.state === "hidden") return;

    // Luôn schedule RAF một lần duy nhất ở đây - tránh nhân đôi vòng lặp
    this.animId = requestAnimationFrame(this.animate);

    // Frame throttle: skip render nếu chưa đủ thời gian (mobile ~30fps), RAF vẫn tiếp tục bình thường
    if (now - this._lastFrameTime < this._frameBudget) {
      return;
    }
    this._lastFrameTime = now;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.state === "idle") {
      // Hoàn toàn KHÔNG hiển thị hoa trước khi chạm để giữ sự bất ngờ
      return;
    } else if (this.state === "exploding") {
      const elapsed = now - this.startTime;

      // Cụm hoa ban đầu tại tâm hòa quyện cùng lớp hoa nở
      for (const r of this.bouquetRoses) {
        const off = this.offscreenImages[r.imgIdx];
        if (!off) continue;
        r.rot += r.rotSpeed;
        this.ctx.save();
        this.ctx.translate(r.x, r.y);
        this.ctx.rotate(r.rot);
        this.ctx.drawImage(off, -r.size / 2, -r.size / 2, r.size, r.size);
        this.ctx.restore();
      }

      // Vẽ các vòng hoa đồng tâm nở dần từ trong ra ngoài
      for (const r of this.explosionRoses) {
        if (elapsed < r.delay) continue;
        const progress = Math.min(1, (elapsed - r.delay) / r.duration);

        // Easing cubic-bezier(0.25, 1, 0.5, 1) phóng to nảy nhẹ
        const c1 = 1.15;
        const c3 = c1 + 1;
        const scale = progress >= 1 ? 1 : Math.max(0, 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2));
        const curSize = r.targetSize * scale;
        if (curSize <= 0) continue;

        // rotRate đã nhân sẵn 0.04 để tránh phép nhân mỗi frame
        const curRot = r.rot + r.rotRate * elapsed;
        const off = this.offscreenImages[r.imgIdx];
        if (!off) continue;

        this.ctx.save();
        this.ctx.translate(r.x, r.y);
        this.ctx.rotate(curRot);
        this.ctx.drawImage(off, -curSize / 2, -curSize / 2, curSize, curSize);
        this.ctx.restore();
      }
    } else if (this.state === "fading") {
      const fadeProgress = Math.min(1, (now - this.fadeStartTime) / this.fadeDuration);
      const alpha = Math.max(0, 1 - fadeProgress);
      const expandScale = 1 + fadeProgress * 0.2;

      this.ctx.globalAlpha = alpha;

      for (const r of this.bouquetRoses) {
        const off = this.offscreenImages[r.imgIdx];
        if (!off) continue;
        const curSize = r.size * expandScale;
        this.ctx.save();
        this.ctx.translate(r.x, r.y);
        this.ctx.rotate(r.rot);
        this.ctx.drawImage(off, -curSize / 2, -curSize / 2, curSize, curSize);
        this.ctx.restore();
      }

      for (const r of this.explosionRoses) {
        const off = this.offscreenImages[r.imgIdx];
        if (!off) continue;
        const curSize = r.targetSize * expandScale;
        this.ctx.save();
        this.ctx.translate(r.x, r.y);
        // rotRate đã nhân sẵn 0.04
        this.ctx.rotate(r.rot + r.rotRate * now);
        this.ctx.drawImage(off, -curSize / 2, -curSize / 2, curSize, curSize);
        this.ctx.restore();
      }

      this.ctx.globalAlpha = 1;
    }
  }
}



/* ============================================================================
 * SCENE 2: THIỆP LỊCH THÁNG 10 & MẢNH GHÉP ẢNH TẠO HÌNH SỐ "20/10"
 * ============================================================================ */
class Photo2010MosaicManager {
  constructor() {
    this.stage = document.getElementById("mosaic2010Container");
    this.swayingGarden = document.getElementById("swayingGarden");
    this.calendarDaysBody = document.getElementById("calendarDaysBody");
    this.tiles = [];
    this.isAssembled = false;

    this.initCalendar();
    this.initGardenFlowers();
    this.computeMatrixPoints();
    this.createTiles();
    this.updateResponsiveScale();

    window.addEventListener("resize", () => this.updateResponsiveScale());
  }

  updateResponsiveScale() {
    if (!this.stage || !this.stage.parentElement) return;
    const parentWidth = this.stage.parentElement.clientWidth;
    // Bề rộng chuẩn của khối 20/10 đã gom gọn gàng là 486px
    // Đảm bảo cách lề trái và lề phải ít nhất 24px - 30px trên mọi thiết bị
    const maxAvailableWidth = Math.max(220, parentWidth - 52);
    const baseWidth = 486;
    const scale = Math.min(1.0, maxAvailableWidth / baseWidth);

    this.stage.style.setProperty("--mosaic-scale", scale);
    this.stage.style.transform = `scale(${scale})`;
    this.stage.style.transformOrigin = "center center";

    // Đồng bộ chiều cao cho container cha để gom gọn gàng không chiếm diện tích thừa
    const stageWrapper = this.stage.parentElement;
    if (stageWrapper) {
      stageWrapper.style.height = `${Math.round(142 * scale + 8)}px`;
    }
  }

  initCalendar() {
    if (!this.calendarDaysBody) return;
    // Tháng 10/2025: Ngày 1/10 rơi vào Thứ Tư (Wed -> col index 3)
    let html = "";
    let day = 1;
    for (let row = 0; row < 5; row++) {
      html += "<tr>";
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < 3) {
          html += "<td></td>";
        } else if (day <= 31) {
          const is20 = day === 20;
          html += `<td>
            <span class="calendar-day-cell ${is20 ? "day-20" : ""}">
              ${day}
            </span>
          </td>`;
          day++;
        } else {
          html += "<td></td>";
        }
      }
      html += "</tr>";
    }
    this.calendarDaysBody.innerHTML = html;
  }

  initGardenFlowers() {
    if (!this.swayingGarden) return;
    const colors = ["#ff4d79", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#fb7185"];
    let html = "";
    for (let i = 0; i < 20; i++) {
      const color = colors[i % colors.length];
      const h = Math.floor(Math.random() * 12 + 16);
      html += `
        <svg class="garden-flower-stem" width="16" height="${h + 8}" viewBox="0 0 16 30" fill="none">
          <line x1="8" y1="30" x2="8" y2="10" stroke="#10b981" stroke-width="2"/>
          <circle cx="8" cy="8" r="6" fill="${color}"/>
          <circle cx="8" cy="8" r="2.5" fill="#fff"/>
        </svg>
      `;
    }
    this.swayingGarden.innerHTML = html;
  }

  // Định nghĩa ma trận tọa độ (Dot Matrix Coordinates) thu nhỏ cân đối, gap đều tuyệt đối 24.4px giữa 5 ký tự: '2', '0', '/', '1', '0'
  computeMatrixPoints() {
    // Số '2': 11 ô ảnh (cột 0 -> 2)
    const dots2 = [
      [0, 0], [1, 0], [2, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
      [0, 3],
      [0, 4], [1, 4], [2, 4]
    ];

    // Số '0' thứ nhất: 11 ô ảnh (cột 3.8 -> 5.8) - Cách số '2' đúng 24.4px
    const dots0_1 = [
      [3.8, 0], [4.8, 0], [5.8, 0],
      [3.8, 1],           [5.8, 1],
      [3.8, 2],           [5.8, 2],
      [3.8, 3],           [5.8, 3],
      [3.8, 4], [4.8, 4], [5.8, 4]
    ];

    // Dấu '/': 5 ô ảnh (cột 7.6 -> 9.6) - Cách số '0' đúng 24.4px
    const dotsSlash = [
      [9.6, 0],
      [9.1, 1],
      [8.6, 2],
      [8.1, 3],
      [7.6, 4]
    ];

    // Số '1': 8 ô ảnh (cột 10.9 -> 12.5) - Cách dấu '/' đúng 24.4px
    const dots1 = [
      [10.9, 1],
      [11.7, 0], [11.7, 1], [11.7, 2], [11.7, 3], [11.7, 4],
      [10.9, 4], [12.5, 4]
    ];

    // Số '0' thứ hai: 11 ô ảnh (cột 14.3 -> 16.3) - Cách số '1' đúng 24.4px
    const dots0_2 = [
      [14.3, 0], [15.3, 0], [16.3, 0],
      [14.3, 1],            [16.3, 1],
      [14.3, 2],            [16.3, 2],
      [14.3, 3],            [16.3, 3],
      [14.3, 4], [15.3, 4], [16.3, 4]
    ];

    this.matrixPoints = [...dots2, ...dots0_1, ...dotsSlash, ...dots1, ...dots0_2];
  }

  createTiles() {
    if (!this.stage) return;
    this.stage.innerHTML = "";
    this.tiles = [];

    const stepX = 28;
    const stepY = 28;
    const startX = 2;
    const startY = 2;

    this.matrixPoints.forEach((pt, idx) => {
      const tile = document.createElement("div");
      tile.className = "mosaic-2010-tile";

      const photoUrl = CONFIG.photos[idx % CONFIG.photos.length];
      tile.style.backgroundImage = `url('${photoUrl}')`;

      const targetX = startX + pt[0] * stepX;
      const targetY = startY + pt[1] * stepY;

      // Vị trí bay lơ lửng ban đầu ngẫu nhiên từ các hướng
      const rx = (Math.random() - 0.5) * 360;
      const ry = (Math.random() - 0.5) * 260;
      const rRot = (Math.random() - 0.5) * 100;

      tile.style.left = `${targetX}px`;
      tile.style.top = `${targetY}px`;
      tile.style.transform = `translate(${rx}px, ${ry}px) rotate(${rRot}deg) scale(0.5)`;
      tile.style.opacity = "0.6";

      tile.dataset.targetX = targetX;
      tile.dataset.targetY = targetY;

      this.stage.appendChild(tile);
      this.tiles.push(tile);
    });
  }

  assemble2010(callback) {
    if (this.isAssembled) return;
    this.isAssembled = true;

    this.tiles.forEach((tile, idx) => {
      gsap.to(tile, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1.15,
        delay: idx * 0.02,
        ease: "back.out(1.4)"
      });
    });

    const tooltip = document.getElementById("mosaicTooltipText");
    if (tooltip) tooltip.textContent = "✨ Kỷ niệm ngọt ngào 20/10 đong đầy! 💖";

    // Đợi các mảnh ghép bay vào vị trí (~2.05s) + 3.2s chiêm ngưỡng chữ 20/10 rồi gọi callback
    const totalDuration = (1.15 + this.tiles.length * 0.02 + 3.2) * 1000;
    setTimeout(() => {
      if (callback) callback();
    }, totalDuration);
  }

  resetTiles() {
    this.isAssembled = false;
    this.tiles.forEach((tile) => {
      const rx = (Math.random() - 0.5) * 360;
      const ry = (Math.random() - 0.5) * 260;
      const rRot = (Math.random() - 0.5) * 100;
      gsap.killTweensOf(tile);
      gsap.set(tile, {
        x: rx,
        y: ry,
        rotation: rRot,
        scale: 0.5,
        opacity: 0.6
      });
    });
  }

  updatePhotos(newPhotos) {
    this.tiles.forEach((tile, idx) => {
      const url = newPhotos[idx % newPhotos.length];
      tile.style.backgroundImage = `url('${url}')`;
    });
  }
}

/* ============================================================================
 * SCENE 3 & 4: THREE.JS 3D ENGINE (BÔNG HOA ÁNH SÁNG & QUẢ CẦU ẢNH BIẾN HÌNH)
 * ============================================================================ */
class ThreeSceneManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isMobile = window.innerWidth <= 768;
    this.isRendering = false;
    this.animId = null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Nhóm 3D phân cảnh
    this.flowerGroup = new THREE.Group();
    this.wishesGroup = new THREE.Group();
    this.photoSphereGroup = new THREE.Group();

    this.cards = [];
    this.floatingPhotoMeshes = [];
    this.isGridMode = false;
    this.activeSceneMode = 3; // 3 hoặc 4

    try {
      this.initThree();
      this.createParticleFlower();
      this.createFloatingWishes();
      this.createPhotoSphere();

      window.addEventListener("resize", () => this.onWindowResize());
      console.log(`[ThreeSceneManager] Khởi tạo thành công Scene 3 & 4 (Mobile: ${this.isMobile})`);
    } catch (err) {
      console.error("[ThreeSceneManager] Lỗi khởi tạo Three.js Scene 3:", err);
    }
  }

  initThree() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0614, 0.0004);

    this.camera = new THREE.PerspectiveCamera(60, w / h, 1, 2500);
    this.camera.position.set(0, 0, 540);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    // Mobile đặt pixelRatio = 1 để tiết kiệm GPU; Desktop tối đa 2
    this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls hỗ trợ xoay 360 độ và zoom, khóa pan để vuốt mượt trên mobile
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = this.isMobile ? 0.75 : 1.0;
    this.controls.maxDistance = 1200;
    this.controls.minDistance = 100;
    if (THREE.TOUCH) {
      this.controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    }

    // Ánh sáng môi trường
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffa4b8, 1.2);
    dirLight.position.set(100, 200, 150);
    this.scene.add(dirLight);

    this.scene.add(this.flowerGroup);
    this.scene.add(this.wishesGroup);
    this.scene.add(this.photoSphereGroup);

    // Bắt sự kiện click để morph sphere -> grid
    this.renderer.domElement.addEventListener("click", () => {
      if (this.activeSceneMode === 4) {
        this.toggleMorph();
      }
    });
  }

  // Tạo canvas texture mềm dạng hạt bụi sáng phát quang (Glow Particle Texture)
  createGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    // Radial gradient: Tâm trắng sáng -> hồng pastel -> trong suốt ở rìa
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.0, "#ffffff");
    grad.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.45, "rgba(255, 105, 180, 0.8)");
    grad.addColorStop(0.75, "rgba(225, 29, 72, 0.28)");
    grad.addColorStop(1.0, "rgba(255, 105, 180, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Tạo đĩa thiên hà và bông hoa ánh sáng 3D đa tầng cánh (Tự động thích ứng Mobile / Desktop)
  createParticleFlower() {
    const glowTex = this.createGlowTexture();

    // 1. ĐĨA THIÊN HÀ XOAY TRÒN DƯỚI ĐẾ (Galaxy Disc): Mobile 400 hạt, Desktop 800 hạt
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyCount = this.isMobile ? 400 : 800;
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);

    const cPurple = new THREE.Color(0x8a2be2);
    const cPink = new THREE.Color(0xff4d79);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < galaxyCount; i++) {
      const arm = i % 3;
      const armOffset = (arm * Math.PI * 2) / 3;
      const frac = Math.pow(Math.random(), 0.7);
      const dist = 35 + frac * (this.isMobile ? 140 : 175);
      const spiralAngle = armOffset + dist * 0.045 + (Math.random() - 0.5) * 0.35;

      const gx = Math.cos(spiralAngle) * dist;
      const gy = -72 + (Math.random() - 0.5) * 12;
      const gz = Math.sin(spiralAngle) * dist;

      galaxyPositions[i * 3] = gx;
      galaxyPositions[i * 3 + 1] = gy;
      galaxyPositions[i * 3 + 2] = gz;

      const mix = Math.random();
      const col = mix < 0.5 ? cPurple.clone().lerp(cPink, mix * 2) : cPink.clone().lerp(cWhite, (mix - 0.5) * 2);
      galaxyColors[i * 3] = col.r;
      galaxyColors[i * 3 + 1] = col.g;
      galaxyColors[i * 3 + 2] = col.b;
    }

    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: this.isMobile ? 3.5 : 4.2,
      map: glowTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85
    });

    this.galaxyDiscMesh = new THREE.Points(galaxyGeo, galaxyMat);
    this.flowerGroup.add(this.galaxyDiscMesh);

    // 2. BÔNG HOA HỒNG 3D PHÁT SÁNG (Mobile 2.200 hạt, Desktop 4.000 hạt - ROSE PETAL SURFACE EQUATION 60 FPS)
    const flowerGeo = new THREE.BufferGeometry();
    const totalFlowerParticles = this.isMobile ? 2200 : 4000;
    const positions = new Float32Array(totalFlowerParticles * 3);
    const colors = new Float32Array(totalFlowerParticles * 3);

    // Bảng màu các tầng cánh hoa hồng
    const cStamenGold = new THREE.Color(0xfef08a); // Vàng kem tâm nhụy
    const cStamenCream = new THREE.Color(0xfff0f5); // Trắng hồng rực sáng
    const cRuby = new THREE.Color(0xe11d48); // Đỏ nhung
    const cDeepRose = new THREE.Color(0xff1493); // Hồng đậm
    const cPeachPink = new THREE.Color(0xff4d79); // Hồng đào tươi
    const cSoftPink = new THREE.Color(0xffb6c1); // Hồng phấn mềm
    const cBlushMisty = new THREE.Color(0xffe4e1); // Trắng hồng phấn mép cánh
    const cGalaxyViolet = new THREE.Color(0x8a2be2); // Tím đế ngân hà

    // Phân tầng tỷ lệ hạt linh hoạt theo cấu hình thiết bị
    const t1 = Math.floor(totalFlowerParticles * 0.175);
    const t2 = Math.floor(totalFlowerParticles * 0.35);
    const t3 = Math.floor(totalFlowerParticles * 0.575);
    const t4 = Math.floor(totalFlowerParticles * 0.875);

    for (let i = 0; i < totalFlowerParticles; i++) {
      let x = 0, y = 0, z = 0;
      let col = cDeepRose.clone();

      if (i < t1) {
        // TẦNG 1: TÂM NHỤY HOA XOẮN ỐC (Core Swirl)
        const t = i / t1;
        const theta = i * 2.39996323; // Golden angle spiral
        const r = Math.pow(t, 0.6) * 22;
        y = 12 + (1 - Math.pow(t, 0.8)) * 32 + (Math.random() - 0.5) * 3;
        x = Math.cos(theta) * r;
        z = Math.sin(theta) * r;

        const mix = Math.random();
        col = mix < 0.4 ? cStamenGold.clone().lerp(cStamenCream, mix * 2.5) : cStamenCream.clone().lerp(cWhite, (mix - 0.4) * 1.6);
      } else if (i < t2) {
        // TẦNG 2: CÁNH HOA CUỘN XOẮN TRONG
        const phi = Math.random() * Math.PI * 2;
        const u = Math.random();
        const petalShape = Math.pow(Math.abs(Math.sin(1.5 * phi)), 1.2);
        const r = 12 + u * (25 + 18 * petalShape);
        y = 16 + 28 * Math.sin(u * Math.PI * 0.85) - Math.pow(u, 1.8) * 12 + (Math.random() - 0.5) * 4;
        x = Math.cos(phi) * r;
        z = Math.sin(phi) * r;

        col = cRuby.clone().lerp(cDeepRose, Math.random());
      } else if (i < t3) {
        // TẦNG 3: CÁNH HOA GIỮA
        const phi = Math.random() * Math.PI * 2;
        const u = Math.random();
        const petalShape = Math.pow(Math.abs(Math.sin(2.5 * phi + 0.4)), 1.3);
        const r = 25 + u * (42 + 28 * petalShape);
        y = 8 + 24 * Math.sin(u * Math.PI * 0.75) - Math.pow(u, 1.6) * 16 + Math.sin(5 * phi) * 4 * u + (Math.random() - 0.5) * 5;
        x = Math.cos(phi) * r;
        z = Math.sin(phi) * r;

        col = cDeepRose.clone().lerp(cPeachPink, Math.random());
      } else if (i < t4) {
        // TẦNG 4: CÁNH HOA NGOÀI CÙNG
        const phi = Math.random() * Math.PI * 2;
        const u = Math.random();
        const petalShape = Math.pow(Math.abs(Math.sin(3.5 * phi + 0.9)), 1.4);
        const r = 45 + u * (55 + 35 * petalShape);
        y = -5 + 18 * Math.sin(u * Math.PI * 0.6) - Math.pow(u, 2) * 26 + Math.cos(7 * phi) * 6 * Math.pow(u, 1.5) + (Math.random() - 0.5) * 6;
        x = Math.cos(phi) * r;
        z = Math.sin(phi) * r;

        const edgeMix = Math.random();
        col = edgeMix < 0.5 ? cPeachPink.clone().lerp(cSoftPink, edgeMix * 2) : cSoftPink.clone().lerp(cBlushMisty, (edgeMix - 0.5) * 2);
      } else {
        // TẦNG 5: ĐÀI HOA & CHÂN ĐẾ
        const u = Math.random();
        const phi = Math.random() * Math.PI * 2;
        const r = (1 - u) * 35 * (0.8 + 0.2 * Math.cos(5 * phi));
        y = -10 - u * 38 + (Math.random() - 0.5) * 4;
        x = Math.cos(phi) * r;
        z = Math.sin(phi) * r;

        col = cGalaxyViolet.clone().lerp(cRuby, Math.random());
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    flowerGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    flowerGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const flowerMat = new THREE.PointsMaterial({
      size: this.isMobile ? 3.6 : 4.2,
      map: glowTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.95
    });

    this.particleFlowerMesh = new THREE.Points(flowerGeo, flowerMat);
    this.flowerGroup.add(this.particleFlowerMesh);

    // 3. HẠT BỤI SÁNG LƠ LỬNG (Ambient Sparkles): Mobile 120 hạt, Desktop 300 hạt
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = this.isMobile ? 120 : 300;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 550;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 320;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 550;

      const spCol = Math.random() > 0.4 ? cWhite : cSoftPink;
      sparkleColors[i * 3] = spCol.r;
      sparkleColors[i * 3 + 1] = spCol.g;
      sparkleColors[i * 3 + 2] = spCol.b;
    }

    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeo.setAttribute("color", new THREE.BufferAttribute(sparkleColors, 3));

    const sparkleMat = new THREE.PointsMaterial({
      size: this.isMobile ? 2.6 : 3.2,
      map: glowTex,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.75
    });

    this.ambientSparklesMesh = new THREE.Points(sparkleGeo, sparkleMat);
    this.flowerGroup.add(this.ambientSparklesMesh);
  }

  // Tạo các tấm ảnh và bảng chữ lời chúc phát sáng lơ lửng quanh bông hoa (Tối ưu phóng to 1.6x-2.0x, quỹ đạo gần tâm)
  createFloatingWishes() {
    // 1. Thẻ chữ lời chúc (Canvas Texture phát sáng độ nét cao, font chữ lớn 14px-16px, viền glow dày)
    CONFIG.wishes.forEach((wishText, idx) => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 140;
      const ctx = canvas.getContext("2d");

      // Nền gradient bóng bẩy màu đêm tím - hồng đậm lãng mạn
      const grad = ctx.createLinearGradient(0, 0, 640, 140);
      grad.addColorStop(0, "rgba(35, 12, 45, 0.92)");
      grad.addColorStop(1, "rgba(18, 6, 28, 0.92)");
      ctx.fillStyle = grad;

      // Glow effect viền hồng phát sáng neon đậm nét và nổi bật trên nền tối
      ctx.shadowColor = "#ff2e63";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "#ff4d79";
      ctx.lineWidth = 5;

      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(10, 10, 620, 120, 28);
      } else {
        ctx.rect(10, 10, 620, 120);
      }
      ctx.fill();
      ctx.stroke();

      // Viền sáng viền trong ánh vàng/hồng nhẹ (inner neon highlight)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 215, 0, 0.45)";
      ctx.lineWidth = 2;
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(14, 14, 612, 112, 24);
      } else {
        ctx.rect(14, 14, 612, 112);
      }
      ctx.stroke();

      // Tự động căn chỉnh kích thước font chữ lớn rõ nét (30px canvas tương đương 14-16px hiển thị)
      let fontSize = 30;
      ctx.font = `bold ${fontSize}px 'Segoe UI', 'Quicksand', sans-serif`;
      while (ctx.measureText(wishText).width > 560 && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px 'Segoe UI', 'Quicksand', sans-serif`;
      }

      // Chữ phát sáng sắc nét rõ ràng trên nền tối
      ctx.shadowColor = "#ff3366";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(wishText, 320, 70);

      const texture = new THREE.CanvasTexture(canvas);
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide, // Luôn nhìn mặt trước, ẩn mặt sau tránh soi gương
        depthWrite: false
      });
      // Phóng to kích thước thẻ chứa câu chúc lên 1.6x - 1.8x (Cũ: 55x14 -> Mới: 90x22 / 110x26)
      const cardGeo = this.isMobile ? new THREE.PlaneGeometry(90, 22) : new THREE.PlaneGeometry(110, 26);
      const mesh = new THREE.Mesh(cardGeo, cardMat);

      const angle = (idx / CONFIG.wishes.length) * Math.PI * 2;
      // Thu hẹp bán kính quỹ đạo đưa vào gần trung tâm hơn (cũ: 120-164 mobile -> mới: 96-114)
      const radius = (this.isMobile ? 96 : 118) + (idx % 2) * (this.isMobile ? 18 : 22);
      mesh.position.set(
        Math.cos(angle) * radius,
        (idx % 4) * 22 - 32,
        Math.sin(angle) * radius
      );
      // Billboard Mechanism: Hướng trực diện về phía Camera
      mesh.lookAt(this.camera.position);
      mesh.userData = {
        baseY: mesh.position.y,
        angle: angle,
        radius: radius,
        speed: 0.0028 + (idx % 2) * 0.0008
      };

      this.wishesGroup.add(mesh);
    });

    // 2. Tạo đúng 10 khung ảnh bay lơ lửng quanh bông hoa 3D (Phóng to 1.7x - 2.0x, quỹ đạo gần bông hoa)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    this.floatingPhotoMeshes = [];

    PHOTO_LIST.forEach((imgSrc, index) => {
      // Phân bổ góc phi = (index / PHOTO_LIST.length) * Math.PI * 2
      const phi = (index / PHOTO_LIST.length) * Math.PI * 2;
      // Thu hẹp bán kính quỹ đạo ảnh vào gần bông hoa hồng trung tâm (cũ: 150 mobile -> mới: 116-128)
      const radius = (this.isMobile ? 116 : 142) + (index % 2) * (this.isMobile ? 12 : 16);
      const posY = (index % 3 === 0 ? 28 : (index % 3 === 1 ? -26 : 2));

      // Phóng to khung ảnh 3D từ 22x22 lên 38x46 trên mobile (tăng ~1.8x đến 2x rõ nét)
      const photoGeo = this.isMobile ? new THREE.PlaneGeometry(38, 46) : new THREE.PlaneGeometry(48, 58);
      const photoMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      // Xử lý onerror: Nếu một ảnh load lỗi thì tự động thay thế bằng ảnh khác trong mảng
      const loadScene3Photo = (url, fallbackStep = 1) => {
        textureLoader.load(
          url,
          (tex) => {
            tex.minFilter = THREE.LinearFilter;
            photoMat.map = tex;
            photoMat.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error(`[Scene 3] Lỗi tải ảnh tại index ${index}: ${url}`, err);
            const fallbackSrc = PHOTO_LIST[(index + fallbackStep) % PHOTO_LIST.length];
            if (fallbackStep < PHOTO_LIST.length) {
              loadScene3Photo(fallbackSrc, fallbackStep + 1);
            }
          }
        );
      };

      loadScene3Photo(imgSrc);

      const photoMesh = new THREE.Mesh(photoGeo, photoMat);

      // Khung viền hồng phát sáng viền ngoài (Glowing Photo Frame)
      const frameGeo = this.isMobile ? new THREE.PlaneGeometry(40, 48) : new THREE.PlaneGeometry(50, 60);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xff4d79,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.2;
      photoMesh.add(frameMesh);

      photoMesh.position.set(
        Math.cos(phi) * radius,
        posY,
        Math.sin(phi) * radius
      );
      // Billboard Mechanism: Hướng trực diện về phía Camera
      photoMesh.lookAt(this.camera.position);
      photoMesh.userData = {
        baseY: posY,
        angle: phi,
        radius: radius,
        speed: 0.0022
      };

      this.wishesGroup.add(photoMesh);
      this.floatingPhotoMeshes.push(photoMesh);
    });
  }

  // Tạo quả cầu ảnh 3D & vị trí biến hình Grid Wall (Tối ưu Mobile 4 cột ngang 70-85px, gap 10px, 88% width)
  createPhotoSphere() {
    const w = window.innerWidth;
    this.isMobile = w <= 768;
    // Mobile: 20 thẻ ảnh (4 cột x 5 hàng), Desktop: 40 thẻ ảnh (8 cột x 5 hàng)
    // Mỗi ảnh trong PHOTO_LIST xuất hiện đều đặn (2 lần trên Mobile, 4 lần trên Desktop)
    const totalCards = this.isMobile ? 20 : 40;
    const sphereRadius = this.isMobile ? 125 : 155;
    this.sphereCardScale = this.isMobile ? 0.52 : 0.62;

    const cols = this.isMobile ? (w < 350 ? 3 : 4) : 8;
    const rows = Math.ceil(totalCards / cols);
    const gap = this.isMobile ? 10 : 14;

    // Chiều rộng thẻ ảnh: trên Mobile chiếm 88% màn hình, nằm gọn trong khoảng 70px - 85px
    let cardW;
    if (this.isMobile) {
      const targetGridW = w * 0.88;
      cardW = Math.round((targetGridW - (cols - 1) * gap) / cols);
      cardW = Math.max(70, Math.min(85, cardW));
    } else {
      cardW = Math.min(105, Math.max(85, Math.round((w * 0.75 - (cols - 1) * gap) / cols)));
    }
    const cardH = Math.round(cardW * 1.25);
    const spacingX = cardW + gap;
    const spacingY = cardH + gap;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    // Thẻ ảnh 3D cân đối tỉ lệ chuẩn chân dung 4:5
    const cardGeo = new THREE.PlaneGeometry(cardW, cardH);

    for (let i = 0; i < totalCards; i++) {
      const photoSrc = PHOTO_LIST[i % PHOTO_LIST.length];

      const cardMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });

      // Xử lý nạp ảnh và dự phòng
      const loadSpherePhoto = (url, fallbackStep = 1) => {
        textureLoader.load(
          url,
          (tex) => {
            tex.minFilter = THREE.LinearFilter;
            cardMat.map = tex;
            cardMat.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error(`[Scene 4] Lỗi tải ảnh tại thẻ ${i}: ${url}`, err);
            const fallbackSrc = PHOTO_LIST[(i + fallbackStep) % PHOTO_LIST.length];
            if (fallbackStep < PHOTO_LIST.length) {
              loadSpherePhoto(fallbackSrc, fallbackStep + 1);
            }
          }
        );
      };

      loadSpherePhoto(photoSrc);

      const mesh = new THREE.Mesh(cardGeo, cardMat);
      // Trên quả cầu, thẻ ảnh co tỷ lệ để các thẻ không chồng lấn lên nhau
      mesh.scale.set(this.sphereCardScale, this.sphereCardScale, this.sphereCardScale);

      // 1. Tọa độ Quả cầu (Fibonacci Sphere Algorithm)
      const phi = Math.acos(-1 + (2 * i) / totalCards);
      const theta = Math.sqrt(totalCards * Math.PI) * phi;

      const spherePos = new THREE.Vector3(
        sphereRadius * Math.cos(theta) * Math.sin(phi),
        sphereRadius * Math.sin(theta) * Math.sin(phi),
        sphereRadius * Math.cos(phi)
      );

      // Xoay mặt thẻ ảnh hướng ra ngoài tâm cầu
      mesh.position.copy(spherePos);
      mesh.lookAt(spherePos.clone().multiplyScalar(2));
      const sphereRot = mesh.rotation.clone();

      // 2. Tọa độ Tường Lưới phẳng (Grid Wall): Căn giữa tuyệt đối (0, 0, 0), rộng 85%-90% màn hình
      const c = i % cols;
      const r = Math.floor(i / cols);
      const gridPos = new THREE.Vector3(
        (c - (cols - 1) / 2) * spacingX,
        ((rows - 1) / 2 - r) * spacingY,
        0
      );
      const gridRot = new THREE.Euler(0, 0, 0);

      mesh.userData = {
        spherePos: spherePos,
        sphereRot: sphereRot,
        gridPos: gridPos,
        gridRot: gridRot
      };

      this.photoSphereGroup.add(mesh);
      this.cards.push(mesh);
    }

    // Mặc định ẩn quả cầu khi đang ở Scene 3
    this.photoSphereGroup.visible = false;
  }

  // Tự động tính toán lại tọa độ lưới khi xoay màn hình hoặc resize
  updateGridCoordinates() {
    if (!this.cards || this.cards.length === 0) return;
    const w = window.innerWidth;
    const isMobile = w <= 768;
    const cols = isMobile ? (w < 350 ? 3 : 4) : 8;
    const rows = Math.ceil(this.cards.length / cols);
    const gap = isMobile ? 10 : 14;

    let cardW;
    if (isMobile) {
      const targetGridW = w * 0.88;
      cardW = Math.round((targetGridW - (cols - 1) * gap) / cols);
      cardW = Math.max(70, Math.min(85, cardW));
    } else {
      cardW = Math.min(105, Math.max(85, Math.round((w * 0.75 - (cols - 1) * gap) / cols)));
    }
    const cardH = Math.round(cardW * 1.25);
    const spacingX = cardW + gap;
    const spacingY = cardH + gap;

    this.cards.forEach((card, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const gridX = (c - (cols - 1) / 2) * spacingX;
      const gridY = ((rows - 1) / 2 - r) * spacingY;
      card.userData.gridPos.set(gridX, gridY, 0);
      card.userData.gridRot.set(0, 0, 0);
    });
  }

  // Biến hình Morphing giữa Quả Cầu 3D và Tường Ảnh (Grid Wall) bằng GSAP
  toggleMorph() {
    this.isGridMode = !this.isGridMode;
    const duration = 1.35;
    const h = window.innerHeight;
    // Tính toán cự ly camera chuẩn xác để 1 đơn vị Three.js = đúng 1 pixel trên màn hình
    const targetCamZ = Math.round(h / (2 * Math.tan((this.camera.fov * Math.PI) / 360)));

    if (this.isGridMode) {
      // 1. Khóa tạm xoay OrbitControls để mặt lưới cố định phẳng, không bị xoay nghiêng
      if (this.controls) {
        this.controls.enableRotate = false;
        gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.out" });
      }

      // 2. Triệt tiêu toàn bộ góc xoay của photoSphereGroup về (0,0,0) vuông góc với màn hình
      gsap.to(this.photoSphereGroup.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.1,
        ease: "power2.out"
      });

      // 3. Camera bay về trực diện chính diện (0, 0, targetCamZ)
      gsap.to(this.camera.position, {
        x: 0,
        y: 0,
        z: targetCamZ,
        duration: 1.25,
        ease: "power2.inOut"
      });

      // 4. Các ảnh bay mượt mà vào lưới chữ nhật phẳng, quay mặt trực diện (0,0,0) và phóng to scale 1.0
      this.cards.forEach((card, idx) => {
        gsap.to(card.position, {
          x: card.userData.gridPos.x,
          y: card.userData.gridPos.y,
          z: card.userData.gridPos.z,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });

        gsap.to(card.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });

        gsap.to(card.scale, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });
      });
    } else {
      // Mở lại tính năng xoay 360 độ cho Quả cầu 3D
      if (this.controls) {
        this.controls.enableRotate = true;
        gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.out" });
      }

      gsap.to(this.camera.position, {
        x: 0,
        y: this.isMobile ? 10 : 20,
        z: 480,
        duration: 1.25,
        ease: "power2.inOut"
      });

      const sphereScale = this.sphereCardScale || (this.isMobile ? 0.52 : 0.62);

      this.cards.forEach((card, idx) => {
        gsap.to(card.position, {
          x: card.userData.spherePos.x,
          y: card.userData.spherePos.y,
          z: card.userData.spherePos.z,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });

        gsap.to(card.rotation, {
          x: card.userData.sphereRot.x,
          y: card.userData.sphereRot.y,
          z: card.userData.sphereRot.z,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });

        gsap.to(card.scale, {
          x: sphereScale,
          y: sphereScale,
          z: sphereScale,
          duration: duration,
          delay: idx * 0.012,
          ease: "power3.inOut"
        });
      });
    }

    // Cập nhật thông báo UI
    const badge = document.getElementById("s4ModeBadge");
    const hint = document.getElementById("s4Hint");
    const btnText = document.getElementById("s4MorphText");
    if (this.isGridMode) {
      if (badge) badge.textContent = "Tường Lưới Kỷ Niệm (Photo Grid)";
      if (hint) hint.textContent = "✨ Toàn bộ ảnh đã được trải phẳng trực diện trước mắt bạn";
      if (btnText) btnText.textContent = "Quay lại Quả Cầu 3D";
    } else {
      if (badge) badge.textContent = "Quả Cầu Kỷ Niệm 3D (Photo Sphere)";
      if (hint) hint.textContent = "💫 Chạm vào quả cầu để biến hình thành Tường Lưới Ảnh";
      if (btnText) btnText.textContent = "Xếp thành Tường Ảnh";
    }
  }

  switchMode(sceneNum) {
    this.activeSceneMode = sceneNum;
    if (sceneNum === 3) {
      this.flowerGroup.visible = true;
      this.wishesGroup.visible = true;
      this.photoSphereGroup.visible = false;
      if (this.controls) this.controls.enableRotate = true;
      // Cự ly camera vừa vặn để bao quát trọn vẹn hoa 3D, 10 khung ảnh và các lời chúc ấm áp
      gsap.to(this.camera.position, { x: 0, y: 0, z: this.isMobile ? 480 : 460, duration: 0.8 });
    } else if (sceneNum === 4) {
      this.flowerGroup.visible = false;
      this.wishesGroup.visible = false;
      this.photoSphereGroup.visible = true;
      if (this.isGridMode) {
        if (this.controls) this.controls.enableRotate = false;
        const h = window.innerHeight;
        const targetCamZ = Math.round(h / (2 * Math.tan((this.camera.fov * Math.PI) / 360)));
        gsap.to(this.camera.position, { x: 0, y: 0, z: targetCamZ, duration: 1.2 });
      } else {
        if (this.controls) this.controls.enableRotate = true;
        // Thu nhỏ bán kính và lùi camera ra xa để nhìn rõ trọn vẹn quả cầu xoay tròn ở giữa màn hình
        gsap.to(this.camera.position, { x: 0, y: this.isMobile ? 10 : 20, z: 480, duration: 1.2 });
      }
    }
  }

  onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.isMobile = w <= 768;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

    this.updateGridCoordinates();

    if (this.isGridMode) {
      const targetCamZ = Math.round(h / (2 * Math.tan((this.camera.fov * Math.PI) / 360)));
      this.camera.position.set(0, 0, targetCamZ);
      this.cards.forEach((card) => {
        card.position.copy(card.userData.gridPos);
        card.rotation.set(0, 0, 0);
      });
    }
  }

  // Quản lý thông minh vòng lặp RequestAnimationFrame (Smart RAF Pause / Resume)
  startRendering() {
    if (this.isRendering) return;
    this.isRendering = true;
    this.animate();
  }

  pauseRendering() {
    this.isRendering = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  animate() {
    if (!this.isRendering) return;
    this.animId = requestAnimationFrame(() => this.animate());

    try {
      const time = performance.now() * 0.001;

      // Hiệu ứng Scene 3: Xoay bệ hoa, đĩa ngân hà và bay bổng lời chúc
      if (this.activeSceneMode === 3 && this.flowerGroup && this.flowerGroup.visible) {
        this.flowerGroup.rotation.y += 0.0025;

        // Xoay đĩa thiên hà ngược chiều nhẹ
        if (this.galaxyDiscMesh) {
          this.galaxyDiscMesh.rotation.y -= 0.0035;
        }

        // Hiệu ứng nhấp nháy / thở sống động cho bông hoa hồng 3D (Breathing Animation)
        if (this.particleFlowerMesh) {
          this.particleFlowerMesh.rotation.y -= 0.0012;
          const breathRadius = 1.0 + Math.sin(time * 1.8) * 0.032;
          const breathHeight = 1.0 + Math.sin(time * 1.8 - 0.35) * 0.045;
          this.particleFlowerMesh.scale.set(breathRadius, breathHeight, breathRadius);
        }

        // Xoay nhẹ các hạt bụi sáng ambient
        if (this.ambientSparklesMesh) {
          this.ambientSparklesMesh.rotation.y += 0.0006;
        }

        if (this.wishesGroup && this.wishesGroup.children) {
          this.wishesGroup.children.forEach((item) => {
            if (item.userData && item.userData.angle !== undefined) {
              item.userData.angle += item.userData.speed;
              item.position.x = Math.cos(item.userData.angle) * item.userData.radius;
              item.position.z = Math.sin(item.userData.angle) * item.userData.radius;
              item.position.y = item.userData.baseY + Math.sin(time * 2 + item.userData.radius) * 6;
              // BILLBOARD MECHANISM: Cập nhật góc quay để LUÔN LUÔN hướng mặt trước trực diện về phía Camera
              item.lookAt(this.camera.position);
            }
          });
        }
      }

      // Hiệu ứng Scene 4: Tự động xoay Quả cầu khi không ở chế độ Grid
      if (this.activeSceneMode === 4 && !this.isGridMode && this.photoSphereGroup && this.photoSphereGroup.visible) {
        this.photoSphereGroup.rotation.y += 0.0035;
        this.photoSphereGroup.rotation.x = Math.sin(time * 0.5) * 0.08;
      }
    } catch (animErr) {
      console.error("[ThreeSceneManager] Lỗi trong animate loop:", animErr);
    }

    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Cập nhật lại toàn bộ ảnh trong Three.js khi người dùng tải ảnh cá nhân lên
  updatePhotos(newPhotos) {
    const list = (newPhotos && newPhotos.length > 0) ? newPhotos : PHOTO_LIST;
    console.log("Đang load ảnh:", list);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    // 1. Cập nhật các tấm ảnh trên Quả Cầu 3D / Tường Lưới
    this.cards.forEach((card, idx) => {
      const imgUrl = list[idx % list.length];
      textureLoader.load(
        imgUrl,
        (tex) => {
          tex.minFilter = THREE.LinearFilter;
          card.material.map = tex;
          card.material.needsUpdate = true;
        },
        undefined,
        (err) => console.error(`[updatePhotos Sphere] Lỗi tải ảnh ${imgUrl}:`, err)
      );
    });

    // 2. Cập nhật các khung ảnh lơ lửng ở Scene 3
    if (this.floatingPhotoMeshes) {
      this.floatingPhotoMeshes.forEach((mesh, idx) => {
        const imgUrl = list[idx % list.length];
        textureLoader.load(
          imgUrl,
          (tex) => {
            tex.minFilter = THREE.LinearFilter;
            mesh.material.map = tex;
            mesh.material.needsUpdate = true;
          },
          undefined,
          (err) => console.error(`[updatePhotos Scene 3] Lỗi tải ảnh ${imgUrl}:`, err)
        );
      });
    }
  }
}

/* ============================================================================
 * SCENE 5 & 6: PHONG BÌ THƯ TÌNH YÊU & BỨC THƯ TAY GÕ CHỮ (TYPEWRITER)
 * ============================================================================ */
class LoveLetterManager {
  constructor(onCompleteLetter) {
    this.envelopeEl = document.getElementById("loveEnvelope");
    this.s5Backdrop = document.getElementById("s5PolaroidsBackdrop");
    this.typewriterTextEl = document.getElementById("typewriterText");
    this.skipBtn = document.getElementById("skipTypewriterBtn");
    this.confettiBtn = document.getElementById("confettiHeartsBtn");
    this.letterBackdropBlur = document.getElementById("letterBackdropBlur");

    this.onCompleteLetter = onCompleteLetter;
    this.typeInterval = null;
    this.isTyping = false;

    this.initPolaroidsBackdrop();
    this.bindEvents();
  }

  initPolaroidsBackdrop() {
    if (!this.s5Backdrop) return;
    this.s5Backdrop.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      const pol = document.createElement("div");
      pol.className = "backdrop-polaroid";
      pol.style.setProperty("--rot", (i % 2 === 0 ? 1 : -1) * (i * 3 + 4));
      const img = document.createElement("div");
      img.className = "backdrop-polaroid-img";
      img.style.backgroundImage = `url('${CONFIG.photos[i % CONFIG.photos.length]}')`;
      pol.appendChild(img);
      this.s5Backdrop.appendChild(pol);
    }

    if (this.letterBackdropBlur) {
      this.letterBackdropBlur.style.backgroundImage = `url('${CONFIG.photos[0]}')`;
    }
  }

  resetEnvelope() {
    if (this.envelopeEl) {
      this.envelopeEl.classList.remove("opened");
    }
  }

  bindEvents() {
    // Click hoặc touch vào phong bì mở nắp thư
    if (this.envelopeEl) {
      this.envelopeEl.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openEnvelope();
      });
      this.envelopeEl.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        this.openEnvelope();
      });
    }

    // Nút tua nhanh gõ chữ
    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.skipTypewriter());
    }

    // Nút bắn tim confetti
    if (this.confettiBtn) {
      this.confettiBtn.addEventListener("click", () => this.fireHeartConfetti());
    }
  }

  openEnvelope() {
    if (!this.envelopeEl || this.envelopeEl.classList.contains("opened")) return;
    this.envelopeEl.classList.add("opened");

    // Bắn chùm tim nhỏ và pháo hoa rực rỡ
    this.fireHeartConfetti();

    // Chuyển sang Scene 6 sau khi nắp phong bì mở mượt mà
    setTimeout(() => {
      if (this.onCompleteLetter) this.onCompleteLetter();
    }, 1100);
  }

  startTypewriter() {
    if (!this.typewriterTextEl) return;
    this.typewriterTextEl.textContent = "";
    this.isTyping = true;
    const fullText = CONFIG.letterContent;
    let idx = 0;

    if (this.typeInterval) clearInterval(this.typeInterval);

    this.typeInterval = setInterval(() => {
      if (idx < fullText.length) {
        this.typewriterTextEl.textContent += fullText[idx];
        idx++;
      } else {
        clearInterval(this.typeInterval);
        this.isTyping = false;
        this.fireHeartConfetti();
      }
    }, 38);
  }

  skipTypewriter() {
    if (this.typeInterval) clearInterval(this.typeInterval);
    if (this.typewriterTextEl) {
      this.typewriterTextEl.textContent = CONFIG.letterContent;
    }
    this.isTyping = false;
    this.fireHeartConfetti();
  }

  fireHeartConfetti() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff4d79", "#ff7597", "#ffa4b8", "#e11d48", "#fbcfe8"]
      });
      setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0.25, y: 0.65 },
          colors: ["#ff3366", "#fb7185", "#ffd1dc"]
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 0.75, y: 0.65 },
          colors: ["#ff3366", "#fb7185", "#ffd1dc"]
        });
      }, 220);
    }
  }

  // Cập nhật ảnh cho bức thư và polaroid nền khi người dùng tải ảnh lên
  updatePhotos(newPhotos) {
    this.initPolaroidsBackdrop();
    if (this.letterBackdropBlur && newPhotos.length > 0) {
      this.letterBackdropBlur.style.backgroundImage = `url('${newPhotos[0]}')`;
    }
  }
}

/* ============================================================================
 * TRÌNH ĐIỀU PHỐI TỔNG THỂ 6 PHÂN CẢNH (SCENE CONTROLLER & APP LIFECYCLE)
 * ============================================================================ */
class AppController {
  constructor() {
    this.currentScene = 1;
    this.totalScenes = 6;

    // Khởi tạo các module ứng dụng
    this.audioMgr = new RomanticAudioManager();
    this.starfield = new StarfieldEngine("universeCanvas");
    this.mosaicMgr = new Photo2010MosaicManager();

    // Khởi tạo sớm ThreeSceneManager để nạp sẵn WebGL shader và texture, chuyển cảnh tức thì không bị giật lag
    this.threeMgr = null;
    this.ensureThreeManager();

    // Trạng thái tương tác Scene 1 & 2
    this.s1State = "waiting"; // 'waiting' -> 'exploding' -> 'full' -> 'fading' -> 'done'
    this.s2State = "idle";    // 'idle' -> 'floating' -> 'assembling' -> 'ready_next'
    this.s2AutoTimer = null;

    // Scene 1: Engine vẽ 2D Canvas hoa hồng nở 60 FPS
    this.flowerEngine = new CanvasFlowerEngine("flowerCanvas", () => {
      this.s1State = "full";
      // Hiển thị gợi ý chạm tiếp tục tinh tế khi hoa đã nở phủ kín 100% màn hình
      const continueHint = document.getElementById("s1ContinueHint");
      if (continueHint) continueHint.classList.remove("hidden");
    });

    this.letterMgr = new LoveLetterManager(() => {
      this.goToScene(6);
      this.letterMgr.startTypewriter();
    });

    this.initUIEvents();
    this.goToScene(1);
  }

  ensureThreeManager() {
    if (!this.threeMgr) {
      try {
        this.threeMgr = new ThreeSceneManager("threeCanvasContainer");
      } catch (err) {
        console.error("[AppController] Lỗi khi tạo ThreeSceneManager:", err);
      }
    }
    return this.threeMgr;
  }

  fireIntroBurst() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#ffd700", "#ff3366", "#f43f5e", "#ffb6c1", "#ffffff"],
        startVelocity: 38,
        gravity: 0.8,
        ticks: 200
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 140,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#ffd700", "#ff4d79", "#fbcfe8", "#ffffff"],
          startVelocity: 28,
          gravity: 0.9,
          ticks: 180
        });
      }, 100);
    }
  }

  // Kích hoạt hoa hồng nở bung tràn kín 100% màn hình khi chạm vào bất kỳ đâu ở Scene 1
  triggerScene1Bloom() {
    if (this.s1State !== "waiting") return;
    this.s1State = "exploding";

    // Tự động phát nhạc nền lãng mạn
    this.audioMgr.play();

    // 1. Đối tượng mở đầu phát nổ thành hàng trăm hạt sáng lấp lánh (Particle Burst effect)
    this.fireIntroBurst();

    // 2. Ẩn hoàn toàn đối tượng mở đầu sau khi click
    const introObj = document.getElementById("s1IntroObject");
    if (introObj) {
      introObj.classList.add("bursting");
      setTimeout(() => {
        introObj.classList.add("hidden");
      }, 400);
    }

    // 3. Ngay sau đó (trong vòng 0.3 giây), hiệu ứng lốc xoáy hoa hồng nở tràn kín màn hình mới bắt đầu chạy bùng nổ từ tâm ra ngoài
    setTimeout(() => {
      this.flowerEngine.startExplosion();
    }, 300);
  }

  // Chuyển mượt từ Scene 1 sang Scene 2 khi chạm lần nữa
  proceedFromScene1ToScene2() {
    if (this.s1State !== "full") return;
    this.s1State = "fading";

    const continueHint = document.getElementById("s1ContinueHint");
    if (continueHint) continueHint.classList.add("hidden");

    this.flowerEngine.fadeOutToScene2(() => {
      this.s1State = "done";
      this.goToScene(2);
    });
  }

  // Khởi động Scene 2: hiển thị các bức ảnh lơ lửng rồi tự động xếp thành số "20/10"
  startScene2() {
    this.s2State = "floating";
    this.mosaicMgr.resetTiles();
    this.mosaicMgr.updateResponsiveScale();

    const s2Hint = document.getElementById("s2TapHint");
    if (s2Hint) s2Hint.classList.add("hidden");

    if (this.s2AutoTimer) clearTimeout(this.s2AutoTimer);
    // Kích hoạt xếp ảnh nhanh mượt mà, phản hồi tức thì
    this.s2AutoTimer = setTimeout(() => {
      if (this.s2State === "floating") {
        this.triggerAssemble2010();
      }
    }, 150);
  }

  // Kích hoạt quá trình xếp mảnh ghép ảnh thành dòng chữ 20/10
  triggerAssemble2010() {
    if (this.s2State !== "floating") return;
    this.s2State = "assembling";
    if (this.s2AutoTimer) clearTimeout(this.s2AutoTimer);

    this.mosaicMgr.assemble2010(() => {
      // Sau khi xếp hoàn chỉnh: hiển thị dòng chữ gợi ý chạm tiếp tục
      this.s2State = "ready_next";
      const s2Hint = document.getElementById("s2TapHint");
      if (s2Hint) s2Hint.classList.remove("hidden");
    });
  }

  initUIEvents() {
    // BẮT SỰ KIỆN CHẠM / CLICK TOÀN MÀN HÌNH (Full-screen Tap / Click to Trigger)
    let lastTapTime = 0;
    const handleScreenTap = (e) => {
      const now = Date.now();
      if (now - lastTapTime < 350) return; // Chống lặp sự kiện giữa touch và click

      // Tránh kích hoạt nếu bấm vào các nút điều khiển khác
      if (e.target.closest("#musicToggleBtn, .scene-dock, .scene-dock-btn, .scene-arrow-btn, button, a, input, textarea")) {
        return;
      }

      if (this.currentScene === 1) {
        if (this.s1State === "waiting") {
          lastTapTime = now;
          this.triggerScene1Bloom();
        } else if (this.s1State === "full") {
          lastTapTime = now;
          this.proceedFromScene1ToScene2();
        }
      } else if (this.currentScene === 2) {
        if (this.s2State === "floating") {
          // Chạm màn hình để kích hoạt xếp ảnh 20/10 ngay lập tức (không cần chờ hết delay 0.7s)
          lastTapTime = now;
          this.triggerAssemble2010();
        } else if (this.s2State === "ready_next") {
          // Chạm màn hình để chuyển mượt sang Scene 3 (Bông hoa 3D)
          lastTapTime = now;
          const s2Hint = document.getElementById("s2TapHint");
          if (s2Hint) s2Hint.classList.add("hidden");
          this.goToScene(3);
        }
      } else if (this.currentScene === 5) {
        lastTapTime = now;
        this.letterMgr.openEnvelope();
      }
    };

    window.addEventListener("pointerdown", handleScreenTap);

    // Kích hoạt khi chạm trực tiếp vào Hộp quà mở đầu Scene 1
    const introObj = document.getElementById("s1IntroObject");
    if (introObj) {
      const onIntroClick = (e) => {
        e.stopPropagation();
        this.triggerScene1Bloom();
      };
      introObj.addEventListener("click", onIntroClick);
      introObj.addEventListener("pointerdown", onIntroClick);
    }

    // 3. Scene 2 Next Button (Sang 3D Hoa Ánh Sáng)
    const s2NextBtn = document.getElementById("s2NextBtn");
    if (s2NextBtn) {
      s2NextBtn.addEventListener("click", () => {
        const s2Hint = document.getElementById("s2TapHint");
        if (s2Hint) s2Hint.classList.add("hidden");
        this.goToScene(3);
      });
    }

    // 4. Scene 3 Next Button (Sang Quả Cầu 3D)
    const s3NextBtn = document.getElementById("s3NextBtn");
    if (s3NextBtn) {
      s3NextBtn.addEventListener("click", () => this.goToScene(4));
    }

    // 5. Scene 4 Morph Button & Next Button
    const s4MorphBtn = document.getElementById("s4MorphBtn");
    if (s4MorphBtn) {
      s4MorphBtn.addEventListener("click", () => {
        if (this.threeMgr) this.threeMgr.toggleMorph();
      });
    }
    const s4NextBtn = document.getElementById("s4NextBtn");
    if (s4NextBtn) {
      s4NextBtn.addEventListener("click", () => this.goToScene(5));
    }

    // 6. Scene 6 Restart Journey
    const restartBtn = document.getElementById("restartJourneyBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        this.s1State = "waiting";
        this.s2State = "idle";
        if (this.s2AutoTimer) clearTimeout(this.s2AutoTimer);
        this.goToScene(1);
        this.flowerEngine.reset();
        const introEl = document.getElementById("s1IntroObject");
        if (introEl) introEl.classList.remove("bursting", "hidden");
        const tapHint = document.getElementById("s1TapHint");
        if (tapHint) tapHint.classList.remove("hidden");
        const continueHint = document.getElementById("s1ContinueHint");
        if (continueHint) continueHint.classList.add("hidden");
        const s2Hint = document.getElementById("s2TapHint");
        if (s2Hint) s2Hint.classList.add("hidden");
        const env = document.getElementById("loveEnvelope");
        if (env) env.classList.remove("opened");
      });
    }

    // Thanh điều hướng thanh Dock Scene (1-6)
    document.querySelectorAll(".scene-dock-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sceneId = parseInt(btn.dataset.scene, 10);
        this.goToScene(sceneId);
      });
    });

    // Mũi tên Previous / Next
    const prevBtn = document.getElementById("prevSceneBtn");
    const nextBtn = document.getElementById("nextSceneBtn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const target = this.currentScene > 1 ? this.currentScene - 1 : this.totalScenes;
        this.goToScene(target);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const target = this.currentScene < this.totalScenes ? this.currentScene + 1 : 1;
        this.goToScene(target);
      });
    }
  }

  goToScene(sceneNum) {
    this.currentScene = sceneNum;

    // Cập nhật Dock UI buttons
    document.querySelectorAll(".scene-dock-btn").forEach((btn) => {
      const s = parseInt(btn.dataset.scene, 10);
      btn.classList.toggle("active", s === sceneNum);
    });

    // Ẩn tất cả các Section HTML scene
    document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));

    const threeContainer = document.getElementById("threeCanvasContainer");
    const s3Overlay = document.getElementById("s3OverlayUI");
    const s4Overlay = document.getElementById("s4OverlayUI");

    // Mặc định ẩn overlay Three.js
    if (s3Overlay) s3Overlay.classList.add("hidden");
    if (s4Overlay) s4Overlay.classList.add("hidden");

    // Quản lý thông minh vòng lặp Render: Tạm dừng Three.js ở các cảnh 1, 2, 5, 6 để đạt 60 FPS tối đa
    if (sceneNum === 3 || sceneNum === 4) {
      this.ensureThreeManager();
      if (this.threeMgr) {
        this.threeMgr.onWindowResize();
        this.threeMgr.switchMode(sceneNum);
        this.threeMgr.startRendering();
      }
      if (this.starfield) this.starfield.pause();
    } else {
      if (this.threeMgr) {
        this.threeMgr.pauseRendering();
      }
      if (this.starfield) this.starfield.resume();
    }

    if (sceneNum === 1) {
      document.getElementById("scene1").classList.add("active");
      if (threeContainer) threeContainer.classList.add("hidden");
      if (this.s1State === "waiting") {
        const introEl = document.getElementById("s1IntroObject");
        if (introEl) introEl.classList.remove("bursting", "hidden");
        const tapHint = document.getElementById("s1TapHint");
        if (tapHint) tapHint.classList.remove("hidden");
      }
    } else if (sceneNum === 2) {
      document.getElementById("scene2").classList.add("active");
      if (threeContainer) threeContainer.classList.add("hidden");
      this.startScene2();
    } else if (sceneNum === 3) {
      if (threeContainer) threeContainer.classList.remove("hidden");
      if (s3Overlay) s3Overlay.classList.remove("hidden");
    } else if (sceneNum === 4) {
      if (threeContainer) threeContainer.classList.remove("hidden");
      if (s4Overlay) s4Overlay.classList.remove("hidden");
    } else if (sceneNum === 5) {
      const scene5El = document.getElementById("scene5");
      if (scene5El) scene5El.classList.add("active");
      if (threeContainer) threeContainer.classList.add("hidden");
      this.letterMgr.resetEnvelope();
      if (window.gsap) {
        gsap.fromTo(
          "#scene5 .envelope-scene-wrapper",
          { y: 40, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "back.out(1.5)" }
        );
      }
    } else if (sceneNum === 6) {
      const scene6El = document.getElementById("scene6");
      if (scene6El) scene6El.classList.add("active");
      if (threeContainer) threeContainer.classList.add("hidden");
      this.letterMgr.startTypewriter();
    }
  }
}

// Khởi chạy toàn bộ ứng dụng khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});
