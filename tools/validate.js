#!/usr/bin/env node
/* =====================================================================
   tools/validate.js - Kiểm tra ngân hàng câu hỏi (questions.js)

   Chạy:  node tools/validate.js
   (hoặc: node tools/validate.js <đường-dẫn-questions.js> để kiểm file khác)

   BẮT BUỘC chạy sau mỗi lần nạp đề mới từ de-bai/. Script kiểm tra:
   1. Schema từng câu: id duy nhất, đúng 1 đáp án đúng, correctIndex
      hợp lệ, không có đáp án trùng nhau, difficulty 1/2...
   2. TRÙNG LẶP TRONG NGÂN HÀNG: hai câu "cùng dạng chỉ khác số" -
      che toàn bộ số liệu thành # rồi so khuôn câu hỏi + bộ đáp án;
      giống nhau nghĩa là cùng một dạng bài, chỉ thay số -> phải bỏ
      bớt, không nạp cả hai.
   3. TRÙNG DẠNG VỚI GENERATOR: câu tĩnh có khuôn trùng với đề do
      generator toán tự sinh -> bỏ, vì generator đã sinh vô hạn biến
      thể số của dạng đó rồi.

   Thoát mã 0 nếu sạch, mã 1 nếu có lỗi (không được commit khi còn lỗi).
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = process.argv[2] || path.join(__dirname, "..", "questions.js");
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file) });
const grab = name => vm.runInContext(`typeof ${name} !== "undefined" ? ${name} : null`, ctx);
const BANK = grab("QUESTION_BANK");
const GENS = grab("MATH_GENERATORS");
const BOSS_GENS = vm.runInContext("[genBossPhase1, genBossPhase3, genBossPhase5]", ctx);
const SPECS = grab("MATH_SPECS") || {};
const TV_TEMPLATES = grab("TV_TEMPLATES") || {};
const TV_MATERIALS = grab("TV_MATERIALS") || {};

const errors = [];
const warns = [];

/* ---------- 0. Cấu trúc dạng/khuôn/ngữ liệu ---------- */
// Mỗi dạng toán phải có spec (metadata) và ngược lại
for (const topic in GENS) {
    const s = SPECS[topic];
    if (!s) errors.push(`Dạng toán "${topic}" chưa có MATH_SPECS (thiếu tên/ví dụ/note biến đổi)`);
    else ["name", "example", "levels", "notes"].forEach(f => {
        if (!s[f]) errors.push(`MATH_SPECS["${topic}"]: thiếu trường ${f}`);
    });
}
for (const key in SPECS) {
    if (!GENS[key] && !key.startsWith("boss-")) warns.push(`MATH_SPECS["${key}"] không có generator tương ứng (spec mồ côi)`);
}
["boss-1", "boss-3", "boss-5"].forEach(k => {
    if (!SPECS[k]) warns.push(`Thiếu spec cho dạng toán của boss: ${k}`);
});
// Ngữ liệu tiếng Việt phải có khuôn, khuôn nên có ngữ liệu
for (const topic in TV_MATERIALS) {
    if (!TV_TEMPLATES[topic]) errors.push(`TV_MATERIALS["${topic}"] không có khuôn trong TV_TEMPLATES (ngữ liệu mồ côi, game không dùng được)`);
}
for (const topic in TV_TEMPLATES) {
    if (!TV_MATERIALS[topic] || !TV_MATERIALS[topic].length) warns.push(`Khuôn "${topic}" chưa có ngữ liệu nào trong TV_MATERIALS`);
    if (typeof TV_TEMPLATES[topic].build !== "function") errors.push(`TV_TEMPLATES["${topic}"]: thiếu hàm build(m)`);
    if (!TV_TEMPLATES[topic].name) warns.push(`TV_TEMPLATES["${topic}"]: nên đặt trường name mô tả khuôn`);
}

