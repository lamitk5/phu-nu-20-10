/**
 * Bảng Điều Khiển Tùy Biến Cá Nhân Hóa (Personalization Engine):
 * - Cập nhật nội dung thiệp Real-time khi nhập liệu
 * - Mã hóa và giải mã dữ liệu vào URL Hash (hỗ trợ tiếng Việt có dấu UTF-8 100%)
 * - Mẫu lời chúc viết sẵn cho Người yêu, Mẹ, Chị em gái, Bạn bè
 * - Sao chép link chia sẻ vào Clipboard kèm thông báo Toast
 */

class CardCustomizer {
  constructor() {
    this.panel = document.getElementById('customizerPanel');
    this.backdrop = document.getElementById('panelBackdrop');
    this.openBtn = document.getElementById('openCustomizerBtn');
    this.closeBtn = document.getElementById('closeCustomizerBtn');
    this.shareBtn = document.getElementById('shareLinkBtn');
    this.copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
    this.resetBtn = document.getElementById('resetDefaultBtn');
    this.polaroidFrame = document.getElementById('polaroidFrame');

    // Input fields
    this.inputRecipient = document.getElementById('inputRecipient');
    this.inputSender = document.getElementById('inputSender');
    this.inputPhoto = document.getElementById('inputPhoto');
    this.inputMessage = document.getElementById('inputMessage');

    // DOM hiển thị trên thiệp
    this.domCoverRecipient = document.getElementById('coverRecipientName');
    this.domLetterRecipient = document.getElementById('letterRecipient');
    this.domLetterSender = document.getElementById('letterSender');
    this.domLetterContent = document.getElementById('letterContent');
    this.domPolaroidImg = document.getElementById('polaroidImg');

    // Mẫu lời chúc soạn sẵn theo đối tượng
    this.templates = {
      lover: {
        recipient: "Em Yêu Của Anh",
        sender: "Anh của em ❤️",
        photo: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
        message: "Gửi đến cô gái làm thế giới của anh trở nên rực rỡ nhất! Cảm ơn em vì đã luôn xuất hiện, mang lại nụ cười ngọt ngào và sự ấm áp dịu dàng. Chúc em ngày 20/10 thật hạnh phúc, xinh đẹp và được yêu thương nhiều hơn mỗi ngày. Yêu em vô cùng! 🌹✨"
      },
      mom: {
        recipient: "Mẹ Kính Yêu Của Con",
        sender: "Con của Mẹ 💐",
        photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        message: "Nhân ngày 20/10, con kính chúc Mẹ yêu luôn mạnh khỏe, bình an và luôn giữ nụ cười hạnh phúc trên môi. Con cảm ơn Mẹ vì tất cả sự hy sinh và tình yêu thương vô bờ bến dành cho gia đình. Con yêu Mẹ rất nhiều! 💖🌷"
      },
      sister: {
        recipient: "Chị Gái Xinh Đẹp",
        sender: "Em nhỏ của chị 🌸",
        photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
        message: "Chúc người chị tuyệt vời nhất của em một ngày 20/10 ngập tràn hoa và quà! Chúc chị luôn rạng ngời, thành công rực rỡ trong công việc, ăn thật ngon mà không béo và sớm tìm được một người thật lòng yêu thương chị nhé! 🎉🍰"
      },
      friend: {
        recipient: "Cô Bạn Tuyệt Vời",
        sender: "Một người bạn quý mến ☕",
        photo: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
        message: "Chúc mừng ngày Phụ nữ Việt Nam 20/10! Chúc bạn luôn tự tin, kiêu hãnh và rực rỡ như một đóa hoa hướng dương. Chúc mọi dự định của bạn đều thành công rực rỡ và luôn ngập tràn may mắn mỗi ngày! 🌻✨"
      }
    };

    // Dữ liệu mặc định
    this.defaultData = {
      recipient: "Người Phụ Nữ Tuyệt Vời Nhất",
      sender: "Người luôn yêu quý bạn ❤️",
      photo: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
      message: "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn luôn giữ trên môi nụ cười rạng rỡ như những đóa hoa sớm mai. Chúc bạn luôn an yên, tự tin theo đuổi mọi ước mơ, mỗi ngày trôi qua đều ngập tràn niềm vui, may mắn và luôn được trân trọng, chở che bằng tất cả sự chân thành nhất! ✨🌸"
    };

    this.init();
  }

  init() {
    this.initEvents();
    this.loadFromURL();
  }

