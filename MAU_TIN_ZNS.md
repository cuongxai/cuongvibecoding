# Mẫu tin Zalo ZNS — Xác nhận đặt bàn Lil'Sago

Mẫu này dùng để nộp duyệt trong mục **Zalo Notification Service** trên trang quản trị Zalo OA.
Zalo chỉ duyệt mẫu **Giao dịch (Transaction)** nếu nội dung **thuần thông tin giao dịch** — không
được chèn khuyến mãi, không dùng từ ngữ quảng cáo ("giảm giá", "ưu đãi", link ngoài không liên
quan...). Mẫu dưới đây tuân theo đúng nguyên tắc đó.

---

## 1. Thông tin khai báo khi tạo mẫu

| Trường | Giá trị đề xuất |
|---|---|
| Tên mẫu (nội bộ) | `Xac nhan dat ban - LilSago` |
| Loại mẫu | **Giao dịch** (Transaction) — *không chọn "Quảng cáo"* |
| Ứng dụng/tính năng liên quan | Đặt bàn nhà hàng qua website |

## 2. Nội dung mẫu tin (điền vào ô "Nội dung mẫu" khi tạo)

```
Xin chào {{customer_name}},

Lil'Sago đã nhận yêu cầu đặt bàn của bạn:

📅 Ngày: {{date}}
🕒 Giờ: {{time}}
👥 Số khách: {{guests}}
📍 Nhà hàng: {{restaurant_name}}

Nhà hàng sẽ gọi xác nhận trong ít phút. Hẹn gặp bạn tại Lil'Sago!

Hotline hỗ trợ: {{hotline}}
```

> Giữ nguyên dấu `{{ }}` — đây là cú pháp tham số (param) của Zalo, khi tạo mẫu hệ thống sẽ tự
> nhận diện và cho khai báo từng tham số riêng.

## 3. Danh sách tham số (param) cần khai báo

| Tên tham số | Kiểu | Ví dụ giá trị | Ghi chú |
|---|---|---|---|
| `customer_name` | Chuỗi | Nguyễn Văn A | Tên khách, lấy từ ô "Họ tên" trên form |
| `date` | Chuỗi | 05/08/2026 | Ngày đặt bàn |
| `time` | Chuỗi | 18:30 | Khung giờ khách chọn |
| `guests` | Số | 4 | Số khách |
| `restaurant_name` | Chuỗi | Lil'Sago - 299 Võ Văn Tần | Cố định, chỉ có 1 chi nhánh hiện tại |
| `hotline` | Chuỗi | 0908 101 015 | Cố định |

## 4. Nút bấm đề xuất (tối đa 2 nút, tuỳ chọn)

| Nút | Loại | Giá trị |
|---|---|---|
| 📞 Gọi nhà hàng | Gọi điện (Phone) | `0908101015` |
| 📍 Xem bản đồ | Mở liên kết (URL) | `https://www.google.com/maps/search/?api=1&query=Lil%27Sago+299+Vo+Van+Tan+Quan+3` |

## 5. Lưu ý để dễ được duyệt

- **Không** thêm bất kỳ dòng nào mang tính quảng cáo/khuyến mãi (kể cả "ưu đãi hôm nay", "giảm giá") — nếu muốn gửi khuyến mãi, phải làm **mẫu riêng thuộc loại "Quảng cáo"** (duyệt khó hơn, khách phải đã tương tác OA).
- Nội dung phải khớp *chính xác* với việc "khách vừa đặt bàn qua website" — đúng với thực tế sử dụng, không mô tả sai mục đích.
- Giữ câu ngắn gọn, đúng giọng thương hiệu (ấm áp, không "ngon nhất/số 1").
- Sau khi được duyệt, Zalo cấp **Template ID** — gửi lại Template ID này (và xác nhận tên tham số ở trên có bị Zalo đổi tên không) để cập nhật vào code Apps Script.

---

## 6. Khớp với code đã chuẩn bị sẵn

File `HUONG_DAN_DAT_BAN.md` (hàm `notifyZaloZNS`) đã được viết sẵn để gửi đúng 6 tham số ở mục 3.
Sau khi mẫu được duyệt, chỉ cần:

1. Điền `ZALO_TEMPLATE_ID` = Template ID Zalo cấp.
2. Nếu Zalo yêu cầu đổi tên tham số khác với đề xuất trên, báo lại để tôi sửa đúng tên trong
   `template_data` của Apps Script.

Không cần sửa gì ở phía website — dữ liệu `customer_name/date/time/guests` đã có sẵn từ form đặt bàn.