const stripHtml = s => String(s).replace(/<[^>]*>/g, " ");
/* Chuẩn hóa để so "cùng dạng khác số": bỏ HTML, thường hóa,
   che mọi con số thành #, gộp khoảng trắng */
const normalize = s => stripHtml(s).toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
const signature = q => normalize(q.question) + " || " + q.choices.map(normalize).sort().join(" | ");

/* ---------- 1. Schema ---------- */
const ids = new Set();
BANK.forEach((q, i) => {
    const tag = q.id || `(câu thứ ${i + 1} không có id)`;
    if (!q.id) errors.push(`${tag}: thiếu id`);
    else if (ids.has(q.id)) errors.push(`${tag}: id bị dùng 2 lần`);
    ids.add(q.id);
    if (!q.topic) errors.push(`${tag}: thiếu topic`);
    if (q.subject !== "toan" && q.subject !== "tieng-viet") errors.push(`${tag}: subject phải là "toan" hoặc "tieng-viet"`);
    if (q.difficulty !== 1 && q.difficulty !== 2) errors.push(`${tag}: difficulty phải là 1 hoặc 2`);
    if (!q.question) errors.push(`${tag}: thiếu question`);
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
        errors.push(`${tag}: cần ít nhất 2 đáp án`);
        return;
    }
    if (new Set(q.choices.map(c => c.trim())).size !== q.choices.length) errors.push(`${tag}: có đáp án trùng nhau`);
    if (!(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.choices.length)) errors.push(`${tag}: correctIndex ngoài phạm vi choices`);
    if (q.wrongHints && q.wrongHints.length !== q.choices.length) warns.push(`${tag}: wrongHints không cùng độ dài với choices`);
    if (q.wrongHints && q.wrongHints[q.correctIndex]) warns.push(`${tag}: wrongHints tại vị trí đáp án đúng nên để ""`);
    if (!q.explain) warns.push(`${tag}: thiếu explain (lời giải thích khi trả lời đúng)`);
});

/* ---------- 2. Trùng lặp trong ngân hàng (cùng dạng chỉ khác số) ---------- */
const seen = new Map();
BANK.forEach(q => {
    if (!q.question || !Array.isArray(q.choices)) return;
    const sig = signature(q);
    if (seen.has(sig)) {
        errors.push(`${q.id} TRÙNG DẠNG (chỉ khác số liệu) với ${seen.get(sig)} -> bỏ một trong hai, không nạp cả hai`);
    } else {
        seen.set(sig, q.id);
    }
});

/* ---------- 3. Trùng dạng với generator toán ---------- */
const genSigs = new Map();
const sampleGen = (fn, name) => {
    for (const diff of [1, 2]) {
        for (let i = 0; i < 8; i++) {
            try { genSigs.set(normalize(fn(diff).puzzleHTML), name); }
            catch (e) { errors.push(`generator ${name} (diff ${diff}) lỗi khi chạy: ${e.message}`); return; }
        }
    }
};
for (const topic in GENS) sampleGen(GENS[topic], topic);
BOSS_GENS.forEach(fn => sampleGen(fn, fn.name));

BANK.forEach(q => {
    if (!q.question) return;
    const nq = normalize(q.question);
    if (genSigs.has(nq)) {
        errors.push(`${q.id} TRÙNG DẠNG với generator "${genSigs.get(nq)}" -> bỏ, generator đã tự sinh vô hạn biến thể số của dạng này`);
    }
});

/* ---------- Báo cáo ---------- */
console.log(`Đã kiểm tra ${BANK.length} câu trong ngân hàng.`);
if (warns.length) {
    console.log(`\n⚠️  ${warns.length} cảnh báo:`);
    warns.forEach(w => console.log("   - " + w));
}
if (errors.length) {
    console.log(`\n❌ ${errors.length} lỗi (phải sửa hết trước khi commit):`);
    errors.forEach(e => console.log("   - " + e));
    process.exit(1);
}
console.log("\n✅ Ngân hàng câu hỏi hợp lệ, không có câu trùng dạng.");
