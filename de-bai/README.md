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

   > Đọc các file mới trong de-bai/ và nạp vào questions.js theo kiến
   > trúc dạng bài:
   > - Đề TOÁN: quy mỗi câu về DẠNG và tra bảng MATH_SPECS. Dạng đã có
   >   (đề chỉ khác số liệu/lời văn) thì BỎ QUA, nhiều nhất là nối thêm
   >   nguồn vào trường source của spec. Dạng chưa có thì viết generator
   >   mới (đủ 2 mức độ khó, đáp án nhiễu mô phỏng lỗi sai điển hình)
   >   kèm spec có ví dụ gốc và note biến đổi.
   > - Đề TIẾNG VIỆT: kiểu bài khớp khuôn có sẵn trong TV_TEMPLATES thì
   >   chỉ thêm dòng ngữ liệu vào TV_MATERIALS (id duy nhất, difficulty
   >   1/2); ngữ liệu trùng với dòng đã có thì bỏ qua. Kiểu bài mới thì
   >   thêm khuôn + ngữ liệu, và khai báo phòng dùng topic đó trong
   >   ROOM_PUZZLES ở index.html.
   > Nạp xong chạy `node tools/validate.js` và sửa cho hết lỗi.

3. **Chạy bộ kiểm tra**: `node tools/validate.js` — phải báo ✅ mới được commit.
4. **Duyệt lại nội dung bằng mắt** (bắt buộc với tài liệu dạy trẻ) rồi commit.

## Ngân hàng là DẠNG BÀI, không phải câu rời

- **Toán**: đơn vị của ngân hàng là *dạng* (`MATH_SPECS` + generator).
  Game tự sinh vô hạn biến thể số theo độ khó, nên 100 đề cùng dạng chỉ
  đóng góp đúng 1 mục. Đề mới cùng dạng chỉ khác số → **bỏ qua, không nạp**.
- **Tiếng Việt**: không sinh ngẫu nhiên được (cần ngữ liệu thật đã kiểm
  chứng), nên đơn vị là *khuôn* (`TV_TEMPLATES`, viết 1 lần) + *ngữ liệu*
  (`TV_MATERIALS`). Nạp đề = thêm ngữ liệu; càng nhiều ngữ liệu càng tốt,
  chỉ bỏ qua khi trùng ngữ liệu đã có.
- Câu đặc biệt không tổng quát hóa được → `STATIC_QUESTIONS`.
- `QUESTION_BANK` được biên dịch tự động từ các phần trên — không sửa tay.

`tools/validate.js` là lưới an toàn: bắt dạng toán thiếu spec, ngữ liệu
mồ côi không có khuôn, và câu "cùng dạng chỉ khác số" lọt vào ngân hàng
(che mọi con số thành `#` rồi so khuôn câu hỏi + bộ đáp án giữa các câu
với nhau và với đề mẫu do generator sinh ra); kèm kiểm tra schema (id
duy nhất, đúng 1 đáp án đúng...). Có lỗi là script thoát mã 1.

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
  mục 3) để nội dung tự xuất hiện trong các phòng tương ứng.
- Kiểu bài không khớp topic nào thì tạo topic mới (tên kebab-case, ví
  dụ `tu-trai-nghia`): toán → generator + spec mới; tiếng Việt → khuôn
  + ngữ liệu mới. Sau đó khai báo phòng sử dụng topic đó trong
  `ROOM_PUZZLES` ở `index.html`.
