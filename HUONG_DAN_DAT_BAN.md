# Hướng dẫn: Tự động hoá đặt bàn — Sheet + Telegram + Zalo ZNS

Sau khi khách bấm **"Đặt bàn ngay"** trên `dat-ban.html`, website gửi dữ liệu tới **một** Google
Apps Script Web App duy nhất, script đó sẽ tự làm cả 3 việc:

1. ✅ Ghi thông tin đặt bàn vào **Google Sheet**
2. ✅ Nhắn **Telegram** báo quản lý có bàn đặt mới
3. ✅ Gửi **Zalo ZNS** báo khách đặt bàn thành công (theo mẫu tin đã được Zalo duyệt)

Miễn phí (Google Apps Script + Telegram Bot không tốn phí; Zalo ZNS tính phí theo tin nhắn gửi
theo bảng giá của Zalo). Không cần server riêng, dữ liệu do nhà hàng sở hữu hoàn toàn.

Thời gian làm: ~20–30 phút, chỉ cần làm 1 lần.

---

## Phần 1 — Google Sheet

### Bước 1.1 — Tạo Sheet

Vào https://sheets.google.com tạo bảng tính mới, đặt tên **"Đặt bàn Lil'Sago"**. Dòng đầu (hàng 1)
điền các tiêu đề cột theo đúng thứ tự:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Thời gian nhận | Họ tên | SĐT | Ngày | Giờ | Số khách | Vị lẩu/Quà quay | Ghi chú | Nhà hàng | Nguồn |

### Bước 1.2 — Mở Apps Script

Trong Sheet: menu **Tiện ích mở rộng → Apps Script**. Xoá code mẫu, dán toàn bộ code ở **Phần 4**
bên dưới vào (code đã gộp sẵn cả Sheet + Telegram + Zalo).

---

## Phần 2 — Telegram (báo quản lý)

### Bước 2.1 — Tạo Bot

1. Mở Telegram, tìm tài khoản **@BotFather**, nhắn `/newbot`.
2. Đặt tên bot (vd "LilSago Booking Bot") → BotFather trả về một **BOT TOKEN** dạng
   `123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. Copy lại token này.

### Bước 2.2 — Tạo nhóm cho quản lý & lấy CHAT ID

1. Tạo một nhóm Telegram (vd "Lil'Sago - Đặt bàn"), thêm quản lý nhà hàng vào.
2. Thêm bot vừa tạo vào nhóm này (tìm theo username của bot).
3. Gửi thử một tin nhắn bất kỳ vào nhóm (để bot "nhìn thấy" nhóm).
4. Mở trình duyệt, truy cập (thay `<TOKEN>` bằng token ở bước 2.1):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Tìm đoạn `"chat":{"id":-100xxxxxxxxxx, ...}` trong kết quả JSON — số đó (kể cả dấu trừ nếu có)
   chính là **CHAT ID**.

### Bước 2.3 — Điền vào code

Trong code Apps Script (Phần 4), điền vào:
```javascript
const TELEGRAM_BOT_TOKEN = "dán_token_ở_đây";
const TELEGRAM_CHAT_ID   = "dán_chat_id_ở_đây";
```

---

## Phần 3 — Zalo ZNS (báo khách hàng)

⚠️ Phần này **cần nhà hàng đã có Zalo OA (Official Account) và được Zalo duyệt dùng ZNS**
(Zalo Notification Service) với ít nhất 1 mẫu tin (template) đã duyệt. Nếu chưa có, tạm thời bỏ
qua phần này — Sheet + Telegram vẫn hoạt động bình thường.

### Bước 3.1 — Lấy App ID & Secret Key

1. Vào https://developers.zalo.me → đăng nhập bằng tài khoản quản trị OA.
2. Vào **Ứng dụng** của OA (nếu chưa có app nào gắn với OA để dùng ZNS, tạo mới theo hướng dẫn
   của Zalo — cần OA đã được duyệt ZNS trước).
3. Vào **Cài đặt ứng dụng** → lấy **App ID** và **Secret Key**.

### Bước 3.2 — Nộp mẫu tin & lấy Template ID

Đã soạn sẵn nội dung mẫu tin xác nhận đặt bàn (đúng chuẩn Zalo dễ duyệt, loại Giao dịch) tại
**[MAU_TIN_ZNS.md](MAU_TIN_ZNS.md)** — copy nội dung đó vào mục **Zalo Notification Service** trong
trang quản trị OA để nộp duyệt.

Sau khi Zalo duyệt → vào danh sách mẫu đã duyệt → copy **Template ID**. Code ở Phần 4 đã được viết
sẵn khớp đúng 6 tham số trong mẫu (`customer_name`, `date`, `time`, `guests`, `restaurant_name`,
`hotline`).

> 📌 Nếu Zalo yêu cầu đổi tên tham số khác với đề xuất trong MAU_TIN_ZNS.md, báo lại để tôi sửa
> đúng tên field trong `template_data` — mỗi mẫu tin có thể bị Zalo chỉnh lại cấu trúc khi duyệt.

### Bước 3.3 — Lấy Access Token & Refresh Token lần đầu (làm 1 lần)

Đây là bước xác thực OAuth cần đăng nhập thủ công bằng tài khoản quản trị OA — không thể tự động
hoá hoàn toàn:

1. Trong app Zalo Developers, vào **Cấu hình OAuth**, thêm một **Redirect URI** bất kỳ bạn kiểm
   soát được (vd `https://localhost/callback` — không cần server thật chạy ở đó, chỉ cần đọc được
   URL sau khi trình duyệt chuyển hướng).
