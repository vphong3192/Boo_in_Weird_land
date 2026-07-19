/* =====================================================================
   questions.js - NGÂN HÀNG CÂU HỎI & GENERATOR TOÁN
   Game: Boo - Lạc Vào Thế Giới Phép Thuật (Toán & Tiếng Việt lớp 3)

   File này CHỈ chứa nội dung học tập, tách riêng khỏi engine game
   (index.html). Muốn thêm/sửa bài tập chỉ cần sửa file này, không cần
   đụng vào engine.

   ---------------------------------------------------------------------
   1. ĐỘ KHÓ VÀ CHẾ ĐỘ CHƠI
   Mỗi câu hỏi có nhãn difficulty:
   - 1 = CƠ BẢN   : bám sát chuẩn kiến thức lớp 3
   - 2 = NÂNG CAO : toán tư duy / bồi dưỡng học sinh giỏi
   Đầu game bé chọn chế độ:
   - 🌱 Cơ Bản   : chỉ nạp câu difficulty 1, generator toán chạy mức dễ
                   (số nhỏ, bài toán ít bước)
   - 🔥 Thử Thách: nạp toàn bộ câu hỏi, generator toán chạy mức khó

   ---------------------------------------------------------------------
   2. CÁCH THÊM CÂU HỎI TRẮC NGHIỆM MỚI
   QUESTION_BANK chia làm 2 phần độc lập: PHẦN I - TOÁN và
   PHẦN II - TIẾNG VIỆT. Thêm câu vào đúng phần theo mẫu:

   {
     id: "tv-036",              // mã duy nhất ("toan-###" hoặc "tv-###")
     subject: "tieng-viet",     // "toan" hoặc "tieng-viet"
     topic: "kieu-cau",         // chủ đề - phòng nào dùng topic nào xem bảng dưới
     difficulty: 1,             // 1 = cơ bản, 2 = nâng cao
     question: "Nội dung câu hỏi (được dùng thẻ HTML như <strong>, <br>)",
     choices: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
     correctIndex: 0,           // vị trí đáp án đúng trong choices (đếm từ 0)
     wrongHints: ["", "Gợi ý khi chọn nhầm B", "Gợi ý khi chọn nhầm C", "..."],
                                // cùng độ dài với choices; vị trí đáp án đúng để ""
     explain: "Lời giải thích hiện ra khi trả lời đúng."
   }

   Mỗi lần vào phòng, game chọn NGẪU NHIÊN 1 câu trong topic của phòng
   (đã lọc theo chế độ chơi). Topic toán có cả câu tĩnh lẫn generator
   thì hai nguồn được trộn ngẫu nhiên 50/50 - cứ thêm câu toán tĩnh
   vào PHẦN I là game tự dùng.

   ---------------------------------------------------------------------
   3. TOPIC ĐANG ĐƯỢC CÁC PHÒNG SỬ DỤNG

   Tiếng Việt (câu tĩnh trong QUESTION_BANK):
   - Phòng 4  (Sân Sau)           : tu-chi-dac-diem-cau
   - Phòng 6  (Thư Viện)          : chinh-ta-s-x
   - Phòng 16 (Phòng Bùa Chú)     : chinh-ta-r-d-gi
   - Phòng 17 (Tháp Chuông)       : thanh-ngu-que-huong
   - Phòng 18 (Phòng Thư Pháp)    : ca-dao-tuc-ngu
   - Phòng 19 (Hành Lang Ký Tự)   : dau-cau
   - Phòng 20 (Vườn Ngữ Nghĩa)    : tu-chi-dac-diem-doan  (Boss phase 2 cũng dùng)
   - Phòng 21 (Điện Thơ Ca)       : so-sanh
   - Phòng 25 (Thư Phòng Ngôn Từ) : kieu-cau              (Boss phase 4 cũng dùng)

   Toán (đề sinh ngẫu nhiên bằng hàm, xem MATH_GENERATORS cuối file;
   câu toán tĩnh cùng topic sẽ được trộn chung):
   - Phòng 1: thu-tu-phep-tinh      - Phòng 3: nhan-roi-tru
   - Phòng 5: bang-nhan             - Phòng 7: chieu-rong-hcn
   - Phòng 10: phep-toan-la-1       - Phòng 11: tong-hieu
   - Phòng 12: tong-ti              - Phòng 13: chuyen-gap-ba
   - Phòng 14: tong-ti-hieu         - Phòng 15: phep-toan-la-2
   - Phòng 22: dien-tich-hcn        - Phòng 23: xem-gio
   - Phòng 24: chu-vi-hinh-vuong    - Phòng 26: tim-so-bi-chia

   ---------------------------------------------------------------------
   4. NẠP ĐỀ TỪ FILE PDF/DOCX (thư mục de-bai/)
   Kho đề thô chia làm 2 mục độc lập:
   - de-bai/toan/        : đề toán
   - de-bai/tieng-viet/  : đề tiếng Việt
   Quy trình (chi tiết xem de-bai/README.md):
   1. Bỏ file PDF/docx vào đúng mục.
   2. Nhờ Claude Code: "Đọc các file mới trong de-bai/, phân loại từng
      câu (gán topic + độ khó 1/2 theo tiêu chí đầu questions.js) và
      thêm vào đúng phần TOÁN / TIẾNG VIỆT của QUESTION_BANK".
      CHỐNG TRÙNG: câu cùng dạng với câu đã có hoặc với generator toán
      (chỉ khác số liệu) thì bỏ qua, không nạp.
   3. Chạy `node tools/validate.js` - script tự bắt câu trùng dạng
      (che số thành # rồi so khuôn) và lỗi schema; phải ✅ mới commit.
   4. Duyệt lại nội dung bằng mắt (bắt buộc với tài liệu dạy trẻ!) rồi commit.
   ===================================================================== */

