/* =====================================================================
   questions.js - NGÂN HÀNG NỘI DUNG HỌC TẬP
   Game: Boo - Lạc Vào Thế Giới Phép Thuật (Toán & Tiếng Việt lớp 3)

   File này CHỈ chứa nội dung học tập, tách riêng khỏi engine game
   (index.html). Muốn thêm/sửa bài tập chỉ cần sửa file này.

   ---------------------------------------------------------------------
   1. KIẾN TRÚC NGÂN HÀNG: DẠNG BÀI, KHÔNG PHẢI CÂU RỜI

   TOÁN = DẠNG BÀI (generate vô hạn biến thể số):
   - MATH_SPECS      : metadata từng dạng - tên, ví dụ gốc, phạm vi số
                       theo độ khó, note cách biến đổi đề & đáp án nhiễu
   - MATH_GENERATORS : hàm sinh đề của từng dạng (nhận diff 1/2)
   Nạp đề toán mới:
   a. Tra MATH_SPECS xem dạng đã có chưa. ĐÃ CÓ (đề mới chỉ khác số
      liệu/lời văn) -> BỎ QUA, nhiều nhất là bổ sung ghi chú vào spec.
   b. Dạng CHƯA CÓ -> viết generator mới (đủ 2 mức độ khó, đáp án nhiễu
      mô phỏng lỗi sai điển hình) + thêm spec với ví dụ gốc làm mẫu.
   c. Câu đặc biệt không tổng quát hóa được -> cho vào STATIC_QUESTIONS.

   TIẾNG VIỆT = KHUÔN + NGỮ LIỆU (không generate được bằng random số,
   cần ngữ liệu thật đã kiểm chứng):
   - TV_TEMPLATES : khuôn câu hỏi của từng topic, viết đúng 1 lần
   - TV_MATERIALS : ngữ liệu (câu văn, thành ngữ, cặp chính tả...)
   Nạp đề tiếng Việt mới:
   a. Kiểu bài khớp khuôn có sẵn -> chỉ thêm dòng ngữ liệu vào
      TV_MATERIALS (nhớ id duy nhất + difficulty).
   b. Kiểu bài mới -> thêm khuôn vào TV_TEMPLATES + ngữ liệu, rồi khai
      báo phòng sử dụng topic đó trong ROOM_PUZZLES (index.html).

   QUESTION_BANK được BIÊN DỊCH TỰ ĐỘNG từ khuôn + ngữ liệu +
   STATIC_QUESTIONS ở cuối phần dữ liệu - KHÔNG sửa tay vào đó.

   Sau mỗi lần nạp: chạy `node tools/validate.js` (bắt câu trùng dạng,
   dạng thiếu spec, ngữ liệu mồ côi...), phải ✅ mới commit.

   ---------------------------------------------------------------------
   2. ĐỘ KHÓ VÀ CHẾ ĐỘ CHƠI
   - difficulty 1 = CƠ BẢN   : bám sát chuẩn kiến thức lớp 3
   - difficulty 2 = NÂNG CAO : toán tư duy / bồi dưỡng HSG
   Chế độ 🌱 Cơ Bản chỉ nạp ngữ liệu difficulty 1 và generator chạy
   mức dễ; chế độ 🔥 Thử Thách nạp tất cả và generator chạy mức khó.

   ---------------------------------------------------------------------
   3. TOPIC ĐANG ĐƯỢC CÁC PHÒNG SỬ DỤNG

   Tiếng Việt (khuôn + ngữ liệu):
   - Phòng 4  (Sân Sau)           : tu-chi-dac-diem-cau
   - Phòng 6  (Thư Viện)          : chinh-ta-s-x
   - Phòng 16 (Phòng Bùa Chú)     : chinh-ta-r-d-gi
   - Phòng 17 (Tháp Chuông)       : thanh-ngu-que-huong
   - Phòng 18 (Phòng Thư Pháp)    : ca-dao-tuc-ngu
   - Phòng 19 (Hành Lang Ký Tự)   : dau-cau
   - Phòng 20 (Vườn Ngữ Nghĩa)    : tu-chi-dac-diem-doan  (Boss phase 2 cũng dùng)
   - Phòng 21 (Điện Thơ Ca)       : so-sanh
   - Phòng 25 (Thư Phòng Ngôn Từ) : kieu-cau              (Boss phase 4 cũng dùng)

   Toán (dạng bài, sinh đề ngẫu nhiên):
   - Phòng 1: thu-tu-phep-tinh      - Phòng 3: nhan-roi-tru
   - Phòng 5: bang-nhan             - Phòng 7: chieu-rong-hcn
   - Phòng 10: phep-toan-la-1       - Phòng 11: tong-hieu
   - Phòng 12: tong-ti              - Phòng 13: chuyen-gap-ba
   - Phòng 14: tong-ti-hieu         - Phòng 15: phep-toan-la-2
   - Phòng 22: dien-tich-hcn        - Phòng 23: xem-gio
   - Phòng 24: chu-vi-hinh-vuong    - Phòng 26: tim-so-bi-chia

   ---------------------------------------------------------------------
   4. NẠP ĐỀ TỪ FILE PDF/DOCX (thư mục de-bai/)
   Kho đề thô chia 2 mục: de-bai/toan/ và de-bai/tieng-viet/.
   Quy trình chi tiết + quy tắc chống trùng: xem de-bai/README.md.
   Tóm tắt: toán quy về DẠNG (dạng có rồi -> bỏ qua), tiếng Việt bổ
   sung NGỮ LIỆU; xong chạy node tools/validate.js rồi duyệt bằng mắt.
   ===================================================================== */

/* ---------- Hàm tiện ích dùng chung ---------- */
function rInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { let a = [...arr]; for (let i = a.length-1;i>0;i--) { let j = rInt(0,i); [a[i],a[j]] = [a[j],a[i]]; } return a; }

/* =====================================================================
   PHẦN A: METADATA CÁC DẠNG TOÁN (MATH_SPECS)
   Mỗi dạng trong MATH_GENERATORS có đúng 1 spec ở đây. Khi nạp đề toán
   mới, tra bảng này trước: đề trùng dạng (chỉ khác số) -> bỏ qua.
   - name    : tên dạng, dễ đối chiếu với đề thô
   - example : ví dụ gốc kèm đáp án (giữ làm mẫu chuẩn của dạng)
   - levels  : phạm vi số liệu theo độ khó (1 = Cơ Bản, 2 = Thử Thách)
   - notes   : cách biến đổi đề + thiết kế đáp án nhiễu (mô phỏng lỗi
               sai điển hình của học sinh)
   - source  : nguồn đề đã quy về dạng này (nối thêm khi nạp đề trùng dạng)
   ===================================================================== */
