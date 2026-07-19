# Kho đề thô (de-bai/)

Nơi chứa file đề gốc (PDF, DOCX, kể cả PDF scan) trước khi được chuyển
thành câu hỏi trong game. Kho chia làm **2 mục độc lập**:

```
de-bai/
├── toan/          ← đề TOÁN
└── tieng-viet/    ← đề TIẾNG VIỆT
```

## Quy trình nạp đề vào game

1. **Bỏ file đề vào đúng mục** (`toan/` hoặc `tieng-viet/`).
2. **Nhờ Claude Code phân loại và nạp**, ví dụ:

   > Đọc các file mới trong de-bai/, trích từng câu hỏi, phân loại
   > (gán topic và độ khó 1/2 theo tiêu chí dưới đây) rồi thêm vào
   > đúng phần TOÁN / TIẾNG VIỆT của QUESTION_BANK trong questions.js.
   > Câu nào chưa có 4 đáp án thì tự viết thêm đáp án nhiễu hợp lý
   > và gợi ý cho từng đáp án sai. Câu nào CÙNG DẠNG với câu đã có
   > trong ngân hàng hoặc với generator toán (chỉ khác số liệu) thì
   > BỎ QUA không nạp. Nạp xong chạy `node tools/validate.js` và sửa
   > cho hết lỗi.

3. **Chạy bộ kiểm tra**: `node tools/validate.js` — phải báo ✅ mới được commit.
4. **Duyệt lại nội dung bằng mắt** (bắt buộc với tài liệu dạy trẻ) rồi commit.

## Quy tắc chống trùng câu

Khi nạp đề mới, mỗi câu ứng viên phải so với nội dung đã có:

- **Cùng dạng, chỉ khác số liệu** (ví dụ "Tính 15 + 3 × 4" khi ngân hàng
  đã có "Tính 20 + 5 × 6") → **bỏ qua, không nạp**. Với toán, các dạng
  trong bảng `MATH_GENERATORS` (đầu `questions.js`, mục 3) đã được
  generator tự sinh vô hạn biến thể số, nên câu tĩnh cùng dạng là thừa.
- **Cùng chủ đề nhưng khác cách hỏi / khác ngữ liệu** (câu văn khác,
  thành ngữ khác, dạng bài khác) → nạp bình thường, càng nhiều càng tốt.

`tools/validate.js` tự động hóa việc này: che mọi con số thành `#` rồi
so khuôn câu hỏi + bộ đáp án giữa các câu với nhau và với đề mẫu do
generator sinh ra; đồng thời kiểm tra schema (id duy nhất, đúng 1 đáp
án đúng, không có đáp án trùng nhau...). Có lỗi là script thoát mã 1.

Game tự dùng câu mới ngay: mỗi lượt chơi, phòng chọn ngẫu nhiên câu
trong topic của nó, đã lọc theo chế độ (Cơ Bản chỉ lấy câu độ khó 1,
Thử Thách lấy tất cả). Câu toán tĩnh cùng topic với generator được
trộn ngẫu nhiên 50/50 với đề generator.

## Tiêu chí gán nhãn độ khó

| Nhãn | Ý nghĩa | Ví dụ |
|------|---------|-------|
| `difficulty: 1` | Bám sát chuẩn kiến thức lớp 3 | bảng nhân/chia, chu vi, diện tích, xem giờ, gấp một số lên nhiều lần, từ chỉ đặc điểm, kiểu câu |
| `difficulty: 2` | Toán tư duy / bồi dưỡng HSG | tổng-hiệu, tổng-tỉ, phép toán tự định nghĩa, suy luận ngược nhiều bước |

## Gán topic

- Ưu tiên dùng topic có sẵn (danh sách đầy đủ ở đầu `questions.js`,
  mục 3) để câu hỏi tự xuất hiện trong các phòng tương ứng.
- Câu không khớp topic nào thì tạo topic mới (tên kebab-case, ví dụ
  `tu-trai-nghia`), sau đó khai báo phòng sử dụng topic đó trong
  `ROOM_PUZZLES` ở `index.html`.