/* ---------- Hàm tiện ích dùng chung ---------- */
function rInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { let a = [...arr]; for (let i = a.length-1;i>0;i--) { let j = rInt(0,i); [a[i],a[j]] = [a[j],a[i]]; } return a; }

const QUESTION_BANK = [

/* =====================================================================
   PHẦN I: TOÁN (câu tĩnh trích từ đề)
   Chưa có câu nào - toán hiện dùng generator sinh đề ngẫu nhiên.
   Câu toán trích từ file PDF/docx trong de-bai/toan/ sẽ thêm vào đây
   (id "toan-001", "toan-002"...; topic trùng với generator thì hai
   nguồn tự trộn 50/50, topic mới thì khai báo phòng dùng trong
   ROOM_PUZZLES ở index.html).
   ===================================================================== */

/* =====================================================================
   PHẦN II: TIẾNG VIỆT
   ===================================================================== */

    /* ---------- topic: tu-chi-dac-diem-cau (tìm từ chỉ đặc điểm trong câu) ---------- */
    {
        id: "tv-001", subject: "tieng-viet", topic: "tu-chi-dac-diem-cau", difficulty: 1,
        question: "Trong câu: 'Những đám mây xám xịt đang bay lơ lửng trên bầu trời', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Đám mây", "Xám xịt", "Lơ lửng"],
        correctIndex: 1,
        wrongHints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ hoạt động/trạng thái."],
        explain: "'Xám xịt' là từ chỉ đặc điểm - miêu tả màu sắc của đám mây."
    },
    {
        id: "tv-002", subject: "tieng-viet", topic: "tu-chi-dac-diem-cau", difficulty: 1,
        question: "Trong câu: 'Chú chó mực đen tuyền chạy nhanh thoăn thoắt trên sân', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Chú chó", "Đen tuyền", "Thoăn thoắt"],
        correctIndex: 1,
        wrongHints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ hoạt động."],
        explain: "'Đen tuyền' là từ chỉ đặc điểm - miêu tả màu lông của chú chó."
    },
    {
        id: "tv-003", subject: "tieng-viet", topic: "tu-chi-dac-diem-cau", difficulty: 1,
        question: "Trong câu: 'Chiếc lá vàng úa rơi nhẹ nhàng xuống mặt đất', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Chiếc lá", "Vàng úa", "Nhẹ nhàng"],
        correctIndex: 1,
        wrongHints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ cách thức của hành động rơi."],
        explain: "'Vàng úa' là từ chỉ đặc điểm - miêu tả màu sắc của chiếc lá."
    },
    {
        id: "tv-004", subject: "tieng-viet", topic: "tu-chi-dac-diem-cau", difficulty: 1,
        question: "Trong câu: 'Dòng suối trong vắt chảy róc rách qua khe đá', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Dòng suối", "Trong vắt", "Róc rách"],
        correctIndex: 1,
        wrongHints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ âm thanh."],
        explain: "'Trong vắt' là từ chỉ đặc điểm - miêu tả độ trong của dòng suối."
    },
    {
        id: "tv-005", subject: "tieng-viet", topic: "tu-chi-dac-diem-cau", difficulty: 1,
        question: "Trong câu: 'Bầu trời cao vời vợi điểm vài áng mây trắng muốt', từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Bầu trời", "Vời vợi", "Áng mây"],
        correctIndex: 1,
        wrongHints: ["Đó là từ chỉ sự vật.", "", "Đó là từ chỉ sự vật."],
        explain: "'Vời vợi' là từ chỉ đặc điểm - miêu tả độ cao của bầu trời."
    },

    /* ---------- topic: chinh-ta-s-x (điền s hay x) ---------- */
    {
        id: "tv-006", subject: "tieng-viet", topic: "chinh-ta-s-x", difficulty: 1,
        question: "Điền 's' hay 'x' - cách viết nào dưới đây <strong>ĐÚNG</strong> chính tả?",
        choices: ["sâu chuỗi, xuất hiện", "xâu chuỗi, suất hiện"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Viết đúng phải là: 'sâu chuỗi, xuất hiện'."],
        explain: "Viết đúng chính tả là: 'sâu chuỗi, xuất hiện'."
    },
    {
        id: "tv-007", subject: "tieng-viet", topic: "chinh-ta-s-x", difficulty: 1,
        question: "Điền 's' hay 'x' - cách viết nào dưới đây <strong>ĐÚNG</strong> chính tả?",
        choices: ["sản xuất, xôn xao", "xản xuất, sôn sao"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Viết đúng phải là: 'sản xuất, xôn xao'."],
        explain: "Viết đúng chính tả là: 'sản xuất, xôn xao'."
    },
    {
        id: "tv-008", subject: "tieng-viet", topic: "chinh-ta-s-x", difficulty: 1,
        question: "Điền 's' hay 'x' - cách viết nào dưới đây <strong>ĐÚNG</strong> chính tả?",
        choices: ["sung sướng, xinh xắn", "xung xướng, sinh sắn"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Viết đúng phải là: 'sung sướng, xinh xắn'."],
        explain: "Viết đúng chính tả là: 'sung sướng, xinh xắn'."
    },
    {
        id: "tv-009", subject: "tieng-viet", topic: "chinh-ta-s-x", difficulty: 1,
        question: "Điền 's' hay 'x' - cách viết nào dưới đây <strong>ĐÚNG</strong> chính tả?",
        choices: ["sáng suốt, xán lạn", "xáng xuốt, sán lạn"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Viết đúng phải là: 'sáng suốt, xán lạn'."],
        explain: "Viết đúng chính tả là: 'sáng suốt, xán lạn'."
    },

    /* ---------- topic: chinh-ta-r-d-gi (phân biệt r/d/gi/l) ---------- */
    {
        id: "tv-010", subject: "tieng-viet", topic: "chinh-ta-r-d-gi", difficulty: 1,
        question: "Trong bốn cụm từ dưới đây, cụm từ nào viết <strong>ĐÚNG</strong> chính tả?",
        choices: ["Suối chảy dóc dách", "Nụ cười rạng rỡ", "Sức khỏe rẻo rai", "Tiếng cười ròn rã"],
        correctIndex: 1,
        wrongHints: ["Sai! Viết đúng là 'róc rách'.", "", "Sai! Viết đúng là 'dẻo dai'.", "Sai! Viết đúng là 'giòn giã'."],
        explain: "'Nụ cười rạng rỡ' là cụm từ duy nhất viết đúng chính tả."
    },
    {
        id: "tv-011", subject: "tieng-viet", topic: "chinh-ta-r-d-gi", difficulty: 1,
        question: "Trong bốn cụm từ dưới đây, cụm từ nào viết <strong>ĐÚNG</strong> chính tả?",
        choices: ["Hạt sương dung dinh", "Ánh nắng rực rỡ", "Ngày nghỉ rảnh dỗi", "Giọng nói rịu ràng"],
        correctIndex: 1,
        wrongHints: ["Sai! Viết đúng là 'rung rinh'.", "", "Sai! Viết đúng là 'rảnh rỗi'.", "Sai! Viết đúng là 'dịu dàng'."],
        explain: "'Ánh nắng rực rỡ' là cụm từ duy nhất viết đúng chính tả."
    },
    {
        id: "tv-012", subject: "tieng-viet", topic: "chinh-ta-r-d-gi", difficulty: 1,
        question: "Trong bốn cụm từ dưới đây, cụm từ nào viết <strong>ĐÚNG</strong> chính tả?",
        choices: ["Ánh đèn nung ninh", "Mặt trời dạng đông", "Hạt gạo dẻo thơm", "Em bé rễ thương"],
        correctIndex: 2,
        wrongHints: ["Sai! Viết đúng là 'lung linh'.", "Sai! Viết đúng là 'rạng đông'.", "", "Sai! Viết đúng là 'dễ thương'."],
        explain: "'Hạt gạo dẻo thơm' là cụm từ duy nhất viết đúng chính tả."
    },

    /* ---------- topic: thanh-ngu-que-huong ---------- */
    {
        id: "tv-013", subject: "tieng-viet", topic: "thanh-ngu-que-huong", difficulty: 1,
        question: "Thành ngữ nào dưới đây <strong>KHÔNG</strong> nói về quê hương, đất nước?",
        choices: ["Non xanh nước biếc", "Thức khuya dậy sớm", "Chôn rau cắt rốn", "Quê cha đất tổ"],
        correctIndex: 1,
        wrongHints: ["Đây LÀ thành ngữ về quê hương.", "", "Đây LÀ thành ngữ về quê hương.", "Đây LÀ thành ngữ về quê hương."],
        explain: "'Thức khuya dậy sớm' nói về sự chăm chỉ, KHÔNG phải thành ngữ về quê hương."
    },
    {
        id: "tv-014", subject: "tieng-viet", topic: "thanh-ngu-que-huong", difficulty: 1,
        question: "Thành ngữ nào dưới đây <strong>KHÔNG</strong> nói về quê hương, đất nước?",
        choices: ["Non sông gấm vóc", "Dám nghĩ dám làm", "Chôn rau cắt rốn", "Thẳng cánh cò bay"],
        correctIndex: 1,
        wrongHints: ["Đây LÀ thành ngữ về quê hương.", "", "Đây LÀ thành ngữ về quê hương.", "Đây LÀ thành ngữ về quê hương."],
        explain: "'Dám nghĩ dám làm' nói về đức tính mạnh dạn, KHÔNG phải thành ngữ về quê hương."
    },
    {
        id: "tv-015", subject: "tieng-viet", topic: "thanh-ngu-que-huong", difficulty: 1,
        question: "Thành ngữ nào dưới đây <strong>KHÔNG</strong> nói về quê hương, đất nước?",
        choices: ["Quê cha đất tổ", "Học một biết mười", "Non xanh nước biếc", "Chôn rau cắt rốn"],
        correctIndex: 1,
        wrongHints: ["Đây LÀ thành ngữ về quê hương.", "", "Đây LÀ thành ngữ về quê hương.", "Đây LÀ thành ngữ về quê hương."],
        explain: "'Học một biết mười' nói về sự thông minh, KHÔNG phải thành ngữ về quê hương."
    },

    /* ---------- topic: ca-dao-tuc-ngu (điền từ vào câu ca dao) ---------- */
    {
        id: "tv-016", subject: "tieng-viet", topic: "ca-dao-tuc-ngu", difficulty: 1,
        question: "Điền từ còn thiếu vào câu: \"Công cha như ___, nghĩa mẹ như nước trong nguồn chảy ra.\"",
        choices: ["núi Thái Sơn", "núi cao biển rộng", "cây đại thụ", "biển Đông"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Đây không phải câu gốc.", "Sai! Đây không phải câu gốc.", "Sai! Đây không phải câu gốc."],
        explain: "Câu đúng: \"Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra.\""
    },
    {
        id: "tv-017", subject: "tieng-viet", topic: "ca-dao-tuc-ngu", difficulty: 1,
        question: "Điền từ còn thiếu vào câu: \"Anh em như thể ___, rách lành đùm bọc dở hay đỡ đần.\"",
        choices: ["tay chân", "chân tay", "cá tôm", "ruột rà"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Câu gốc là 'tay chân'.", "Sai! Đây không phải câu gốc.", "Sai! Đây không phải câu gốc."],
        explain: "Câu đúng: \"Anh em như thể tay chân, rách lành đùm bọc dở hay đỡ đần.\""
    },
    {
        id: "tv-018", subject: "tieng-viet", topic: "ca-dao-tuc-ngu", difficulty: 1,
        question: "Điền từ còn thiếu vào câu: \"Nhiễu điều phủ lấy ___, người trong một nước phải thương nhau cùng.\"",
        choices: ["giá gương", "tấm gương", "gương soi", "bức tranh"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Câu gốc là 'giá gương'.", "Sai! Đây không phải câu gốc.", "Sai! Đây không phải câu gốc."],
        explain: "Câu đúng: \"Nhiễu điều phủ lấy giá gương, người trong một nước phải thương nhau cùng.\""
    },

    /* ---------- topic: dau-cau (tìm dấu chấm đặt sai vị trí) ---------- */
    {
        id: "tv-019", subject: "tieng-viet", topic: "dau-cau", difficulty: 1,
        question: "\"Trong lâu đài, mỗi kẻ một việc(1). Lính canh gác cổng(2). Tuần tra tháp canh. Phù thủy già lẩm nhẩm thần chú(3). Triệu hồi bóng ma. Lũ yêu tinh nhóm lò, luyện phép thuật(4).\"<br>Hỏi dấu chấm số mấy bị đặt <strong>SAI</strong> vị trí?",
        choices: ["Dấu chấm (1)", "Dấu chấm (2)", "Dấu chấm (3)", "Dấu chấm (4)"],
        correctIndex: 1,
        wrongHints: ["Sai! Dấu chấm (1) đặt đúng vị trí.", "", "Sai! Dấu chấm (3) đặt đúng vị trí.", "Sai! Dấu chấm (4) đặt đúng vị trí."],
        explain: "Dấu chấm (2) cắt sai câu: 'Lính canh gác cổng, tuần tra tháp canh' phải là một câu."
    },
    {
        id: "tv-020", subject: "tieng-viet", topic: "dau-cau", difficulty: 1,
        question: "\"Trong lâu đài, mỗi kẻ một việc(1). Bọn yêu tinh nhỏ gom củi khô(2). Nhóm lò lửa lớn. Phù thủy già đọc thần chú(3). Gọi gió triệu sét. Lũ quạ bay rợp trời đen kịt(4).\"<br>Hỏi dấu chấm số mấy bị đặt <strong>SAI</strong> vị trí?",
        choices: ["Dấu chấm (1)", "Dấu chấm (2)", "Dấu chấm (3)", "Dấu chấm (4)"],
        correctIndex: 1,
        wrongHints: ["Sai! Dấu chấm (1) đặt đúng vị trí.", "", "Sai! Dấu chấm (3) đặt đúng vị trí.", "Sai! Dấu chấm (4) đặt đúng vị trí."],
        explain: "Dấu chấm (2) cắt sai câu: 'Bọn yêu tinh nhỏ gom củi khô, nhóm lò lửa lớn' phải là một câu."
    },
    {
        id: "tv-021", subject: "tieng-viet", topic: "dau-cau", difficulty: 1,
        question: "\"Trong lâu đài, mỗi kẻ một việc(1). Phù thủy già nghiền ngẫm sách cổ(2). Tìm kiếm phép thuật. Lũ dơi treo mình trên xà nhà(3). Rỉ rả kêu suốt đêm(4).\"<br>Hỏi dấu chấm số mấy bị đặt <strong>SAI</strong> vị trí?",
        choices: ["Dấu chấm (1)", "Dấu chấm (2)", "Dấu chấm (3)", "Dấu chấm (4)"],
        correctIndex: 1,
        wrongHints: ["Sai! Dấu chấm (1) đặt đúng vị trí.", "", "Sai! Dấu chấm (3) đặt đúng vị trí.", "Sai! Dấu chấm (4) đặt đúng vị trí."],
        explain: "Dấu chấm (2) cắt sai câu: 'Phù thủy già nghiền ngẫm sách cổ, tìm kiếm phép thuật' phải là một câu."
    },

    /* ---------- topic: tu-chi-dac-diem-doan (tìm từ chỉ đặc điểm trong đoạn văn) ---------- */
    {
        id: "tv-022", subject: "tieng-viet", topic: "tu-chi-dac-diem-doan", difficulty: 1,
        question: "Đoạn văn: \"Màn đêm đen kịt bao trùm lâu đài, những ngọn nến le lói chập chờn trong gió, những bức tường rêu phong cổ kính đứng im lìm giữa màn sương.\"<br>Trong các từ sau, từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Màn đêm", "Ngọn nến", "Đen kịt", "Bức tường"],
        correctIndex: 2,
        wrongHints: ["Sai! 'Màn đêm' là từ chỉ sự vật.", "Sai! 'Ngọn nến' là từ chỉ sự vật.", "", "Sai! 'Bức tường' là từ chỉ sự vật."],
        explain: "'Đen kịt' là từ chỉ đặc điểm (tính từ)."
    },
    {
        id: "tv-023", subject: "tieng-viet", topic: "tu-chi-dac-diem-doan", difficulty: 1,
        question: "Đoạn văn: \"Lão phù thủy già nua chậm chạp bước qua hành lang tối tăm, chiếc áo choàng rách nát kéo lê trên sàn đá lạnh lẽo.\"<br>Trong các từ sau, từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Lão phù thủy", "Chậm chạp", "Áo choàng", "Sàn đá"],
        correctIndex: 1,
        wrongHints: ["Sai! 'Lão phù thủy' là từ chỉ sự vật.", "", "Sai! 'Áo choàng' là từ chỉ sự vật.", "Sai! 'Sàn đá' là từ chỉ sự vật."],
        explain: "'Chậm chạp' là từ chỉ đặc điểm (tính từ)."
    },
    {
        id: "tv-024", subject: "tieng-viet", topic: "tu-chi-dac-diem-doan", difficulty: 1,
        question: "Đoạn văn: \"Ngọn lửa xanh lét bùng lên từ vạc dầu, tỏa ra thứ ánh sáng ma quái rùng rợn khắp căn phòng.\"<br>Trong các từ sau, từ nào là từ chỉ <strong>ĐẶC ĐIỂM</strong>?",
        choices: ["Ngọn lửa", "Vạc dầu", "Xanh lét", "Căn phòng"],
        correctIndex: 2,
        wrongHints: ["Sai! 'Ngọn lửa' là từ chỉ sự vật.", "Sai! 'Vạc dầu' là từ chỉ sự vật.", "", "Sai! 'Căn phòng' là từ chỉ sự vật."],
        explain: "'Xanh lét' là từ chỉ đặc điểm (tính từ)."
    },

    /* ---------- topic: so-sanh (tìm hình ảnh so sánh trong thơ) ---------- */
    {
        id: "tv-025", subject: "tieng-viet", topic: "so-sanh", difficulty: 1,
        question: "\"Ngọn tháp vươn như lưỡi kiếm<br>Đâm thủng màn đêm u tối.\"<br>Trong hai câu thơ trên, sự vật nào được <strong>so sánh</strong> với sự vật nào?",
        choices: ["Ngọn tháp ⇔ lưỡi kiếm", "Ngọn tháp ⇔ màn đêm", "Lưỡi kiếm ⇔ màn đêm"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Ngọn tháp ĐÂM THỦNG màn đêm, đó không phải so sánh.", "Sai! Không có so sánh nào giữa lưỡi kiếm và màn đêm."],
        explain: "Hình ảnh so sánh: Ngọn tháp ⇔ lưỡi kiếm (có từ so sánh 'như')."
    },
    {
        id: "tv-026", subject: "tieng-viet", topic: "so-sanh", difficulty: 1,
        question: "\"Mặt trăng treo như chiếc đèn lồng<br>Soi sáng con đường về.\"<br>Trong hai câu thơ trên, sự vật nào được <strong>so sánh</strong> với sự vật nào?",
        choices: ["Mặt trăng ⇔ đèn lồng", "Mặt trăng ⇔ con đường", "Đèn lồng ⇔ con đường"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Mặt trăng SOI SÁNG con đường, đó không phải so sánh.", "Sai! Không có so sánh nào giữa đèn lồng và con đường."],
        explain: "Hình ảnh so sánh: Mặt trăng ⇔ đèn lồng (có từ so sánh 'như')."
    },
    {
        id: "tv-027", subject: "tieng-viet", topic: "so-sanh", difficulty: 1,
        question: "\"Làn sương trắng như tấm khăn voan<br>Phủ kín khu rừng già.\"<br>Trong hai câu thơ trên, sự vật nào được <strong>so sánh</strong> với sự vật nào?",
        choices: ["Làn sương ⇔ khăn voan", "Làn sương ⇔ rừng già", "Khăn voan ⇔ rừng già"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Làn sương PHỦ KÍN khu rừng, đó không phải so sánh.", "Sai! Không có so sánh nào giữa khăn voan và rừng già."],
        explain: "Hình ảnh so sánh: Làn sương ⇔ khăn voan (có từ so sánh 'như')."
    },

    /* ---------- topic: kieu-cau (phân biệt câu kể/hỏi/cảm/khiến) ---------- */
    {
        id: "tv-028", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Ôi, lâu đài này thật đẹp quá!\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Câu có từ 'ôi', 'quá' bày tỏ cảm xúc, đây là câu cảm.", "Sai! Đây không phải câu hỏi.", "Sai! Đây không phải câu yêu cầu."],
        explain: "'Ôi, lâu đài này thật đẹp quá!' là câu cảm (có từ 'ôi', 'quá' bày tỏ cảm xúc)."
    },
    {
        id: "tv-029", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Boo đang lạc trong lâu đài phép thuật.\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 1,
        wrongHints: ["Sai! Câu không có từ cảm thán.", "", "Sai! Cuối câu là dấu chấm, không phải dấu chấm hỏi.", "Sai! Câu này chỉ kể lại sự việc."],
        explain: "'Boo đang lạc trong lâu đài phép thuật.' là câu kể (thuật lại sự việc)."
    },
    {
        id: "tv-030", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Bạn có nhìn thấy chiếc chìa khóa bạc không?\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 2,
        wrongHints: ["Sai! Đây là câu hỏi, không phải cảm thán.", "Sai! Cuối câu là dấu chấm hỏi.", "", "Sai! Đây là câu hỏi, không phải lời yêu cầu."],
        explain: "'Bạn có nhìn thấy chiếc chìa khóa bạc không?' là câu hỏi (có cặp từ 'có... không' và dấu chấm hỏi)."
    },
    {
        id: "tv-031", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Hãy mở cánh cửa này ra!\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 3,
        wrongHints: ["Sai! Có dấu chấm than nhưng 'Hãy' là từ cầu khiến.", "Sai! Đây là câu cầu khiến.", "Sai! Đây không phải câu hỏi.", ""],
        explain: "'Hãy mở cánh cửa này ra!' là câu khiến (có từ 'hãy' thể hiện yêu cầu)."
    },
    {
        id: "tv-032", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Chà, ngọn đèn dầu sáng thật rực rỡ làm sao!\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 0,
        wrongHints: ["", "Sai! Câu có từ 'Chà', 'làm sao' thể hiện cảm xúc.", "Sai! Đây không phải câu hỏi.", "Sai! Đây không phải câu yêu cầu."],
        explain: "'Chà, ngọn đèn dầu sáng thật rực rỡ làm sao!' là câu cảm (có 'chà', 'làm sao')."
    },
    {
        id: "tv-033", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Lão phù thủy đang đọc thần chú trong phòng.\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 1,
        wrongHints: ["Sai! Câu không có từ cảm thán nào.", "", "Sai! Câu kết thúc bằng dấu chấm.", "Sai! Đây chỉ là câu kể."],
        explain: "'Lão phù thủy đang đọc thần chú trong phòng.' là câu kể (thuật lại sự việc)."
    },
    {
        id: "tv-034", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Mấy giờ thì mặt trăng lên đỉnh tháp?\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 2,
        wrongHints: ["Sai! Đây là câu hỏi có từ để hỏi 'mấy giờ'.", "Sai! Cuối câu có dấu chấm hỏi.", "", "Sai! Đây là câu hỏi, không phải lời cầu khiến."],
        explain: "'Mấy giờ thì mặt trăng lên đỉnh tháp?' là câu hỏi (có từ để hỏi 'mấy giờ')."
    },
    {
        id: "tv-035", subject: "tieng-viet", topic: "kieu-cau", difficulty: 1,
        question: "Câu: <em>\"Boo ơi, hãy cẩn thận với bẫy phép!\"</em><br>Đây là <strong>kiểu câu gì</strong>?",
        choices: ["Câu cảm", "Câu kể", "Câu hỏi", "Câu khiến"],
        correctIndex: 3,
        wrongHints: ["Sai! Đây là lời nhắc nhở, có từ 'hãy' cầu khiến.", "Sai! Đây là câu cầu khiến (có 'hãy').", "Sai! Đây không phải câu hỏi.", ""],
        explain: "'Boo ơi, hãy cẩn thận với bẫy phép!' là câu khiến (có từ 'hãy' thể hiện lời nhắc nhở, yêu cầu)."
    },
];

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
   GENERATOR TOÁN (đề sinh ngẫu nhiên, đáp án tự tính)
   Mỗi hàm nhận diff (1 = Cơ Bản, 2 = Thử Thách) và trả về:
   { puzzleHTML, choices: [{text, isCorrect, wrongMsg}], correctMsg }
   Mức Cơ Bản dùng số nhỏ hơn; các dạng toán nâng cao (tổng-hiệu,
   tổng-tỉ, phép toán lạ...) có phiên bản dễ cùng bối cảnh truyện.
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
        // Mức dễ: phép toán lạ một bước, số nhỏ
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
        // Mức dễ: biết thùng A và phần hơn, tìm thùng B (phép trừ)
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
        // Mức dễ: gấp một số lên nhiều lần (phép nhân)
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
        // Mức dễ: tìm phần chênh lệch giữa hai bể (phép trừ)
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
        // Mức dễ: biết B và tỉ lệ, tính hiệu A-B (nhân rồi trừ)
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
        // Mức dễ: phép gương một bước, không lồng nhau
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
   Nhận diff như generator thường. Phase 2 và 4 lấy câu tiếng Việt từ
   QUESTION_BANK nên thêm câu vào topic tu-chi-dac-diem-doan / kieu-cau
   là boss cũng có đề mới.
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
        // Mức dễ: biết tổng và một số, tìm số kia rồi nhân
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
        // Mức dễ: suy luận ngược 2 bước (nhân A rồi trừ D được E)
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