const MATH_SPECS = {
    "thu-tu-phep-tinh": {
        name: "Thứ tự thực hiện phép tính: a + b × c",
        example: "15 + 3 × 4 = ? → 27 (nhân trước: 3×4=12, rồi cộng: 15+12=27)",
        levels: { 1: "a 10-30; b, c 2-5", 2: "a 15-50; b 2-9; c 3-9" },
        notes: "Nhiễu: lệch thừa số ±1 để bắt lỗi tính nhân ẩu. Có thể mở rộng thành a - b × c hoặc a + b : c nếu gặp đề dạng đó (khi ấy tạo dạng mới).",
        source: "Đề gốc của game"
    },
    "nhan-roi-tru": {
        name: "Bài toán hai bước: cần x nhóm × y đơn vị, đã có z, hỏi thiếu bao nhiêu",
        example: "Cần 8 nồi súp, mỗi nồi 10 con nhện, đã có 51 con → 8×10-51 = 29 con",
        levels: { 1: "3-5 nhóm × 4-9 đơn vị", 2: "3-8 nhóm × 8-15 đơn vị" },
        notes: "Nhiễu: quên trừ số đã có (ra tổng), trừ nhầm từ (x-1) nhóm, cộng ngược thêm y. Biến đổi: đổi bối cảnh (nồi súp/khay bánh/hộp bút) không tạo dạng mới.",
        source: "Đề gốc của game"
    },
    "bang-nhan": {
        name: "Dãy số cách đều theo bảng nhân, tìm số còn thiếu",
        example: "3, 6, __, 12, 15 → 9 (bảng nhân 3)",
        levels: { 1: "bảng nhân 2-5", 2: "bảng nhân 3-9" },
        notes: "Nhiễu: các số cùng bảng nhân nhưng sai vị trí. Biến đổi: đổi vị trí ô trống, đổi bảng nhân.",
        source: "Đề gốc của game"
    },
    "chieu-rong-hcn": {
        name: "Biết chu vi và chiều dài hình chữ nhật, tìm chiều rộng",
        example: "Chu vi 40m, dài 12m → 40:2-12 = 8m",
        levels: { 1: "nửa chu vi 8-15", 2: "nửa chu vi 10-30" },
        notes: "Nhiễu: quên chia đôi chu vi, dừng ở nửa chu vi, trả lời bằng chiều dài. Dạng ngược (biết rộng tìm dài) vẫn là dạng này.",
        source: "Đề gốc của game"
    },
    "phep-toan-la-1": {
        name: "Phép toán tự định nghĩa (một bước): a △ b = biểu thức của a, b",
        example: "a △ b = b×a+a+b; 5 △ 3 = 15+5+3 = 23",
        levels: { 1: "công thức 2 số hạng (a×b+a), số 2-9", 2: "công thức 3 số hạng (b×a+a+b), số 3-20" },
        notes: "Nhiễu: bỏ sót một số hạng của công thức. Mọi đề 'phép toán lạ' một bước đều quy về dạng này, chỉ khác công thức.",
        source: "Đề gốc của game"
    },
    "tong-hieu": {
        name: "Quan hệ hơn-kém (dễ) / tìm hai số biết tổng và hiệu (khó)",
        example: "Khó: tổng 2 thùng 500 lít, A hơn B 100 lít → A = (500+100):2 = 300",
        levels: { 1: "biết A và phần 'ít hơn', tìm B bằng phép trừ", 2: "tổng-hiệu chuẩn, số đến 3000" },
        notes: "Nhiễu: trả lời bằng tổng/hiệu/số kia. Đề hỏi số bé thay vì số lớn vẫn là dạng này.",
        source: "Đề gốc của game"
    },
    "tong-ti": {
        name: "Gấp một số lên nhiều lần (dễ) / tìm hai số biết tổng và tỉ (khó)",
        example: "Khó: tổng 36 bông, hồng gấp 3 lần cúc → cúc = 36:(3+1) = 9",
        levels: { 1: "biết B và tỉ lệ, tìm A = B × r", 2: "tổng-tỉ chuẩn, chia phần" },
        notes: "Nhiễu: nhầm 'gấp' thành cộng, trả lời nhầm số được hỏi, chia thiếu (tỉ+1) phần.",
        source: "Đề gốc của game"
    },
    "chuyen-gap-ba": {
        name: "So sánh lượng hai bể (dễ) / chuyển x đơn vị để bên này gấp k lần bên kia (khó)",
        example: "Khó: Jacky 40 lít, Emma 80 lít, chuyển x để Emma gấp 3 Jacky → (80+x)=3(40-x) → x=10",
        levels: { 1: "tìm phần chênh lệch giữa hai bể (phép trừ)", 2: "phương trình chuyển - toán tư duy" },
        notes: "Mức khó vượt chuẩn lớp 3, chỉ xuất hiện ở chế độ Thử Thách. Nhiễu mức khó: các số hạng trung gian của phép giải.",
        source: "Đề gốc của game"
    },
    "tong-ti-hieu": {
        name: "Biết B và tỉ lệ, tính hiệu (dễ) / biết tổng và tỉ, tính hiệu (khó)",
        example: "Khó: tổng 300, A gấp 2 lần B → B=100, A=200, A-B=100",
        levels: { 1: "B cho sẵn, A = k×B, tính A-B", 2: "phải tìm B từ tổng trước" },
        notes: "Là dạng tổng-tỉ nhưng câu hỏi chốt là HIỆU - nhiễu chính là đáp án của A, B, tổng để bắt lỗi đọc đề thiếu.",
        source: "Đề gốc của game"
    },
    "phep-toan-la-2": {
        name: "Phép toán tự định nghĩa lồng nhau: a ◇ (b ◇ c)",
        example: "a◇b = a×b-a-b+1; 4◇(3◇5) = 4◇8 = 21",
        levels: { 1: "một bước, không lồng, số 3-7", 2: "lồng hai bước, số 3-10" },
        notes: "Nhiễu: quên bước trong ngoặc, sai dấu công thức, bỏ '+1'. Khác phep-toan-la-1 ở tính lồng nhau.",
        source: "Đề gốc của game"
    },
    "dien-tich-hcn": {
        name: "Diện tích hình chữ nhật = dài × rộng",
        example: "Dài 12m, rộng 5m → 60 m²",
        levels: { 1: "dài 3-9, rộng 2-6", 2: "dài 7-16, rộng 4-11" },
        notes: "Nhiễu chủ lực: chu vi (kèm đơn vị m để bé học phân biệt m/m²), tổng dài+rộng.",
        source: "Đề gốc của game"
    },
    "xem-gio": {
        name: "Cộng khoảng thời gian vào giờ bắt đầu",
        example: "8 giờ 30 phút + 20 phút = 8 giờ 50 phút",
        levels: { 1: "phút bắt đầu = 30, cộng 10-20 phút, không tràn giờ", 2: "phút 15/30/45, cộng 15-45 phút, có thể tràn sang giờ mới" },
        notes: "Nhiễu: giữ nguyên giờ bắt đầu, lệch 1 giờ, giờ ngẫu nhiên. Biến đổi: đề trừ thời gian (hỏi giờ bắt đầu) sẽ là dạng mới.",
        source: "Đề gốc của game"
    },
    "chu-vi-hinh-vuong": {
        name: "Chu vi hình vuông = cạnh × 4",
        example: "Cạnh 6m → chu vi 24m",
        levels: { 1: "cạnh 3-9", 2: "cạnh 5-15" },
        notes: "Nhiễu chủ lực: diện tích cạnh×cạnh (kèm m²), cạnh+4, cạnh×2.",
        source: "Đề gốc của game"
    },
    "tim-so-bi-chia": {
        name: "Tìm số bị chia = số chia × thương + số dư",
        example: "Số chia 6, thương 9, dư 4 → 6×9+4 = 58",
        levels: { 1: "số chia 2-5, thương 3-9", 2: "số chia 3-8, thương 4-12" },
        notes: "Nhiễu: quên cộng dư, trừ dư, lệch một thương. Luôn giữ ràng buộc dư < số chia.",
        source: "Đề gốc của game"
    },
    /* Dạng riêng của trận boss (không gắn phòng thường) */
    "boss-1": {
        name: "Tổng hai tích: a × b + c × d",
        example: "5×3 + 4×2 = 23",
        levels: { 1: "thừa số 2-9", 2: "thừa số đến 20" },
        notes: "Nhiễu: lệch một thừa số ±1.",
        source: "Đề gốc của game"
    },
    "boss-3": {
        name: "Tìm hai số rồi lấy tích (dễ: biết tổng và 1 số; khó: biết tổng và hiệu)",
        example: "Khó: tổng 50, hiệu 10 → 30×20 = 600",
        levels: { 1: "tổng và một số cho sẵn, số 2-10", 2: "tổng-hiệu, số 10-60" },
        notes: "Nhiễu: trả lời bằng tổng, nhân sai một thừa số.",
        source: "Đề gốc của game"
    },
    "boss-5": {
        name: "Suy luận ngược tìm số bí ẩn qua chuỗi phép tính",
        example: "Khó: x×3+9 chia 2 trừ 4 được 8 → tính ngược x=5",
        levels: { 1: "2 bước (nhân rồi trừ)", 2: "4 bước (nhân, cộng, chia, trừ)" },
        notes: "Nhiễu: các giá trị trung gian của chuỗi tính ngược. Luôn ràng buộc chia hết ở bước chia.",
        source: "Đề gốc của game"
    }
};

/* =====================================================================
   PHẦN B: KHUÔN CÂU HỎI TIẾNG VIỆT (TV_TEMPLATES)
   Mỗi topic một khuôn, viết đúng 1 lần. build(m) nhận một dòng ngữ
   liệu từ TV_MATERIALS và trả về câu hỏi hoàn chỉnh
   {question, choices, correctIndex, wrongHints, explain}.
   ===================================================================== */
