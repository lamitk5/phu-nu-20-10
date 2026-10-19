/**
 * Hệ thống Cơn Mưa Lời Chúc (Floating Wishes Shower):
 * - Tạo ra các viên nang/bong bóng lời chúc bay lơ lửng trên màn hình
 * - Người dùng chạm vào viên nang: Nổ pháo giấy confetti, phát âm thanh pop, mở modal thông điệp
 */

class FloatingWishesManager {
  constructor() {
    this.container = document.getElementById('wishesContainer');
    this.modal = document.getElementById('wishModal');
    this.modalCloseBtn = document.getElementById('wishModalCloseBtn');
    this.modalBackdrop = document.getElementById('wishModalBackdrop');
    this.modalWishTitle = document.getElementById('modalWishTitle');
    this.modalWishDesc = document.getElementById('modalWishDesc');
    this.modalAnotherBtn = document.getElementById('modalAnotherWishBtn');

    // Danh sách 20 lời chúc độc đáo, dễ thương & ý nghĩa ngày 20/10
    this.wishesPool = [
      {
        short: "Luôn xinh đẹp rạng rỡ ✨",
        title: "Nhan Sắc Tỏa Sáng",
        desc: "Chúc bạn mỗi sáng thức dậy đều thấy mình yêu đời, xinh đẹp và tỏa ra năng lượng tích cực khiến ai cũng muốn ở gần! 🌸"
      },
      {
        short: "Ăn ngon không béo 🧁",
        title: "Đặc Quyền Ăn Cả Thế Giới",
        desc: "Chúc bạn thỏa thích tận hưởng mọi món ngon mà vóc dáng vẫn thon gọn, thanh mảnh và luôn tràn đầy sức sống! 🍓"
      },
      {
        short: "Hạnh phúc ngập tràn 💖",
        title: "Trái Tim Ngập Tràn Yêu Thương",
        desc: "Mong bạn luôn gặp được những người chân thành, được nâng niu, trân trọng và hạnh phúc trong từng giây phút. 🌷"
      },
      {
        short: "Ví luôn dày cộp 💰",
        title: "Tài Lộc & Độc Lập",
        desc: "Chúc bạn công việc hanh thông, ví tiền rủng rỉnh, tự do mua những thứ mình thích và đi đến những nơi mình muốn! ✈️"
      },
      {
        short: "Mỗi ngày là một ngày vui 🌈",
        title: "Niềm Vui Bất Tận",
        desc: "Dù cuộc sống có bận rộn đến đâu, mong nụ cười luôn thường trực trên môi bạn. Mỗi ngày đều là một món quà! ☀️"
      },
      {
        short: "Luôn được yêu thương 🥰",
        title: "Bình Yên Trong Tâm Hồn",
        desc: "Chúc bạn tìm thấy một chốn bình yên, nơi có người lắng nghe bạn và luôn ở bên cạnh bạn trong mọi thăng trầm. 🧸"
      },
      {
        short: "Tự do & Kiêu hãnh 👑",
        title: "Nữ Thần Cuộc Đời Mình",
        desc: "Bạn là phiên bản độc nhất vô nhị. Hãy luôn tự tin, kiêu hãnh và vẽ nên cuộc đời rực rỡ theo cách của riêng bạn! 💫"
      },
      {
        short: "Trẻ mãi không già 🌺",
        title: "Thanh Xuân Mãi Mãi",
        desc: "Thời gian có thể trôi, nhưng tâm hồn bạn sẽ luôn tươi mới, dịu dàng và cuốn hút như tuổi 18! 🎀"
      },
      {
        short: "Mọi ước muốn thành hiện thực 🌟",
        title: "Vạn Sự Như Ý",
        desc: "Mọi dự định, ước mơ của bạn trong năm nay đều sẽ đơm hoa kết trái rực rỡ và thành công ngoài mong đợi! 🎯"
      },
      {
        short: "Ngủ ngon không âu lo 🌙",
        title: "Giấc Mơ Êm Đềm",
        desc: "Chúc bạn mỗi tối gối đầu giường đều buông bỏ hết mệt mỏi, chìm vào giấc ngủ êm đềm và đón chào ngày mới tràn năng lượng! ☁️"
      }
    ];

    this.activeCapsules = [];
    this.intervalId = null;
    this.isShowerActive = false;

    this.initEvents();
  }

  initEvents() {
    // Sự kiện đóng modal
    this.modalCloseBtn?.addEventListener('click', () => this.closeModal());
    this.modalBackdrop?.addEventListener('click', () => this.closeModal());
    
    // Nút mở thêm lời chúc trong modal
    this.modalAnotherBtn?.addEventListener('click', () => {
      this.closeModal();
      this.spawnCapsule();
      this.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
    });

    // Phím ESC đóng modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  // Bắt đầu tạo cơn mưa lời chúc lững lờ
  startFloatingShower() {
    if (this.isShowerActive) return;
    this.isShowerActive = true;

    // Sinh ngay 4-6 bong bóng đầu tiên
    const initialCount = window.innerWidth < 768 ? 4 : 7;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => this.spawnCapsule(), i * 600);
    }