2. Truy cập URL sau (thay `APP_ID` và `REDIRECT_URI` đã đăng ký):
   ```
   https://oauth.zaloapp.com/v4/oa/permission?app_id=APP_ID&redirect_uri=REDIRECT_URI
   ```
3. Đăng nhập, bấm **Đồng ý cấp quyền**. Trình duyệt sẽ chuyển tới `REDIRECT_URI?code=xxxxx` —
   copy giá trị `code` trên thanh địa chỉ (dù trang báo lỗi "không kết nối được" vẫn lấy được `code`
   từ URL).
4. Gọi API đổi `code` lấy token (dùng Postman, hoặc dán vào tab Console của trình duyệt bằng
   `fetch`, hoặc dùng lệnh `curl`):
   ```
   POST https://oauth.zaloapp.com/v4/oa/access_token
   Header: secret_key: <SECRET_KEY>
   Body (x-www-form-urlencoded):
     code=<CODE_VỪA_LẤY>
     app_id=<APP_ID>
     grant_type=authorization_code
   ```
5. Kết quả trả về `access_token` và `refresh_token` — copy **refresh_token**.

### Bước 3.4 — Điền vào code

```javascript
const ZALO_APP_ID      = "dán_app_id";
const ZALO_SECRET_KEY  = "dán_secret_key";
const ZALO_TEMPLATE_ID = "dán_template_id_đã_duyệt";
const ZALO_REFRESH_TOKEN = "dán_refresh_token_lấy_ở_bước_3.3";
```

Code sẽ **tự làm mới access_token** mỗi khi hết hạn (lưu vào Script Properties), bạn không cần lặp
lại bước 3.3 trừ khi refresh_token bị thu hồi.

---

## Phần 4 — Code Apps Script đầy đủ (dán vào Bước 1.2)