const TV_TEMPLATES = {
    "tu-chi-dac-diem-cau": {
        name: "Tìm từ chỉ đặc điểm trong một câu văn",
        build: m => ({
            question: `Trong câu: '${m.sentence}', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?`,
            choices: m.options,
            correctIndex: m.correctIndex,
            wrongHints: m.hints,
            explain: `'${m.options[m.correctIndex]}' là từ chỉ đặc điểm - ${m.why}.`
        })
    },
    "chinh-ta-s-x": {
        name: "Chọn cách viết đúng chính tả s/x",
        build: m => ({
            question: "Điền 's' hay 'x' - cách viết nào dưới đây <strong>ĐÚNG</strong> chính tả?",
            choices: [m.correct, m.wrong],
            correctIndex: 0,
            wrongHints: ["", `Sai! Viết đúng phải là: '${m.correct}'.`],
            explain: `Viết đúng chính tả là: '${m.correct}'.`
        })
    },
    "chinh-ta-r-d-gi": {
        name: "Tìm cụm từ viết đúng chính tả r/d/gi/l",
        build: m => ({
            question: "Trong bốn cụm từ dưới đây, cụm từ nào viết <strong>ĐÚNG</strong> chính tả?",
            choices: m.options,
            correctIndex: m.correctIndex,
            wrongHints: m.corrections.map(c => c ? `Sai! Viết đúng là '${c}'.` : ""),
            explain: `'${m.options[m.correctIndex]}' là cụm từ duy nhất viết đúng chính tả.`
        })
    },
    "thanh-ngu-que-huong": {
        name: "Tìm thành ngữ KHÔNG thuộc chủ đề quê hương",
        build: m => ({
            question: "Thành ngữ nào dưới đây <strong>KHÔNG</strong> nói về quê hương, đất nước?",
            choices: m.idioms,
            correctIndex: m.notIdx,
            wrongHints: m.idioms.map((_, i) => i === m.notIdx ? "" : "Đây LÀ thành ngữ về quê hương."),
            explain: `'${m.idioms[m.notIdx]}' nói về ${m.aboutWhat}, KHÔNG phải thành ngữ về quê hương.`
        })
    },
    "ca-dao-tuc-ngu": {
        name: "Điền từ còn thiếu vào câu ca dao, tục ngữ",
        build: m => ({
            question: `Điền từ còn thiếu vào câu: "${m.line}"`,
            choices: [m.answer, ...m.wrongs],
            correctIndex: 0,
            wrongHints: ["", ...m.wrongs.map(() => "Sai! Đây không phải câu gốc.")],
            explain: `Câu đúng: "${m.fullLine}"`
        })
    },
    "dau-cau": {
        name: "Tìm dấu chấm đặt sai vị trí trong đoạn văn",
        build: m => ({
            question: `"${m.passage}"<br>Hỏi dấu chấm số mấy bị đặt <strong>SAI</strong> vị trí?`,
            choices: ["Dấu chấm (1)", "Dấu chấm (2)", "Dấu chấm (3)", "Dấu chấm (4)"],
            correctIndex: m.wrongDot - 1,
            wrongHints: [1, 2, 3, 4].map(n => n === m.wrongDot ? "" : `Sai! Dấu chấm (${n}) đặt đúng vị trí.`),
            explain: m.explain
        })
    },
    "tu-chi-dac-diem-doan": {
        name: "Tìm từ chỉ đặc điểm trong đoạn văn",
        build: m => ({
            question: `Đoạn văn: "${m.passage}"<br>Trong các từ sau, từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?`,
            choices: m.options,
            correctIndex: m.correctIndex,
            wrongHints: m.options.map((opt, i) => i === m.correctIndex ? "" : `Sai! '${opt}' là từ chỉ sự vật.`),
            explain: `'${m.options[m.correctIndex]}' là từ chỉ đặc điểm (tính từ).`
        })
    },
    "so-sanh": {
        name: "Tìm cặp sự vật được so sánh trong câu thơ",
        build: m => ({
            question: `"${m.poem}"<br>Trong hai câu thơ trên, sự vật nào được <strong>so sánh</strong> với sự vật nào?`,
            choices: m.options,
            correctIndex: m.correctIndex,
            wrongHints: m.hints,
            explain: `Hình ảnh so sánh: ${m.options[m.correctIndex]} (có từ so sánh 'như').`
        })
    },
    "kieu-cau": {
        name: "Phân biệt kiểu câu: kể / hỏi / cảm / khiến",
        build: m => ({
            question: `Câu: <em>"${m.sentence}"</em><br>Đây là <strong>kiểu câu gì</strong>?`,
            choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
            correctIndex: m.correctIndex,
            wrongHints: m.hints,
            explain: `'${m.sentence}' là ${["câu cảm", "câu kể", "câu hỏi", "câu khiến"][m.correctIndex]} (${m.why}).`
        })
    }
};

/* =====================================================================
   PHẦN C: NGỮ LIỆU TIẾNG VIỆT (TV_MATERIALS)
   Nạp đề tiếng Việt = thêm dòng vào đây (id duy nhất, difficulty 1/2).
   Trường của mỗi dòng phải khớp với khuôn cùng topic ở PHẦN B.
   ===================================================================== */
