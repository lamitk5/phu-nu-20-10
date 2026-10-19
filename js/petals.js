/**
 * Hệ thống Vườn Hoa Rơi & Bụi Sao Lấp Lánh (Canvas Botanical Garden Engine):
 * - Vẽ trên Canvas 2D tối ưu hóa phần cứng, duy trì 60 FPS mượt mà
 * - Đa dạng loài hoa: Cánh hoa hồng, Đóa hoa anh đào 5 cánh, Hoa cúc họa mi nhụy vàng, Lá non mint
 * - Chuyển động lật 3D tự nhiên, gió thoảng lay động
 * - Hiệu ứng Tương tác: Nhấp chuột/chạm bất kỳ đâu để hoa bung nở (Click-to-bloom)
 */

class PetalShowerEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.sparkles = [];
    
    // Mật độ hoa phong phú, ngập tràn sắc màu
    this.isMobile = window.innerWidth < 768;
    this.maxPetals = this.isMobile ? 45 : 85;
    this.maxSparkles = this.isMobile ? 25 : 50;
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = false;
    this.wind = 0.5;
    this.targetWind = 0.5;

    // Bảng màu cánh hoa — coral / sage / gold (khớp Vườn 20/10)
    this.petalColors = [
      { r: 224, g: 122, b: 95,  a: 0.90 }, // Coral
      { r: 240, g: 165, b: 154, a: 0.88 }, // Blossom
      { r: 201, g: 166, b: 107, a: 0.85 }, // Gold
      { r: 107, g: 155, b: 126, a: 0.80 }, // Sage soft
      { r: 196, g: 90,  b: 66,  a: 0.88 }, // Coral deep
      { r: 247, g: 243, b: 236, a: 0.90 }  // Cream
    ];

    this.shapes = ['petal', 'blossom', 'daisy', 'heart', 'leaf'];

    this.init();
    this.initClickToBloom();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Khởi tạo danh sách hoa rơi
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Khởi tạo các hạt sáng
    for (let i = 0; i < this.maxSparkles; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createPetal(randomY = false) {
    const color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -25,
      size: Math.random() * 8 + 11, // Kích thước từ 11 - 19px
      color: shape === 'leaf' ? { r: 112, g: 162, b: 136, a: 0.85 } : color,
      speedY: Math.random() * 1.5 + 1.1, // Tốc độ rơi
      speedX: Math.random() * 0.9 - 0.45,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2.2,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.035 + 0.015,
      shape: shape
    };
  }

  createSparkle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : Math.random() * this.height,
      radius: Math.random() * 2.4 + 0.8,
      alpha: Math.random(),
      speedAlpha: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '#fff5eb' : '#ffe3ec'
    };
  }

  // Tăng cường lượng hoa khi bấm "Cơn mưa lời chúc"
  burst() {
    const burstCount = this.isMobile ? 35 : 70;
    for (let i = 0; i < burstCount; i++) {
      const p = this.createPetal();
      p.speedY = Math.random() * 3.2 + 2.2; // Rơi nhanh hơn
      this.petals.push(p);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    // Hiệu ứng lật 3D giả lập trên mặt phẳng 2D
    this.ctx.scale(Math.cos(p.flip), 1);

    this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;

    if (p.shape === 'petal') {
      // Cánh hoa hồng cong mềm mại
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 2, 0, p.size);
      this.ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size / 2, 0, 0);
      this.ctx.fill();
    } 
    else if (p.shape === 'blossom') {
      // Đóa hoa anh đào 5 cánh nhỏ xinh
      const petalRadius = p.size * 0.38;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        const px = Math.cos(angle) * petalRadius;
        const py = Math.sin(angle) * petalRadius;
        this.ctx.beginPath();
        this.ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
      // Nhụy hoa vàng cam rực rỡ
      this.ctx.fillStyle = '#ffd166';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, petalRadius * 0.55, 0, Math.PI * 2);
      this.ctx.fill();
    }
    else if (p.shape === 'daisy') {
      // Hoa cúc 8 cánh
      const petalLen = p.size * 0.45;
      for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        const px = Math.cos(angle) * petalLen;
        const py = Math.sin(angle) * petalLen;
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, petalLen * 0.4, petalLen * 0.8, angle, 0, Math.PI * 2);
        this.ctx.fill();
      }
      // Nhụy cúc vàng óng
      this.ctx.fillStyle = '#ffb703';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, petalLen * 0.45, 0, Math.PI * 2);
      this.ctx.fill();
    }
    else if (p.shape === 'leaf') {
      // Lá non xanh mát
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size * 0.6);
      this.ctx.quadraticCurveTo(p.size * 0.45, 0, 0, p.size * 0.6);
      this.ctx.quadraticCurveTo(-p.size * 0.45, 0, 0, -p.size * 0.6);
      this.ctx.fill();
    }
    else {
      // Hình trái tim nhỏ
      const topCurveHeight = p.size * 0.3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, topCurveHeight);
      this.ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
      this.ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, (p.size + topCurveHeight) / 2, 0, p.size);
      this.ctx.bezierCurveTo(0, (p.size + topCurveHeight) / 2, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
      this.ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawSparkle(s) {
    this.ctx.save();
    this.ctx.globalAlpha = Math.abs(Math.sin(s.alpha));
    this.ctx.fillStyle = s.color;
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = '#fff';
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    // Cập nhật hướng gió thoảng tự nhiên
    if (Math.random() < 0.02) {
      this.targetWind = (Math.random() - 0.5) * 1.6;
    }
    this.wind += (this.targetWind - this.wind) * 0.02;

    // Cập nhật từng đóa hoa & cánh hoa
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += p.speedX + this.wind;
      p.rotation += p.rotSpeed;
      p.flip += p.flipSpeed;

      // Khi hoa rơi chạm đáy màn hình
      if (p.y > this.height + 30 || p.x < -35 || p.x > this.width + 35) {
        if (this.petals.length > this.maxPetals) {
          this.petals.splice(i, 1);
        } else {
          this.petals[i] = this.createPetal(false);
        }
      }
    }

    // Cập nhật các hạt sao lấp lánh
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.alpha += s.speedAlpha;
      s.y -= 0.35;
      if (s.y < -10) {
        s.y = this.height + 10;
        s.x = Math.random() * this.width;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Vẽ hạt sáng trước
    for (let i = 0; i < this.sparkles.length; i++) {
      this.drawSparkle(this.sparkles[i]);
    }

    // Vẽ hoa và cánh hoa
    for (let i = 0; i < this.petals.length; i++) {
      this.drawPetal(this.petals[i]);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  // Hiệu ứng tương tác: Chạm chuột hoặc màn hình để nở hoa ngay tại điểm chạm
  initClickToBloom() {
    const flowerIcons = ['🌸', '🌷', '🌼', '🌺', '🌹', '💐', '✨'];

    const spawnBloom = (clientX, clientY) => {
      const el = document.createElement('div');
      el.className = 'click-bloom';
      el.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
      el.style.left = `${clientX}px`;
      el.style.top = `${clientY}px`;
      document.body.appendChild(el);

      // Tự động giải phóng sau khi kết thúc animation
      setTimeout(() => el.remove(), 900);
    };

    window.addEventListener('click', (e) => {
      // Tránh cản trở các nút bấm điều khiển
      if (e.target.closest('button, input, textarea, a, .wish-capsule')) return;
      spawnBloom(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        if (e.target.closest('button, input, textarea, a, .wish-capsule')) return;
        spawnBloom(touch.clientX, touch.clientY);
      }
    }, { passive: true });
  }
}

// Khởi tạo instance sau khi DOM sẵn sàng
window.initPetalEngine = () => {
  window.petalEngine = new PetalShowerEngine('petalCanvas');
};