```javascript
// ============================================================
// Lil'Sago — Nhận đặt bàn: Google Sheet + Telegram + Zalo ZNS
// ============================================================

const TELEGRAM_BOT_TOKEN  = ""; // Phần 2
const TELEGRAM_CHAT_ID    = ""; // Phần 2

const ZALO_APP_ID         = ""; // Phần 3
const ZALO_SECRET_KEY     = ""; // Phần 3
const ZALO_TEMPLATE_ID    = ""; // Phần 3
const ZALO_REFRESH_TOKEN  = ""; // Phần 3 (chỉ cần điền lần đầu, code tự làm mới sau đó)

function doPost(e) {
  const p = e.parameter;
  try {
    // 1) Ghi vào Google Sheet — luôn chạy trước, không phụ thuộc Telegram/Zalo
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      p.name || "", p.phone || "", p.date || "", p.time || "",
      p.guests || "", p.flavor || p.prize || "", p.note || "",
      p.restaurant || "Lil'Sago - 299 Võ Văn Tần", p.source || ""
    ]);
  } catch (err) {
    return jsonOut({ ok: false, step: "sheet", error: String(err) });
  }

  // 2) Báo quản lý qua Telegram — lỗi ở đây KHÔNG được làm hỏng cả luồng
  try {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) notifyTelegram(p);
  } catch (err) {
    console.error("Telegram error: " + err);
  }

  // 3) Báo khách qua Zalo ZNS — lỗi ở đây cũng KHÔNG được làm hỏng cả luồng
  try {
    if (ZALO_APP_ID && ZALO_SECRET_KEY && ZALO_TEMPLATE_ID) notifyZaloZNS(p);
  } catch (err) {
    console.error("Zalo error: " + err);
  }

  return jsonOut({ ok: true });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function notifyTelegram(p) {
  const text =
    "🍲 <b>ĐẶT BÀN MỚI — Lil'Sago</b>\n" +
    "👤 Tên: " + esc(p.name) + "\n" +
    "📞 SĐT: " + esc(p.phone) + "\n" +
    "📅 Ngày: " + esc(p.date) + "   🕒 Giờ: " + esc(p.time) + "\n" +
    "👥 Số khách: " + esc(p.guests) + "\n" +
    "🍜 Vị lẩu / Quà quay: " + esc(p.flavor || p.prize) + "\n" +
    "📝 Ghi chú: " + esc(p.note);

  // Ép chuyển thành byte UTF-8 rõ ràng — nếu không, tiếng Việt có dấu sẽ bị lỗi
  // font (?, �) do UrlFetchApp encode chuỗi bằng Latin-1 khi payload là string thường.
  const payloadJson = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: "HTML" });
  UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
    method: "post",
    contentType: "application/json; charset=UTF-8",
    payload: Utilities.newBlob(payloadJson, "application/json; charset=UTF-8").getBytes(),
    muteHttpExceptions: true
  });
}
function esc(v) { return v ? String(v) : "-"; }

function getZaloAccessToken() {
  const props = PropertiesService.getScriptProperties();
  const cached = props.getProperty("ZALO_ACCESS_TOKEN");
  const cachedExp = Number(props.getProperty("ZALO_ACCESS_TOKEN_EXP") || 0);
  if (cached && Date.now() < cachedExp) return cached;

  const refreshToken = props.getProperty("ZALO_REFRESH_TOKEN") || ZALO_REFRESH_TOKEN;
  const res = UrlFetchApp.fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "post",
    headers: { secret_key: ZALO_SECRET_KEY },
    payload: { app_id: ZALO_APP_ID, grant_type: "refresh_token", refresh_token: refreshToken },
    muteHttpExceptions: true
  });
  const data = JSON.parse(res.getContentText());
  if (!data.access_token) throw new Error("Không lấy được Zalo access_token: " + res.getContentText());

  props.setProperty("ZALO_ACCESS_TOKEN", data.access_token);
  props.setProperty("ZALO_ACCESS_TOKEN_EXP", String(Date.now() + (Number(data.expires_in || 3600) - 60) * 1000));
  if (data.refresh_token) props.setProperty("ZALO_REFRESH_TOKEN", data.refresh_token);
  return data.access_token;
}

function notifyZaloZNS(p) {
  const accessToken = getZaloAccessToken();
  const payload = {
    phone: normalizePhone(p.phone),
    template_id: ZALO_TEMPLATE_ID,
    template_data: {
      // 6 tham số này khớp với mẫu tin đã soạn trong MAU_TIN_ZNS.md.
      // Nếu Zalo duyệt và đổi tên tham số khác đi, sửa lại tên field (bên trái dấu :) cho khớp.
      customer_name: p.name || "",
      date: p.date || "",
      time: p.time || "",
      guests: p.guests || "",
      restaurant_name: p.restaurant || "Lil'Sago - 299 Võ Văn Tần",
      hotline: "0908 101 015"
    },
    tracking_id: "lilsago-" + new Date().getTime()
  };

  const payloadJson = JSON.stringify(payload);
  UrlFetchApp.fetch("https://business.openapi.zalo.me/message/template", {
    method: "post",
    contentType: "application/json; charset=UTF-8",
    headers: { access_token: accessToken },
    payload: Utilities.newBlob(payloadJson, "application/json; charset=UTF-8").getBytes(),
    muteHttpExceptions: true
  });
}

function normalizePhone(phone) {
  // Zalo cần định dạng 84xxxxxxxxx (bỏ số 0 đầu, không dấu cách/gạch ngang)
  let p = String(phone || "").replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "84" + p.slice(1);
  else if (!p.startsWith("84")) p = "84" + p;
  return p;
}
```