const TV_MATERIALS = {
    "tu-chi-dac-diem-cau": [
        { id: "tv-001", difficulty: 1,
          sentence: "Những đám mây xám xịt đang bay lơ lửng trên bầu trời",
          options: ["Đám mây", "Xám xịt", "Lơ lửng"], correctIndex: 1,
          hints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ hoạt động/trạng thái."],
          why: "miêu tả màu sắc của đám mây" },
        { id: "tv-002", difficulty: 1,
          sentence: "Chú chó mực đen tuyền chạy nhanh thoăn thoắt trên sân",
          options: ["Chú chó", "Đen tuyền", "Thoăn thoắt"], correctIndex: 1,
          hints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ hoạt động."],
          why: "miêu tả màu lông của chú chó" },
        { id: "tv-003", difficulty: 1,
          sentence: "Chiếc lá vàng úa rơi nhẹ nhàng xuống mặt đất",
          options: ["Chiếc lá", "Vàng úa", "Nhẹ nhàng"], correctIndex: 1,
          hints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ cách thức của hành động rơi."],
          why: "miêu tả màu sắc của chiếc lá" },
        { id: "tv-004", difficulty: 1,
          sentence: "Dòng suối trong vắt chảy róc rách qua khe đá",
          options: ["Dòng suối", "Trong vắt", "Róc rách"], correctIndex: 1,
          hints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ âm thanh."],
          why: "miêu tả độ trong của dòng suối" },
        { id: "tv-005", difficulty: 1,
          sentence: "Bầu trời cao vời vợi điểm vài áng mây trắng muốt",
          options: ["Bầu trời", "Vời vợi", "Áng mây"], correctIndex: 1,
          hints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ sự vật."],
          why: "miêu tả độ cao của bầu trời" },
    ],
    "chinh-ta-s-x": [
        { id: "tv-006", difficulty: 1, correct: "sâu chuỗi, xuất hiện", wrong: "xâu chuỗi, suất hiện" },
        { id: "tv-007", difficulty: 1, correct: "sản xuất, xôn xao", wrong: "xản xuất, sôn sao" },
        { id: "tv-008", difficulty: 1, correct: "sung sướng, xinh xắn", wrong: "xung xướng, sinh sắn" },
        { id: "tv-009", difficulty: 1, correct: "sáng suốt, xán lạn", wrong: "xáng xuốt, sán lạn" },
    ],
    "chinh-ta-r-d-gi": [
        { id: "tv-010", difficulty: 1,
          options: ["Suối chảy dóc dách", "Nụ cười rạng rỡ", "Sức khỏe rẻo rai", "Tiếng cười ròn rã"],
          correctIndex: 1, corrections: ["róc rách", "", "dẻo dai", "giòn giã"] },
        { id: "tv-011", difficulty: 1,
          options: ["Hạt sương dung dinh", "Ánh nắng rực rỡ", "Ngày nghỉ rảnh dỗi", "Giọng nói rịu ràng"],
          correctIndex: 1, corrections: ["rung rinh", "", "rảnh rỗi", "dịu dàng"] },
        { id: "tv-012", difficulty: 1,
          options: ["Ánh đèn nung ninh", "Mặt trời dạng đông", "Hạt gạo dẻo thơm", "Em bé rễ thương"],
          correctIndex: 2, corrections: ["lung linh", "rạng đông", "", "dễ thương"] },
    ],
    "thanh-ngu-que-huong": [
        { id: "tv-013", difficulty: 1,
          idioms: ["Non xanh nước biếc", "Thức khuya dậy sớm", "Chôn rau cắt rốn", "Quê cha đất tổ"],
          notIdx: 1, aboutWhat: "sự chăm chỉ" },
        { id: "tv-014", difficulty: 1,
          idioms: ["Non sông gấm vóc", "Dám nghĩ dám làm", "Chôn rau cắt rốn", "Thẳng cánh cò bay"],
          notIdx: 1, aboutWhat: "đức tính mạnh dạn" },
        { id: "tv-015", difficulty: 1,
          idioms: ["Quê cha đất tổ", "Học một biết mười", "Non xanh nước biếc", "Chôn rau cắt rốn"],
          notIdx: 1, aboutWhat: "sự thông minh" },
    ],
    "ca-dao-tuc-ngu": [
        { id: "tv-016", difficulty: 1,
          line: "Công cha như ___, nghĩa mẹ như nước trong nguồn chảy ra.",
          answer: "núi Thái Sơn", wrongs: ["núi cao biển rộng", "cây đại thụ", "biển Đông"],
          fullLine: "Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra." },
        { id: "tv-017", difficulty: 1,
          line: "Anh em như thể ___, rách lành đùm bọc dở hay đỡ đần.",
          answer: "tay chân", wrongs: ["chân tay", "cá tôm", "ruột rà"],
          fullLine: "Anh em như thể tay chân, rách lành đùm bọc dở hay đỡ đần." },
        { id: "tv-018", difficulty: 1,
          line: "Nhiễu điều phủ lấy ___, người trong một nước phải thương nhau cùng.",
          answer: "giá gương", wrongs: ["tấm gương", "gương soi", "bức tranh"],
          fullLine: "Nhiễu điều phủ lấy giá gương, người trong một nước phải thương nhau cùng." },
    ],
    "dau-cau": [
        { id: "tv-019", difficulty: 1,
          passage: "Trong lâu đài, mỗi kẻ một việc(1). Lính canh gác cổng(2). Tuần tra tháp canh. Phù thủy già lẩm nhẩm thần chú(3). Triệu hồi bóng ma. Lũ yêu tinh nhóm lò, luyện phép thuật(4).",
          wrongDot: 2,
          explain: "Dấu chấm (2) cắt sai câu: 'Lính canh gác cổng, tuần tra tháp canh' phải là một câu." },
        { id: "tv-020", difficulty: 1,
          passage: "Trong lâu đài, mỗi kẻ một việc(1). Bọn yêu tinh nhỏ gom củi khô(2). Nhóm lò lửa lớn. Phù thủy già đọc thần chú(3). Gọi gió triệu sét. Lũ quạ bay rợp trời đen kịt(4).",
          wrongDot: 2,
          explain: "Dấu chấm (2) cắt sai câu: 'Bọn yêu tinh nhỏ gom củi khô, nhóm lò lửa lớn' phải là một câu." },
        { id: "tv-021", difficulty: 1,
          passage: "Trong lâu đài, mỗi kẻ một việc(1). Phù thủy già nghiền ngẫm sách cổ(2). Tìm kiếm phép thuật. Lũ dơi treo mình trên xà nhà(3). Rỉ rả kêu suốt đêm(4).",
          wrongDot: 2,
          explain: "Dấu chấm (2) cắt sai câu: 'Phù thủy già nghiền ngẫm sách cổ, tìm kiếm phép thuật' phải là một câu." },
    ],
    "tu-chi-dac-diem-doan": [
        { id: "tv-022", difficulty: 1,
          passage: "Màn đêm đen kịt bao trùm lâu đài, những ngọn nến le lói chập chờn trong gió, những bức tường rêu phong cổ kính đứng im lìm giữa màn sương.",
          options: ["Màn đêm", "Ngọn nến", "Đen kịt", "Bức tường"], correctIndex: 2 },
        { id: "tv-023", difficulty: 1,
          passage: "Lão phù thủy già nua chậm chạp bước qua hành lang tối tăm, chiếc áo choàng rách nát kéo lê trên sàn đá lạnh lẽo.",
          options: ["Lão phù thủy", "Chậm chạp", "Áo choàng", "Sàn đá"], correctIndex: 1 },
        { id: "tv-024", difficulty: 1,
          passage: "Ngọn lửa xanh lét bùng lên từ vạc dầu, tỏa ra thứ ánh sáng ma quái rùng rợn khắp căn phòng.",
          options: ["Ngọn lửa", "Vạc dầu", "Xanh lét", "Căn phòng"], correctIndex: 2 },
    ],
    "so-sanh": [
        { id: "tv-025", difficulty: 1,
          poem: "Ngọn tháp vươn như lưỡi kiếm<br>Đâm thủng màn đêm u tối.",
          options: ["Ngọn tháp ⇔ lưỡi kiếm", "Ngọn tháp ⇔ màn đêm", "Lưỡi kiếm ⇔ màn đêm"],
          correctIndex: 0,
          hints: ["", "Sai! Ngọn tháp ĐÂM THỦNG màn đêm, đó không phải so sánh.", "Sai! Không có so sánh nào giữa lưỡi kiếm và màn đêm."] },
        { id: "tv-026", difficulty: 1,
          poem: "Mặt trăng treo như chiếc đèn lồng<br>Soi sáng con đường về.",
          options: ["Mặt trăng ⇔ đèn lồng", "Mặt trăng ⇔ con đường", "Đèn lồng ⇔ con đường"],
          correctIndex: 0,
          hints: ["", "Sai! Mặt trăng SOI SÁNG con đường, đó không phải so sánh.", "Sai! Không có so sánh nào giữa đèn lồng và con đường."] },
        { id: "tv-027", difficulty: 1,
          poem: "Làn sương trắng như tấm khăn voan<br>Phủ kín khu rừng già.",
          options: ["Làn sương ⇔ khăn voan", "Làn sương ⇔ rừng già", "Khăn voan ⇔ rừng già"],
          correctIndex: 0,
          hints: ["", "Sai! Làn sương PHỦ KÍN khu rừng, đó không phải so sánh.", "Sai! Không có so sánh nào giữa khăn voan và rừng già."] },
    ],
    "kieu-cau": [
        { id: "tv-028", difficulty: 1, sentence: "Ôi, lâu đài này thật đẹp quá!", correctIndex: 0,
          hints: ["", "Sai! Câu có từ 'ôi', 'quá' bày tỏ cảm xúc, đây là câu cảm.", "Sai! Đây không phải câu hỏi.", "Sai! Đây không phải câu yêu cầu."],
          why: "có từ 'ôi', 'quá' bày tỏ cảm xúc" },
        { id: "tv-029", difficulty: 1, sentence: "Boo đang lạc trong lâu đài phép thuật.", correctIndex: 1,
          hints: ["Sai! Câu không có từ cảm thán.", "", "Sai! Cuối câu là dấu chấm, không phải dấu chấm hỏi.", "Sai! Câu này chỉ kể lại sự việc."],
          why: "thuật lại sự việc" },
        { id: "tv-030", difficulty: 1, sentence: "Bạn có nhìn thấy chiếc chìa khóa bạc không?", correctIndex: 2,
          hints: ["Sai! Đây là câu hỏi, không phải cảm thán.", "Sai! Cuối câu là dấu chấm hỏi.", "", "Sai! Đây là câu hỏi, không phải lời yêu cầu."],
          why: "có cặp từ 'có... không' và dấu chấm hỏi" },
        { id: "tv-031", difficulty: 1, sentence: "Hãy mở cánh cửa này ra!", correctIndex: 3,
          hints: ["Sai! Có dấu chấm than nhưng 'Hãy' là từ cầu khiến.", "Sai! Đây là câu cầu khiến.", "Sai! Đây không phải câu hỏi.", ""],
          why: "có từ 'hãy' thể hiện yêu cầu" },
        { id: "tv-032", difficulty: 1, sentence: "Chà, ngọn đèn dầu sáng thật rực rỡ làm sao!", correctIndex: 0,
          hints: ["", "Sai! Câu có từ 'Chà', 'làm sao' thể hiện cảm xúc.", "Sai! Đây không phải câu hỏi.", "Sai! Đây không phải câu yêu cầu."],
          why: "có từ 'chà', 'làm sao' bày tỏ cảm xúc" },
        { id: "tv-033", difficulty: 1, sentence: "Lão phù thủy đang đọc thần chú trong phòng.", correctIndex: 1,
          hints: ["Sai! Câu không có từ cảm thán nào.", "", "Sai! Câu kết thúc bằng dấu chấm.", "Sai! Đây chỉ là câu kể."],
          why: "thuật lại sự việc" },
        { id: "tv-034", difficulty: 1, sentence: "Mấy giờ thì mặt trăng lên đỉnh tháp?", correctIndex: 2,
          hints: ["Sai! Đây là câu hỏi có từ để hỏi 'mấy giờ'.", "Sai! Cuối câu có dấu chấm hỏi.", "", "Sai! Đây là câu hỏi, không phải lời cầu khiến."],
          why: "có từ để hỏi 'mấy giờ'" },
        { id: "tv-035", difficulty: 1, sentence: "Boo ơi, hãy cẩn thận với bẫy phép!", correctIndex: 3,
          hints: ["Sai! Đây là lời nhắc nhở, có từ 'hãy' cầu khiến.", "Sai! Đây là câu cầu khiến (có 'hãy').", "Sai! Đây không phải câu hỏi.", ""],
          why: "có từ 'hãy' thể hiện lời nhắc nhở, yêu cầu" },
    ],
};

/* =====================================================================
   PHẦN D: CÂU TĨNH ĐẶC BIỆT (STATIC_QUESTIONS)
   Chỉ dành cho câu KHÔNG tổng quát hóa được thành dạng/khuôn (đề đố
   vui một-lần, câu gắn chặt với ngữ cảnh riêng...). Viết theo schema
   đầy đủ: {id, subject, topic, difficulty, question, choices,
   correctIndex, wrongHints, explain}. Hiện chưa có câu nào.
   ===================================================================== */
const STATIC_QUESTIONS = [];

/* =====================================================================
   BIÊN DỊCH QUESTION_BANK (tự động - không sửa tay)
   ===================================================================== */
const QUESTION_BANK = [];
for (const topic in TV_TEMPLATES) {
    (TV_MATERIALS[topic] || []).forEach(m => {
        const built = TV_TEMPLATES[topic].build(m);
        QUESTION_BANK.push({
            id: m.id, subject: "tieng-viet", topic: topic,
            difficulty: m.difficulty || 1,
            question: built.question,
            choices: built.choices,
            correctIndex: built.correctIndex,
            wrongHints: built.wrongHints,
            explain: built.explain
        });
    });
}
STATIC_QUESTIONS.forEach(q => QUESTION_BANK.push(q));

/* =====================================================================
   BỘ CHỌN CÂU HỎI TỪ NGÂN HÀNG
   Engine gọi getPuzzle(cfg, difficulty):
   - cfg.topic      : tên chủ đề (bảng ở đầu file)
   - cfg.frame(q)   : (tùy chọn) hàm bọc thêm lời dẫn truyện quanh câu hỏi
   - cfg.successMsg : (tùy chọn) lời thưởng hiện trước lời giải thích khi đúng
   - cfg.fallback   : (tùy chọn) id phòng bị đẩy về khi trả lời sai
   - difficulty     : chế độ chơi (1 = Cơ Bản, 2 = Thử Thách)
   Chế độ Cơ Bản chỉ lấy câu difficulty 1 (nếu topic không có câu dễ nào
   thì mới dùng tạm câu khó); Thử Thách lấy tất cả. Topic toán có cả
   generator lẫn câu tĩnh trong ngân hàng thì trộn ngẫu nhiên 50/50.
   Generator toán tự chứa lời dẫn riêng nên bỏ qua frame/successMsg.
   ===================================================================== */
