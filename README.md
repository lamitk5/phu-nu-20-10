# Vườn 20/10 — Hành trình lời chúc

Trang web chúc mừng Ngày Phụ nữ Việt Nam: bước vào vườn hoa tương tác 3D, đánh thức những đóa hoa, rồi mở thư cá nhân hóa.

## Cách mở
- Mở trực tiếp `index.html` trên trình duyệt, hoặc:
  ```bash
  npx serve .
  ```

## Hành trình
1. **Cổng vườn** — hero full-bleed, brand *Vườn 20/10*
2. **Vườn hoa 3D** — parallax chuột/gyro, chạm hoa để nở (3 đóa → phong thư hiện)
3. **Thư / thiệp** — mở thiệp 3D, polaroid, cơn mưa lời chúc

## Cấu trúc
- `index.html` — 3 stage + customizer
- `css/style.css` — design system sage/coral + motion
- `js/journey.js` — điều khiển hành trình & parallax vườn
- `js/card.js` — thiệp 3D
- `js/petals.js` — canvas cánh hoa
- `js/wishes.js` — viên nang lời chúc
- `js/audio.js` — nhạc hộp nhạc + SFX
- `js/customizer.js` — cá nhân hóa & link chia sẻ `#data=`
- `js/main.js` — bootstrap