  initEvents() {
    // Mở và đóng Panel
    this.openBtn?.addEventListener('click', () => this.openPanel());
    this.shareBtn?.addEventListener('click', () => this.openPanel());
    this.closeBtn?.addEventListener('click', () => this.closePanel());
    this.backdrop?.addEventListener('click', () => this.closePanel());

    // Bấm vào khung ảnh Polaroid cũng mở panel để đổi ảnh
    this.polaroidFrame?.addEventListener('click', () => {
      this.openPanel();
      this.inputPhoto?.focus();
    });

    // Lắng nghe thay đổi Input Real-time
    this.inputRecipient?.addEventListener('input', () => this.syncToCard());
    this.inputSender?.addEventListener('input', () => this.syncToCard());
    this.inputPhoto?.addEventListener('input', () => this.syncToCard());
    this.inputMessage?.addEventListener('input', () => this.syncToCard());

    // Nút chọn mẫu lời chúc nhanh
    document.querySelectorAll('.template-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-template');
        if (this.templates[key]) {
          this.applyTemplate(this.templates[key]);
        }
      });
    });

    // Nút sao chép link
    this.copyShareUrlBtn?.addEventListener('click', () => this.copyShareLink());

    // Nút đặt lại ban đầu
    this.resetBtn?.addEventListener('click', () => {
      this.applyTemplate(this.defaultData);
      window.location.hash = '';
      this.showToast("Đã khôi phục nội dung mặc định!");
    });
  }

  openPanel() {
    this.panel?.classList.add('active');
    this.backdrop?.classList.add('active');
    this.panel?.setAttribute('aria-hidden', 'false');
  }

  closePanel() {
    this.panel?.classList.remove('active');
    this.backdrop?.classList.remove('active');
    this.panel?.setAttribute('aria-hidden', 'true');
  }

  // Đồng bộ từ ô nhập sang giao diện thiệp
  syncToCard() {
    const recipient = this.inputRecipient.value.trim() || this.defaultData.recipient;
    const sender = this.inputSender.value.trim() || this.defaultData.sender;
    const photo = this.inputPhoto.value.trim() || this.defaultData.photo;
    const message = this.inputMessage.value.trim() || this.defaultData.message;

    if (this.domCoverRecipient) this.domCoverRecipient.textContent = recipient;
    if (this.domLetterRecipient) this.domLetterRecipient.textContent = `${recipient},`;
    if (this.domLetterSender) this.domLetterSender.textContent = sender;
    if (this.domLetterContent) this.domLetterContent.textContent = message;
    if (this.domPolaroidImg && photo) {
      this.domPolaroidImg.src = photo;
    }
  }

  // Áp dụng mẫu
  applyTemplate(data) {
    this.inputRecipient.value = data.recipient;
    this.inputSender.value = data.sender;
    this.inputPhoto.value = data.photo;
    this.inputMessage.value = data.message;
    this.syncToCard();
    this.showToast(`Đã áp dụng mẫu: ${data.recipient}!`);
  }

  // Mã hóa dữ liệu UTF-8 an toàn sang chuỗi Base64
  encodeData(data) {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  // Giải mã Base64 sang dữ liệu UTF-8 an toàn
  decodeData(base64Str) {
    try {
      const binary = atob(base64Str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Không thể giải mã dữ liệu URL:", e);
      return null;
    }
  }

  // Tải dữ liệu từ URL khi trang web được mở
  loadFromURL() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#data=')) {
      const encoded = hash.replace('#data=', '');
      const parsedData = this.decodeData(encoded);
      if (parsedData) {
        this.applyTemplate(parsedData);
        return;
      }
    }
    // Nếu không có param thì nạp dữ liệu mặc định vào form
    this.inputRecipient.value = this.defaultData.recipient;
    this.inputSender.value = this.defaultData.sender;
    this.inputPhoto.value = this.defaultData.photo;
    this.inputMessage.value = this.defaultData.message;
  }

  // Tạo và sao chép link chia sẻ vào Clipboard
  async copyShareLink() {
    const currentData = {
      recipient: this.inputRecipient.value.trim() || this.defaultData.recipient,
      sender: this.inputSender.value.trim() || this.defaultData.sender,
      photo: this.inputPhoto.value.trim() || this.defaultData.photo,
      message: this.inputMessage.value.trim() || this.defaultData.message
    };

    const encoded = this.encodeData(currentData);
    const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      this.showToast("✨ Đã sao chép link thiệp vào bộ nhớ tạm!");
      // Cập nhật lại hash URL trình duyệt mà không reload
      window.history.replaceState(null, '', `#data=${encoded}`);
    } catch (err) {
      // Fallback nếu trình duyệt chặn quyền clipboard
      prompt("Sao chép liên kết dưới đây để gửi cho người ấy:", shareUrl);
    }
  }

  // Hiển thị thông báo Toast nhanh
  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Khởi tạo instance toàn cục
window.customizer = new CardCustomizer();