function pickFromBank(topic, difficulty = 1) {
    const list = QUESTION_BANK.filter(q => q.topic === topic);
    if (!list.length) return null;
    if (difficulty === 1) {
        const easy = list.filter(q => (q.difficulty || 1) === 1);
        if (easy.length) return easy[rInt(0, easy.length - 1)];
    }
    return list[rInt(0, list.length - 1)];
}

function buildFromBank(cfg, difficulty = 1) {
    const q = pickFromBank(cfg.topic, difficulty);
    if (!q) {
        return {
            puzzleHTML: `<div class="puzzle-box">(Chưa có câu hỏi cho chủ đề "${cfg.topic}" - hãy thêm vào questions.js)</div>`,
            choices: [{ text: "Tiếp tục", isCorrect: true, wrongMsg: "" }],
            correctMsg: "OK!"
        };
    }
    const body = cfg.frame ? cfg.frame(q.question) : q.question;
    return {
        puzzleHTML: `<div class="puzzle-box">${body}</div>`,
        choices: shuffle(q.choices.map((text, i) => ({
            text: text,
            isCorrect: i === q.correctIndex,
            wrongMsg: (q.wrongHints && q.wrongHints[i]) || "Sai rồi! Hãy suy nghĩ kỹ lại nhé."
        }))),
        correctMsg: [cfg.successMsg, q.explain].filter(Boolean).join(" ")
    };
}

function getPuzzle(cfg, difficulty = 1) {
    if (typeof cfg === "string") cfg = { topic: cfg };
    const gen = MATH_GENERATORS[cfg.topic];
    const hasBank = QUESTION_BANK.some(q => q.topic === cfg.topic);
    let p;
    if (gen && hasBank) p = rInt(0, 1) === 0 ? gen(difficulty) : buildFromBank(cfg, difficulty);
    else if (gen) p = gen(difficulty);
    else p = buildFromBank(cfg, difficulty);
    if (cfg.fallback) p.fallbackRoom = cfg.fallback;
    return p;
}

/* =====================================================================
   PHẦN E: GENERATOR TOÁN (hiện thực các dạng trong MATH_SPECS)
   Mỗi hàm nhận diff (1 = Cơ Bản, 2 = Thử Thách) và trả về:
   { puzzleHTML, choices: [{text, isCorrect, wrongMsg}], correctMsg }
   ===================================================================== */
function fillWrongs(wrongs, correct, spread) {
    wrongs = [...new Set(wrongs)].filter(w => w !== correct && w > 0 && Number.isInteger(w)).slice(0, 3);
    while (wrongs.length < 3) {
        let cand = correct + rInt(1, spread) * (rInt(0, 1) ? 1 : -1);
        if (!wrongs.includes(cand) && cand !== correct && cand > 0) wrongs.push(cand);
    }
    return wrongs;
}