---

## Phần 5 — Triển khai Web App

1. Trong Apps Script: **Triển khai → Bản triển khai mới** (Deploy → New deployment).
2. Chọn loại **Ứng dụng web (Web app)**.
3. Thiết lập:
   - **Thực thi với tư cách:** Tôi (chính bạn)
   - **Ai có quyền truy cập:** **Bất kỳ ai** ← quan trọng, nếu không website sẽ không gọi được
4. Bấm **Triển khai**, cho phép quyền khi Google hỏi (sẽ hỏi quyền truy cập Sheet + gửi request
   ra ngoài — đây là quyền cần thiết để gọi Telegram/Zalo).
5. Copy **URL Web App** (`https://script.google.com/macros/s/AKfy...../exec`).

## Phần 6 — Dán URL vào website

Mở file `js/booking.js`, tìm phần đầu:

```javascript
const CONFIG = {
  BOOKING_ENDPOINT: "" // ← dán URL Web App vào đây
};
```

Dán URL vừa copy vào giữa hai dấu ngoặc kép. Lưu lại.

## Phần 7 — Kiểm tra

1. Mở `dat-ban.html`, điền form và bấm **Đặt bàn ngay**.
2. Kiểm tra: Google Sheet có dòng mới ✅ / Nhóm Telegram có tin nhắn ✅ / Khách nhận được Zalo ✅.
3. Nếu có bước lỗi, mở Apps Script → **Lịch sử thực thi (Executions)** để xem log chi tiết.

---

## Ghi chú kỹ thuật

- Website gửi bằng `fetch(..., { mode: "no-cors" })` nên trình duyệt không đọc được phản hồi —
  form luôn báo "thành công" khi request gửi đi được; muốn biết chắc chắn có lỗi hay không, xem
  **Executions** trong Apps Script.
- 3 bước (Sheet/Telegram/Zalo) được viết **độc lập với nhau** trong `try/catch` riêng — nếu Zalo
  lỗi (vd sai Template ID) thì Sheet và Telegram vẫn chạy bình thường, không bị chặn theo.
- Khi `BOOKING_ENDPOINT` để trống, form chạy **chế độ demo** (chỉ hiện thông báo, không gửi đi).
- Sau khi sửa code Apps Script, nhớ tạo **Phiên bản mới** khi triển khai lại (Deploy → Manage
  deployments → Edit → New version), nếu không thay đổi sẽ không có hiệu lực dù URL không đổi.
- **Lỗi font tiếng Việt trong tin nhắn** (vd "Th?t b� n�i l?a" thay vì "Thịt bò núi lửa"): do
  `UrlFetchApp.fetch` encode chuỗi payload bằng Latin-1 khi payload là string thường. Khắc phục
  bằng cách ép `payload` thành mảng byte UTF-8 qua `Utilities.newBlob(json, "application/json;
  charset=UTF-8").getBytes()` — code ở Phần 4 đã áp dụng sẵn cho cả Telegram và Zalo.

## Phương án thay thế (không dùng Google Sheet)

- **Formspree** (https://formspree.io): tạo form, lấy endpoint dạng `https://formspree.io/f/xxxx`,
  dán vào `BOOKING_ENDPOINT`. Nhận đơn qua email, có gói miễn phí (không hỗ trợ sẵn Telegram/Zalo).
- **Hệ thống đặt bàn sẵn có:** nhà hàng đang dùng `booking.ipos.vn` (thấy trên Google). Có thể đổi
  nút "Đặt bàn" trỏ thẳng tới link iPOS thay vì dùng form này — báo mình nếu muốn làm cách này.
