# Website Lil'Sago · Hotpot & More

Landing page nhà hàng lẩu Lil'Sago, xây bằng **HTML/CSS/JS thuần** — không cần cài đặt, mở file là chạy. Nội dung & màu sắc theo Bộ nhận diện thương hiệu Lil'Sago (đỏ rượu `#7A1F2B` · kem ấm `#F7EEDF` · vàng kim `#C9A227` · than ấm `#2B2420`, font Be Vietnam Pro).

**Thông tin thật đã điền:** 299 Võ Văn Tần, P.5, Quận 3, TP.HCM 72420 · ☎ 0908 101 015 · 10:00–22:00 · Facebook: facebook.com/lilsago · 4.6★ (1.469 đánh giá Google).

## Cấu trúc

```
WEBSITE_CLAUDECODE/
├── index.html                # Trang chủ (landing page)
├── dat-ban.html               # Trang ĐẶT BÀN DUY NHẤT (vòng quay may mắn + lưới giờ)
├── css/styles.css             # Giao diện trang chủ & responsive
├── css/booking.css            # Giao diện trang đặt bàn
├── js/main.js                 # Thực đơn, chi nhánh, hiệu ứng (trang chủ)
├── js/booking.js              # Vòng quay, lưới giờ, VI/EN, gửi form đặt bàn
├── assets/img/                # Ảnh — xem LUU_ANH_VAO_DAY.md để biết ảnh nào còn thiếu
├── HUONG_DAN_DAT_BAN.md       # Nối form đặt bàn → Google Sheet + Telegram + Zalo ZNS
├── MAU_TIN_ZNS.md              # Mẫu tin xác nhận đặt bàn để nộp Zalo duyệt (ZNS)
└── README.md
```

> Mọi nút **"Đặt bàn"** trên toàn site đều dẫn tới `dat-ban.html` — đây là **nơi duy nhất** xử lý
> đặt bàn (trang chủ không còn form riêng). Trang có vòng quay may mắn thật, lưới chọn khung giờ
> (10:00–19:45, bước 15 phút), chọn số khách, chuyển VI/EN, đèn chạy khi quay và pháo hoa khi trúng.

## Cách chạy

- Nhấp đúp vào `index.html` để mở bằng trình duyệt, **hoặc**
- Chạy máy chủ tĩnh để trải nghiệm tốt hơn:

```bash
python -m http.server 8000
```

Rồi mở http://localhost:8000

## Tự động hoá sau khi khách đặt bàn

Khi khách bấm "Đặt bàn ngay", website gọi một Google Apps Script Web App duy nhất để:

1. **Ghi vào Google Sheet** — lưu trữ toàn bộ đơn đặt bàn
2. **Báo quản lý qua Telegram** — tin nhắn tức thì vào nhóm quản lý
3. **Báo khách qua Zalo ZNS** — xác nhận đặt bàn thành công gửi thẳng Zalo khách (cần nhà hàng đã có Zalo OA + ZNS được duyệt)

Xem hướng dẫn chi tiết từng bước tại **[HUONG_DAN_DAT_BAN.md](HUONG_DAN_DAT_BAN.md)**. Sau khi có
URL Web App, dán vào `CONFIG.BOOKING_ENDPOINT` trong `js/booking.js`.

## Các phần đã có

- Header cố định + menu mobile (đổi màu khi cuộn), logo thật nền trong suốt
- Hero: "Hợp vị, vui bàn" + trục chiến lược 11 năm / 6 vị lẩu
- 4 điểm nổi bật (6 vị · bò thật · nhận nhóm/sinh nhật · 11 năm)
- **6 vị lẩu đặc trưng** (Kim chi, Chua cay, Trường Thọ, Tứ Xuyên, Tomyum, Măng chua)
- Món thả lẩu có lọc danh mục (Bò / Hải sản / Rau & nấm / Cơm & thêm) — 6/18 món đã có ảnh thật
- **Set menu** (Tinh Hoa / Tinh Tuý / Tinh Tú Lẩu) với ảnh banner thật
- **Đi nhóm & chọn món** (2 / 4 / 6 / 10+ người) — theo trụ nội dung của brand
- Ưu đãi + banner Vòng quay may mắn dẫn tới trang đặt bàn
- Giới thiệu 11 năm + số liệu có nguồn thật, ảnh tiệc sinh nhật thật
- Địa chỉ thật + link & nhúng Google Maps
- **Trang đặt bàn riêng** (`dat-ban.html`): vòng quay ảnh thật, đèn chạy khi quay, pháo hoa khi trúng, lưới giờ, VI/EN
- Tuyển dụng (có khung ảnh đội ngũ), Footer với 4 mạng xã hội (icon SVG), Cookie banner, nút "Đặt bàn" nổi
- Favicon + ảnh chia sẻ mạng xã hội (og:image)

## Tuân theo giọng nói thương hiệu

- Gọi là **"nhà hàng"**, không gọi "quán".
- Không dùng "ngon nhất / số 1 / siêu phẩm".
- Mọi con số đều có nguồn thật (11 năm từ 2015; 4.6★ 1.469 review Google).
- CTA nhẹ nhàng, kèm điều kiện ngắn (ví dụ ưu đãi nhóm 4 tặng bò 99K).

## Còn thiếu ảnh gì?

Xem danh sách đầy đủ tại **[assets/img/LUU_ANH_VAO_DAY.md](assets/img/LUU_ANH_VAO_DAY.md)** — gồm
6 vị lẩu, 12 món thực đơn, ảnh mặt tiền, ảnh đội ngũ. Cứ up đúng tên file là ảnh tự hiện, không cần sửa code.

## Lưu ý khi chỉnh sửa

- File CSS/JS được đánh version (`?v=3`) để tránh trình duyệt cache bản cũ — mỗi lần bạn (hoặc AI)
  sửa `styles.css`/`main.js`/`booking.css`/`booking.js`, nhớ tăng số version trong `<link>`/`<script>`
  tương ứng ở `index.html`/`dat-ban.html`.
- Ảnh cũng nên cache-bust (`?v=`) nếu bạn thay nội dung một file đã tồn tại (như đã làm với `logo.png`).