    // Đều đặn thả thêm bong bóng
    this.intervalId = setInterval(() => {
      if (this.activeCapsules.length < (window.innerWidth < 768 ? 6 : 10)) {
        this.spawnCapsule();
      }
    }, 2800);
  }

  // Sinh 1 viên nang lời chúc với hiệu ứng bay ngẫu nhiên
  spawnCapsule() {
    if (!this.container) return;

    const wish = this.wishesPool[Math.floor(Math.random() * this.wishesPool.length)];
    const capsule = document.createElement('div');
    capsule.className = 'wish-capsule';

    capsule.innerHTML = `
      <span class="capsule-icon">💌</span>
      <span class="capsule-text">${wish.short}</span>
    `;

    // Tọa độ ngẫu nhiên
    const screenWidth = window.innerWidth;
    const startX = Math.random() * (screenWidth - 220) + 20;
    const duration = Math.random() * 8 + 14; // Bay từ 14s - 22s rất lững lờ, êm dịu

    // Chọn hướng bay: từ dưới lên hoặc từ trên xuống
    const fromBottom = Math.random() > 0.3;
    const startY = fromBottom ? window.innerHeight + 50 : -60;
    const endY = fromBottom ? -80 : window.innerHeight + 80;

    capsule.style.left = `${startX}px`;
    capsule.style.top = `${startY}px`;

    // Áp dụng keyframe CSS động cho từng viên nang
    const animName = `drift_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const styleEl = document.createElement('style');
    const swayDistance = (Math.random() - 0.5) * 80;

    styleEl.innerHTML = `
      @keyframes ${animName} {
        0% {
          transform: translateY(0) translateX(0) scale(0.9);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(${(endY - startY) * 0.5}px) translateX(${swayDistance}px) scale(1);
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(${endY - startY}px) translateX(${swayDistance * 0.5}px) scale(0.95);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);
    capsule.style.animation = `${animName} ${duration}s ease-in-out forwards`;

    // Click vào viên nang để nổ và đọc lời chúc
    capsule.addEventListener('click', (e) => {
      this.handleCapsuleClick(capsule, wish, e, styleEl);
    });

    this.container.appendChild(capsule);
    this.activeCapsules.push(capsule);

    // Tự động dọn dẹp khi hết thời gian bay
    setTimeout(() => {
      if (capsule.parentNode) {
        capsule.remove();
        styleEl.remove();
        this.activeCapsules = this.activeCapsules.filter(c => c !== capsule);
      }
    }, duration * 1000);
  }

  // Xử lý nổ bong bóng
  handleCapsuleClick(capsule, wish, event, styleEl) {
    const rect = capsule.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Âm thanh Pop
    if (window.audioManager) {
      window.audioManager.playPopSound();
    }

    // Hiệu ứng pháo giấy Confetti tại đúng vị trí chạm
    this.triggerConfetti(x, y);

    // Animation nổ biến mất
    capsule.classList.add('popping');
    setTimeout(() => {
      capsule.remove();
      styleEl.remove();
      this.activeCapsules = this.activeCapsules.filter(c => c !== capsule);
    }, 380);

    // Mở popup thông điệp chi tiết
    this.showWishModal(wish);
  }

  // Kích nổ pháo hoa Confetti bằng thư viện canvas-confetti
  triggerConfetti(x = 0.5, y = 0.5) {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: ['#e07a5f', '#f0a59a', '#c9a66b', '#6b9b7e', '#c45a42'],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1,
      shapes: ['circle', 'square']
    });
  }

  // Hiển thị modal thông điệp
  showWishModal(wish) {
    if (!this.modal) return;
    this.modalWishTitle.textContent = `"${wish.title}"`;
    this.modalWishDesc.textContent = wish.desc;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
  }

  // Kích hoạt toàn diện "Cơn mưa lời chúc" khi bấm nút trong thiệp
  triggerFullShower() {
    // Nổ pháo giấy ăn mừng
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#e07a5f', '#f0a59a', '#c9a66b', '#6b9b7e']
      });
    }

    // Burst thêm cánh hoa trên canvas
    if (window.petalEngine) {
      window.petalEngine.burst();
    }

    // Sinh hàng loạt 6 viên nang lời chúc mới cùng lúc
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.spawnCapsule(), i * 350);
    }

    // Đảm bảo luồng trôi nổi đang chạy
    this.startFloatingShower();
  }
}

// Khởi tạo instance toàn cục
window.wishesManager = new FloatingWishesManager();