function genThuTuPhepTinh(diff = 1) {
    let a = diff === 2 ? rInt(15, 50) : rInt(10, 30);
    let b = diff === 2 ? rInt(2, 9) : rInt(2, 5);
    let c = diff === 2 ? rInt(3, 9) : rInt(2, 5);
    let correct = a + b * c;
    let wrongs = fillWrongs([a + b * (c + 1), a + (b + 1) * c, a + b * (c - 1)], correct, 3);
    return {
        puzzleHTML: `<div class="puzzle-box">"Mật mã là kết quả phép tính: <strong>${a} + ${b} × ${c}</strong>. Đoán sai mi sẽ bị giật điện!"</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Điện giật! Nhớ quy tắc nhân chia trước, cộng trừ sau."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Điện giật! Tính lại đi nhóc."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Điện giật! Kiểm tra kỹ thứ tự phép tính."}]),
        correctMsg: `Cạch! Cửa mở. Boo đã giải đúng (${b} × ${c} = ${b*c}, ${a} + ${b*c} = ${correct}).`
    };
}

function genNhanRoiTru(diff = 1) {
    let pots = diff === 2 ? rInt(3, 8) : rInt(3, 5);
    let spiders = diff === 2 ? rInt(8, 15) : rInt(4, 9);
    let total = pots * spiders;
    let have = diff === 2 ? rInt(10, total - 5) : rInt(5, total - 3);
    let need = total - have;
    let wrongs = fillWrongs([total, (pots - 1) * spiders - have, need + spiders], need, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">Lão lầm bầm: "Ta cần nấu ${pots} nồi súp, mỗi nồi cần đúng ${spiders} con nhện lửa. Sáng nay mới bắt được ${have} con. Phải đi lùng thêm bao nhiêu con nữa đây?"</div>`,
        choices: shuffle([{text: `${need} con`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} con`, isCorrect: false, wrongMsg: "Lão tức giận phóng dao: 'Tính ngu thế!'"},{text: `${wrongs[1]} con`, isCorrect: false, wrongMsg: "Lão phóng dao: 'Ngươi chưa trừ đi số nhện đang có à!'"},{text: `${wrongs[2]} con`, isCorrect: false, wrongMsg: "Lão phóng dao: 'Tính toán cẩn thận vào!'"}]),
        correctMsg: `Lão vui vẻ đưa cho bạn Chìa Khóa Bạc. (${pots} × ${spiders} = ${total}, ${total} - ${have} = ${need})`
    };
}

function genBangNhan(diff = 1) {
    let base = diff === 2 ? rInt(3, 9) : rInt(2, 5);
    while (diff === 2 && base === 7) base = rInt(3, 9);
    let startIdx = rInt(1, 3);
    let vals = [];
    for (let i = 0; i < 5; i++) vals.push(base * (startIdx + i));
    let missingIdx = rInt(1, 3);
    let correct = vals[missingIdx];
    let extended = [];
    for (let i = -2; i < 7; i++) {
        let v = base * (startIdx + i);
        if (v > 0) extended.push(v);
    }
    let wrongs = extended.filter(v => v !== correct && !vals.includes(v)).slice(0, 3);
    wrongs = fillWrongs(wrongs, correct, base);
    let display = vals.map((v, i) => i === missingIdx ? "__" : String(v)).join(", ");
    return {
        puzzleHTML: `<div class="puzzle-box">Các bậc an toàn ghi: ${display}. Boo phải nhảy vào bậc số mấy?</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Bước hụt! Rơi bạch xuống Hành Lang Hầm."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Bước hụt! Rơi bạch xuống Hành Lang Hầm."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Bước hụt! Rơi bạch xuống Hành Lang Hầm."}]),
        correctMsg: `Đúng bảng nhân ${base}! Boo an toàn lên tới đỉnh.`
    };
}

function genChieuRongHCN(diff = 1) {
    let halfP = diff === 2 ? rInt(10, 30) : rInt(8, 15);
    let len = rInt(4, halfP - 3);
    let peri = halfP * 2, width = halfP - len;
    let wrongs = fillWrongs([len, halfP, peri], width, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">Nhỏ số giọt tinh chất bằng đúng CHIỀU RỘNG khu vườn lão phù thủy. Biết khu vườn hình chữ nhật có chu vi là ${peri}m, chiều dài ${len}m.</div>`,
        choices: shuffle([{text: `${width} giọt`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} giọt`, isCorrect: false, wrongMsg: "Bùm! Sai bét. Phải tính nửa chu vi rồi trừ chiều dài."},{text: `${wrongs[1]} giọt`, isCorrect: false, wrongMsg: "Bùm! Đó là nửa chu vi, chưa trừ chiều dài."},{text: `${wrongs[2]} giọt`, isCorrect: false, wrongMsg: "Bùm! Đó là chu vi, phải chia đôi trước."}]),
        correctMsg: `Pha chế thành công! (${peri} : 2 = ${halfP}, ${halfP} - ${len} = ${width}). Bạn nhận được Bom Ánh Sáng.`
    };
}

function genPhepToanLa1(diff = 1) {
    if (diff !== 2) {
        let a = rInt(2, 9), b = rInt(2, 9);
        while (a === b) b = rInt(2, 9);
        let correct = a * b + a;
        let wrongs = fillWrongs([a * b, a * b + b, a + b], correct, 4);
        return {
            puzzleHTML: `<div class="puzzle-box">"Phép toán cổ đại: <strong>a △ b = a × b + a</strong>. Hãy tính <strong>${a} △ ${b}</strong> để mở nắp mộ!"</div>`,
            choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Đây chỉ là a×b, bạn quên cộng thêm a."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Phải cộng thêm a, không phải cộng b."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Đây chỉ là a+b, bạn quên nhân a×b."}]),
            correctMsg: `Đúng! ${a}×${b} + ${a} = ${a*b} + ${a} = ${correct}. Nắp mộ mở ra!`
        };
    }
    let a = rInt(5, 20), b = rInt(3, 15);
    while (a === b) b = rInt(3, 15);
    let correct = b * a + a + b;
    let wrongs = fillWrongs([a*b, a+b, b*a+a], correct, 6);
    return {
        puzzleHTML: `<div class="puzzle-box">"Phép toán cổ đại: <strong>a △ b = b × a + a + b</strong>. Hãy tính <strong>${a} △ ${b}</strong> để mở nắp mộ!"</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Bạn quên cộng a+b. (Đây chỉ là b×a)."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Đây chỉ là a+b, bạn quên nhân b×a."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Bạn thiếu cộng b. Tính lại đầy đủ các bước."}]),
        correctMsg: `Đúng! ${b}×${a} + ${a} + ${b} = ${b*a} + ${a+b} = ${correct}. Nắp mộ mở ra!`
    };
}

function genTongHieu(diff = 1) {
    if (diff !== 2) {
        let A = rInt(20, 90), D = rInt(5, A - 10);
        let B = A - D;
        let wrongs = fillWrongs([A + D, A, D], B, 8);
        return {
            puzzleHTML: `<div class="puzzle-box">"Thùng A chứa <strong>${A} lít</strong> rượu. Thùng B chứa ít hơn thùng A <strong>${D} lít</strong>. Hỏi thùng B chứa bao nhiêu lít?"</div>`,
            choices: shuffle([{text: `${B} lít`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} lít`, isCorrect: false, wrongMsg: "Sai! 'Ít hơn' thì phải làm phép trừ, không phải cộng."},{text: `${wrongs[1]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là số lít thùng A."},{text: `${wrongs[2]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là phần chênh lệch, chưa phải thùng B."}]),
            correctMsg: `Chính xác! B = ${A} - ${D} = ${B}. Khóa phép tan biến!`
        };
    }
    let D = rInt(50, 500);
    let B = rInt(100, 1500);
    let A = B + D, S = A + B;
    let correct = A;
    let wrongs = fillWrongs([B, S, D], correct, 15);
    return {
        puzzleHTML: `<div class="puzzle-box">"Tổng rượu trong hai thùng là <strong>${S} lít</strong>. Thùng A nhiều hơn thùng B <strong>${D} lít</strong>. Hãy cho biết thùng A chứa bao nhiêu lít?"</div>`,
        choices: shuffle([{text: `${correct} lít`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là số lít của thùng B."},{text: `${wrongs[1]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là tổng hai thùng, không phải thùng A."},{text: `${wrongs[2]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là hiệu số, không phải số lít thùng A."}]),
        correctMsg: `Chính xác! A = (${S}+${D})÷2 = ${correct}. Khóa phép tan biến!`
    };
}

function genTongTi(diff = 1) {
    if (diff !== 2) {
        let r = rInt(2, 5), B = rInt(3, 12);
        let A = r * B;
        let wrongs = fillWrongs([B + r, B, A + B], A, 6);
        return {
            puzzleHTML: `<div class="puzzle-box">"Hoa cúc (B) có <strong>${B} bông</strong>. Hoa hồng (A) nhiều gấp <strong>${r} lần</strong> hoa cúc. Hỏi có bao nhiêu bông <strong>hoa hồng (A)</strong>?"</div>`,
            choices: shuffle([{text: `${A} bông`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} bông`, isCorrect: false, wrongMsg: "Sai! 'Gấp' là phép nhân, không phải phép cộng."},{text: `${wrongs[1]} bông`, isCorrect: false, wrongMsg: "Sai! Đây là số hoa cúc (B)."},{text: `${wrongs[2]} bông`, isCorrect: false, wrongMsg: "Sai! Đây là tổng cả hai loại hoa."}]),
            correctMsg: `Đúng! A = ${B} × ${r} = ${A}. Cổng vườn mở ra!`
        };
    }
    let r = rInt(2, 4), B = rInt(8, 30), A = r * B, S = A + B;
    let wrongs = fillWrongs([A, S, B*2], B, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">"Tổng số hoa hồng (A) và hoa cúc (B) là <strong>${S} bông</strong>. Hoa hồng gấp <strong>${r} lần</strong> hoa cúc. Hỏi có bao nhiêu bông <strong>hoa cúc (B)</strong>?"</div>`,
        choices: shuffle([{text: `${B} bông`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} bông`, isCorrect: false, wrongMsg: "Sai! Đây là số hoa hồng (A), đề hỏi hoa cúc (B)."},{text: `${wrongs[1]} bông`, isCorrect: false, wrongMsg: "Sai! Đây là tổng, phải chia cho (tỉ lệ+1)."},{text: `${wrongs[2]} bông`, isCorrect: false, wrongMsg: `Sai! Hãy vẽ sơ đồ: B là 1 phần, A là ${r} phần, tổng ${r+1} phần.`}]),
        correctMsg: `Đúng! B = ${S}÷${r+1} = ${B}. Cổng vườn mở ra!`
    };
}

function genChuyenGapBa(diff = 1) {
    if (diff !== 2) {
        let b = rInt(5, 40), a = rInt(b + 5, b + 40);
        let correct = a - b;
        let wrongs = fillWrongs([a + b, a, b], correct, 6);
        return {
            puzzleHTML: `<div class="puzzle-box">"Bể Jacky có <strong>${a} lít</strong> nước thần, bể Emma có <strong>${b} lít</strong>. Hỏi phải đổ thêm vào bể Emma bao nhiêu lít để hai bể bằng nhau?"</div>`,
            choices: shuffle([{text: `${correct} lít`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} lít`, isCorrect: false, wrongMsg: "Sai! Muốn biết Emma thiếu bao nhiêu thì lấy hiệu, không phải tổng."},{text: `${wrongs[1]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là số lít bể Jacky."},{text: `${wrongs[2]} lít`, isCorrect: false, wrongMsg: "Sai! Đây là số lít bể Emma đang có."}]),
            correctMsg: `Chính xác! ${a} - ${b} = ${correct}. Đài phun nước phát sáng!`
        };
    }
    let x = rInt(5, 18);
    let a = rInt(x + 5, x + 30);
    let b = 3 * (a - x) - x;
    while (b <= 0 || b > 100) {
        a = rInt(x + 5, x + 30);
        b = 3 * (a - x) - x;
    }
    let halfDiff = Math.round((a - b) / 2);
    let wrongs = fillWrongs([a, halfDiff, Math.round(a / 3)], x, 6);
    return {
        puzzleHTML: `<div class="puzzle-box">"Bể Jacky có <strong>${a} lít</strong> nước thần, bể Emma có <strong>${b} lít</strong>. Jacky phải chuyển bao nhiêu lít sang Emma để lượng nước của Emma <strong>gấp 3 lần</strong> Jacky?"</div>`,
        choices: shuffle([{text: `${x} lít`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} lít`, isCorrect: false, wrongMsg: "Sai! Kiểm tra: số lít sau chuyển của Emma có gấp 3 Jacky không?"},{text: `${wrongs[1]} lít`, isCorrect: false, wrongMsg: "Sai! Đặt x là số lít chuyển, giải: (b+x)=3(a-x)."},{text: `${wrongs[2]} lít`, isCorrect: false, wrongMsg: "Sai! Tính toán cẩn thận lại phương trình."}]),
        correctMsg: `Chính xác! (${b}+x)=3(${a}-x) → x=${x}. Đài phun nước phát sáng!`
    };
}

function genTongTiHieu(diff = 1) {
    if (diff !== 2) {
        let k = rInt(2, 5), B = rInt(4, 15);
        let A = k * B, correct = A - B;
        let wrongs = fillWrongs([A, B, A + B], correct, 5);
        return {
            puzzleHTML: `<div class="puzzle-box">"B là <strong>${B}</strong>. A gấp <strong>${k} lần</strong> B. Hãy tính <strong>hiệu của A và B</strong> (A - B) để thắp sáng ngọn đèn tháp!"</div>`,
            choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Đây là giá trị của A, còn phải trừ đi B."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Đây là giá trị của B."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Đây là tổng A+B, đề hỏi hiệu A-B."}]),
            correctMsg: `Chính xác! A = ${B}×${k} = ${A}, A - B = ${A} - ${B} = ${correct}. Đèn tháp bừng sáng!`
        };
    }
    let k = rInt(2, 4), B = rInt(50, 200), A = k * B, S = A + B;
    let diffAB = A - B;
    let wrongs = fillWrongs([B, A, S], diffAB, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">"Tổng của A và B là <strong>${S}</strong>. A gấp <strong>${k} lần</strong> B. Hãy tính <strong>hiệu của A và B</strong> (A - B) để thắp sáng ngọn đèn tháp!"</div>`,
        choices: shuffle([{text: String(diffAB), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Đây là giá trị của B, không phải A-B."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Đây là giá trị của A, không phải A-B."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Đây là tổng, cần tìm hiệu A-B."}]),
        correctMsg: `Chính xác! B=${S}÷${k+1}=${B}, A=${A}, A-B=${diffAB}. Đèn tháp bừng sáng!`
    };
}

function genPhepToanLa2(diff = 1) {
    if (diff !== 2) {
        let x = rInt(3, 7), y = rInt(3, 7);
        while (x === y) y = rInt(3, 7);
        let correct = x * y - x - y + 1;
        let wrongs = fillWrongs([x * y, x * y - x - y, x + y], correct, 5);
        return {
            puzzleHTML: `<div class="puzzle-box">"Phép gương cổ: <strong>a ◇ b = a × b - a - b + 1</strong>. Hãy tính <strong>${x} ◇ ${y}</strong> để dừng những tấm gương!"</div>`,
            choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Đây chỉ là a×b, còn phải trừ a, trừ b rồi cộng 1."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Bạn quên cộng 1 ở cuối."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Đây là a+b, hãy làm đúng theo công thức."}]),
            correctMsg: `Chính xác! ${x}×${y} - ${x} - ${y} + 1 = ${correct}. Gương dừng xoay!`
        };
    }
    let x = rInt(3, 8), y = rInt(3, 8), z = rInt(4, 10);
    while (x === y) y = rInt(3, 8);
    let inner = x * y - x - y + 1;
    let correct = z * inner - z - inner + 1;
    let d1 = z * inner;
    let d2 = z * (x * y) - z - (x * y) + 1;
    let d3 = (z * inner + z + inner + 1);
    let wrongs = fillWrongs([d1, d2, d3], correct, 25);
    return {
        puzzleHTML: `<div class="puzzle-box">"Phép gương cổ: <strong>a ◇ b = a × b - a - b + 1</strong>. Hãy tính <strong>${z} ◇ (${x} ◇ ${y})</strong> để dừng những tấm gương!"</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Bạn quên trừ a và b. Tính từng bước cẩn thận."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: `Sai! Tính nhầm bước trong ngoặc. Hãy tính lại ${x}◇${y} trước.`},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Nhầm dấu cộng và trừ trong công thức phép gương."}]),
        correctMsg: `Chính xác! ${x}◇${y}=${inner}, ${z}◇${inner}=${correct}. Gương dừng xoay!`
    };
}

function genDienTichHCN(diff = 1) {
    let d = diff === 2 ? rInt(7, 16) : rInt(3, 9);
    let r = diff === 2 ? rInt(4, 11) : rInt(2, 6);
    while (d === r) r = diff === 2 ? rInt(4, 11) : rInt(2, 6);
    let correct = d * r;
    let peri = (d + r) * 2;
    let wrongs = fillWrongs([peri, d + r, d * (r + 1)], correct, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">Trên tấm bản đồ cổ khắc một thửa ruộng hình chữ nhật: <strong>chiều dài ${d}m, chiều rộng ${r}m</strong>. Hãy tính <strong>diện tích</strong> thửa ruộng (m²) để xác định vị trí kho báu!</div>`,
        choices: shuffle([{text: `${correct} m²`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} m`, isCorrect: false, wrongMsg: "Bản đồ cháy! Đây là chu vi. Diện tích = dài × rộng."},{text: `${wrongs[1]} m²`, isCorrect: false, wrongMsg: "Bản đồ cháy! Đây là tổng dài+rộng. Phải nhân vào."},{text: `${wrongs[2]} m²`, isCorrect: false, wrongMsg: "Bản đồ cháy! Diện tích = chiều dài × chiều rộng. Tính lại đi."}]),
        correctMsg: `Chính xác! ${d} × ${r} = ${correct} m². Tấm bản đồ tự động đánh dấu kho báu!`
    };
}

function genXemGio(diff = 1) {
    let h = rInt(7, 10);
    let m = diff === 2 ? rInt(1, 3) * 15 : 30;
    let d = diff === 2 ? rInt(3, 9) * 5 : rInt(1, 2) * 10;
    let total = h * 60 + m + d;
    let eh = Math.floor(total / 60), em = total % 60;
    let displayH = eh > 12 ? eh - 12 : eh;
    let correct = em === 0 ? `${displayH} giờ` : `${displayH} giờ ${em} phút`;
    let w1H = displayH + 1;
    if (w1H > 12) w1H -= 12;
    let w1 = em === 0 ? `${w1H} giờ` : `${w1H} giờ ${em} phút`;
    let w2 = `${h} giờ ${m} phút`;
    let w3H = rInt(6, 12), w3M = rInt(0, 11) * 5;
    while ((w3H === displayH && w3M === em) || (w3H === h && w3M === m) || (w3H === w1H && w3M === em)) {
        w3H = rInt(6, 12);
        w3M = rInt(0, 11) * 5;
    }
    let w3 = w3M === 0 ? `${w3H} giờ` : `${w3H} giờ ${w3M} phút`;
    let wrongs = [w1, w2, w3].filter(w => w !== correct);
    while (wrongs.length < 3) {
        let extraH = rInt(6, 12), extraM = rInt(0, 11) * 5;
        if (extraM === 0 && em === 0 && extraH === displayH) extraM = 15;
        let extra = extraM === 0 ? `${extraH} giờ` : `${extraH} giờ ${extraM} phút`;
        if (extra !== correct && !wrongs.includes(extra)) wrongs.push(extra);
    }
    return {
        puzzleHTML: `<div class="puzzle-box">Boo bắt đầu vào Tháp Đồng Hồ lúc <strong>${h} giờ ${m} phút</strong>. Mỗi tầng mất <strong>5 phút</strong> để leo. Sau <strong>${d} phút</strong> (tương đương ${d/5} tầng), Boo dừng lại. Hỏi lúc đó là <strong>mấy giờ</strong>?</div>`,
        choices: shuffle([{text: correct, isCorrect: true, wrongMsg: ""},{text: wrongs[0], isCorrect: false, wrongMsg: `Sai! Cộng ${d} phút vào ${h} giờ ${m} phút rồi đổi ra giờ nhé.`},{text: wrongs[1], isCorrect: false, wrongMsg: `Sai! Đây là giờ bắt đầu. Phải cộng thêm ${d} phút.`},{text: wrongs[2], isCorrect: false, wrongMsg: `Sai! Nhẩm lại: ${h} giờ ${m} phút + ${d} phút = ?`}]),
        correctMsg: `Chính xác! ${h} giờ ${m} phút + ${d} phút = ${correct}. Chuông đồng hồ ngân vang!`
    };
}

function genChuViHinhVuong(diff = 1) {
    let side = diff === 2 ? rInt(5, 15) : rInt(3, 9);
    let correct = side * 4;
    let area = side * side;
    let wrongs = fillWrongs([area, side + 4, side * 2], correct, 4);
    return {
        puzzleHTML: `<div class="puzzle-box">Sân đấu cổ đại có dạng <strong>hình vuông</strong>, mỗi cạnh dài <strong>${side}m</strong>. Các chiến binh đá cần biết <strong>chu vi</strong> sân đấu để dựng hàng rào bảo vệ!</div>`,
        choices: shuffle([{text: `${correct} m`, isCorrect: true, wrongMsg: ""},{text: `${wrongs[0]} m²`, isCorrect: false, wrongMsg: `Sai! Đây là diện tích (${side}×${side}). Chu vi = cạnh × 4.`},{text: `${wrongs[1]} m`, isCorrect: false, wrongMsg: "Sai! Chu vi = cạnh × 4, không phải cạnh + 4."},{text: `${wrongs[2]} m`, isCorrect: false, wrongMsg: "Sai! Đây mới là hai lần cạnh. Chu vi = cạnh × 4."}]),
        correctMsg: `Chính xác! Chu vi = ${side} × 4 = ${correct}m. Hàng rào dựng lên!`
    };
}

function genTimSoBiChia(diff = 1) {
    let divisor = diff === 2 ? rInt(3, 8) : rInt(2, 5);
    let quotient = diff === 2 ? rInt(4, 12) : rInt(3, 9);
    let remainder = rInt(1, divisor - 1);
    if (remainder < 1) remainder = 1;
    let dividend = divisor * quotient + remainder;
    let wrongs = fillWrongs([divisor * quotient, divisor * (quotient + 1), divisor * quotient - remainder], dividend, divisor);
    return {
        puzzleHTML: `<div class="puzzle-box">Phép thuật khóa mật thất chỉ mở khi biết <strong>số bị chia</strong>. Biết <strong>số chia = ${divisor}</strong>, <strong>thương = ${quotient}</strong>, <strong>số dư = ${remainder}</strong>. Hỏi số bị chia là bao nhiêu?</div>`,
        choices: shuffle([{text: String(dividend), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sai! Đây chỉ là số chia × thương. Thiếu cộng số dư."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sai! Công thức: Số bị chia = số chia × thương + số dư."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sai! Nhớ cộng số dư, không được trừ."}]),
        correctMsg: `Chính xác! ${divisor} × ${quotient} + ${remainder} = ${divisor*quotient} + ${remainder} = ${dividend}. Mật thất mở ra!`
    };
}

/* Bảng tra topic toán → generator (engine dùng qua getPuzzle) */
const MATH_GENERATORS = {
    "thu-tu-phep-tinh": genThuTuPhepTinh,
    "nhan-roi-tru": genNhanRoiTru,
    "bang-nhan": genBangNhan,
    "chieu-rong-hcn": genChieuRongHCN,
    "phep-toan-la-1": genPhepToanLa1,
    "tong-hieu": genTongHieu,
    "tong-ti": genTongTi,
    "chuyen-gap-ba": genChuyenGapBa,
    "tong-ti-hieu": genTongTiHieu,
    "phep-toan-la-2": genPhepToanLa2,
    "dien-tich-hcn": genDienTichHCN,
    "xem-gio": genXemGio,
    "chu-vi-hinh-vuong": genChuViHinhVuong,
    "tim-so-bi-chia": genTimSoBiChia
};

/* =====================================================================
   GENERATOR CHO 5 PHASE ĐÁNH BOSS (Đỉnh Tháp)
   Nhận diff như generator thường; dạng toán của boss có spec riêng
   (boss-1, boss-3, boss-5 trong MATH_SPECS). Phase 2 và 4 lấy câu
   tiếng Việt từ ngân hàng nên thêm ngữ liệu vào topic
   tu-chi-dac-diem-doan / kieu-cau là boss cũng có đề mới.
   ===================================================================== */
function genBossPhase1(diff = 1) {
    let a = diff === 2 ? rInt(5, 20) : rInt(2, 9);
    let b = diff === 2 ? rInt(3, 9) : rInt(2, 5);
    let c = diff === 2 ? rInt(4, 12) : rInt(2, 9);
    let d = diff === 2 ? rInt(2, 8) : rInt(2, 5);
    let correct = a * b + c * d;
    let wrongs = fillWrongs([a*b + c*(d+1), (a+1)*b + c*d, a*(b+1) + c*d, (a+2)*b + c*d], correct, 12);
    return {
        puzzleHTML: `<div class="puzzle-box">🧪 Lão phù thủy vung đũa phép: "Mũi tên thần thứ nhất chỉ bắn trúng nếu ngươi tính đúng: <strong>${a} × ${b} + ${c} × ${d} = ?</strong>"</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Tia sét phản công! Nhớ nhân trước, cộng sau nhé."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Tia sét phản công! Tính từng phép nhân rồi cộng lại."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Tia sét phản công! Kiểm tra lại phép tính."}]),
        correctMsg: `🏹 Mũi tên thần thứ nhất xé gió bay tới! (${a}×${b}=${a*b}, ${c}×${d}=${c*d}, ${a*b}+${c*d}=${correct})`
    };
}

function genBossPhase2(diff = 1) {
    return buildFromBank({
        topic: "tu-chi-dac-diem-doan",
        frame: q => `📜 Lão phù thủy niệm thần chú, một dòng chữ lửa hiện ra:<br>${q}<br>Trả lời đúng để nạp sức mạnh cho <strong>mũi tên thần thứ hai</strong>!`,
        successMsg: "🏹 Mũi tên thần thứ hai lao vút đi!"
    }, diff);
}

function genBossPhase3(diff = 1) {
    if (diff !== 2) {
        let A = rInt(3, 10), B = rInt(2, 9);
        let S = A + B;
        let correct = A * B;
        let wrongs = fillWrongs([S, A * (B + 1), (A + 1) * B], correct, 8);
        return {
            puzzleHTML: `<div class="puzzle-box">⚡ Lão phù thủy điên cuồng: "Hai con số bí ẩn có <strong>tổng là ${S}</strong>, và số thứ nhất là <strong>${A}</strong>. Mũi tên thứ ba cần <strong>tích của hai số</strong>. Hãy tính đi, nhóc con!"</div>`,
            choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sét đánh! Đây là tổng, không phải tích."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: `Sét đánh! Tìm số thứ hai trước: ${S} - ${A} = ?`},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sét đánh! Tính lại phép nhân cho chuẩn."}]),
            correctMsg: `🏹 Mũi tên thần thứ ba xuyên thủng khiên phép! (Số thứ hai = ${S} - ${A} = ${B}, Tích = ${A} × ${B} = ${correct})`
        };
    }
    let A = rInt(20, 60), B = rInt(10, A - 5), S = A + B, D = A - B;
    let correct = A * B;
    let wrongs = fillWrongs([A + B, A * (A - D), (S + D) * (S - D) / 4 + rInt(5,20)], correct, 25);
    return {
        puzzleHTML: `<div class="puzzle-box">⚡ Lão phù thủy điên cuồng: "Hai con số bí ẩn có <strong>tổng là ${S}</strong> và <strong>hiệu là ${D}</strong>. Mũi tên thứ ba cần <strong>tích của chúng</strong>. Hãy tính đi, nhóc con!"</div>`,
        choices: shuffle([{text: String(correct), isCorrect: true, wrongMsg: ""},{text: String(wrongs[0]), isCorrect: false, wrongMsg: "Sét đánh! Đây là tổng, không phải tích."},{text: String(wrongs[1]), isCorrect: false, wrongMsg: "Sét đánh! Tìm số lớn và số bé trước rồi nhân."},{text: String(wrongs[2]), isCorrect: false, wrongMsg: "Sét đánh! Số lớn = (Tổng+Hiệu)÷2, số bé = (Tổng-Hiệu)÷2."}]),
        correctMsg: `🏹 Mũi tên thần thứ ba xuyên thủng khiên phép! (Số lớn = (${S}+${D})÷2 = ${A}, Số bé = (${S}-${D})÷2 = ${B}, Tích = ${correct})`
    };
}

function genBossPhase4(diff = 1) {
    return buildFromBank({
        topic: "kieu-cau",
        frame: q => `🔮 Lão phù thủy gào lên, một dòng chữ lửa xuất hiện:<br>${q}<br>Xác định đúng để nạp sức mạnh cho <strong>mũi tên thần thứ tư</strong>!`,
        successMsg: "🏹 Mũi tên thần thứ tư lao thẳng vào ngực lão phù thủy!"
    }, diff);
}

function genBossPhase5(diff = 1) {
    if (diff !== 2) {
        let x = rInt(3, 9), A = rInt(2, 5), D = rInt(2, 10);
        let E = x * A - D;
        while (E <= 0) { D = rInt(2, 10); E = x * A - D; }
        let wrongs = fillWrongs([E + D, x * A, E - D], x, 4);
        return {
            puzzleHTML: `<div class="puzzle-box">💣 <strong>KÍCH HOẠT BOM ÁNH SÁNG!</strong><br>Lão phù thủy thều thào niệm lời nguyền cuối cùng:<br><em>"Hỡi con số bí ẩn kia, hãy thức tỉnh!<br>Nếu đem ngươi <strong>nhân với ${A}</strong>, rồi <strong>trừ đi ${D}</strong>,<br>sẽ nhận được kết quả là <strong>${E}</strong>."</em><br><br>Hãy tìm ra con số bí ẩn để kích nổ Bom Ánh Sáng!</div>`,
            choices: shuffle([
                {text: String(x), isCorrect: true, wrongMsg: ""},
                {text: String(wrongs[0]), isCorrect: false, wrongMsg: `Bom rung lắc! Mẹo: lấy ${E} + ${D} = ${E+D}, rồi ÷ ${A}.`},
                {text: String(wrongs[1]), isCorrect: false, wrongMsg: "Bom rung lắc dữ dội! Hãy suy luận ngược từ kết quả cuối cùng."},
                {text: String(wrongs[2]), isCorrect: false, wrongMsg: "Bom rung lắc! Hãy tính ngược từng bước một cho chắc chắn."},
            ]),
            correctMsg: `💥 BOOM! Suy luận ngược: ${E} + ${D} = ${E+D} → ÷ ${A} = ${x}. Bom Ánh Sáng phát nổ!!!`
        };
    }
    let x = rInt(3, 12);
    let A = rInt(2, 5);
    let B = rInt(6, 20);
    let C = rInt(2, 3);
    let t1 = x * A + B;
    while (t1 % C !== 0) { B = rInt(6, 20); t1 = x * A + B; }
    let t2 = t1 / C;
    let D = rInt(2, Math.max(3, t2 - 3));
    let E = t2 - D;
    while (E <= 1) { D = rInt(2, Math.max(3, t2 - 3)); E = t2 - D; }
    let correct = x;
    let w1 = E + D;
    let w2 = (E + D) * C - B;
    while (w2 % A !== 0 && w2 > 0) w2++;
    w2 = Math.round(w2 / A);
    let w3 = correct + rInt(1, 4) * (rInt(0,1) ? 1 : -1);
    if (w3 < 1) w3 = correct + rInt(1, 3);
    let wrongs = fillWrongs([w1, w2, w3], correct, 5);
    return {
        puzzleHTML: `<div class="puzzle-box">💣 <strong>KÍCH HOẠT BOM ÁNH SÁNG!</strong><br>Lão phù thủy thều thào niệm lời nguyền cuối cùng:<br><em>"Hỡi con số bí ẩn kia, hãy thức tỉnh!<br>Nếu đem ngươi <strong>nhân với ${A}</strong>, rồi <strong>cộng thêm ${B}</strong>,<br>được bao nhiêu <strong>chia cho ${C}</strong>, cuối cùng <strong>trừ đi ${D}</strong>,<br>sẽ nhận được kết quả là <strong>${E}</strong>."</em><br><br>Hãy tìm ra con số bí ẩn để kích nổ Bom Ánh Sáng!</div>`,
        choices: shuffle([
            {text: String(correct), isCorrect: true, wrongMsg: ""},
            {text: String(wrongs[0]), isCorrect: false, wrongMsg: "Bom rung lắc dữ dội! Hãy suy luận ngược từ kết quả cuối cùng."},
            {text: String(wrongs[1]), isCorrect: false, wrongMsg: `Bom rung lắc! Mẹo: lấy ${E} + ${D} = ${E+D}, rồi × ${C} = ${(E+D)*C}, rồi - ${B} = ${(E+D)*C-B}, rồi ÷ ${A}.`},
            {text: String(wrongs[2]), isCorrect: false, wrongMsg: "Bom rung lắc! Hãy tính ngược từng bước một cho chắc chắn."},
        ]),
        correctMsg: `💥 BOOM! Suy luận ngược: ${E} + ${D} = ${E+D} → × ${C} = ${(E+D)*C} → - ${B} = ${(E+D)*C-B} → ÷ ${A} = ${correct}. Bom Ánh Sáng phát nổ!!!`
    };
}
