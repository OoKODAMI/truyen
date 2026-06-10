/* =========================================================================
   data.js — TOÀN BỘ thư viện ở đây
   -------------------------------------------------------------------------
   ➤ THÊM BỘ TRUYỆN MỚI:    thêm 1 khối {...} vào mảng STORIES.
   ➤ THÊM CHƯƠNG cho 1 bộ:  thêm 1 khối {...} vào mảng `chapters` của bộ đó.

   URL hoạt động:
     index.html                          → thư viện
     timeline.html                       → dòng đọc
     story.html?s=aurora                 → mục lục bộ "aurora"
     reader.html?s=aurora&c=01           → đọc chương 01 của bộ "aurora"
   ========================================================================= */

const LIBRARY = {
  title: "Thư Viện Của DAT",
  intro: "Nơi tập hợp các bộ truyện do tôi viết. Chọn một bộ để bắt đầu, hoặc xem dòng đọc gợi ý.",
  author: "DAT",
  year: 2026,
};

/* -------------------------------------------------------------------------
   STORIES — mỗi phần tử là MỘT BỘ TRUYỆN

   Trường bắt buộc:  id, title, summary, chapters
   Trường tuỳ chọn:  cover, status, about, readingOrder

   • id           : mã không dấu, dùng cho URL (vd: "aurora", "muc-1")
   • status       : "Đang viết" | "Hoàn thành" | "Tạm dừng" | ...
   • summary      : 1–2 câu — hiện trên thẻ thư viện và timeline
   • about        : đoạn dài hơn cho trang bộ truyện (Markdown được)
   • readingOrder : số thứ tự trên timeline (nhỏ → lớn = đọc trước → đọc sau)
   ------------------------------------------------------------------------- */
const STORIES = [
  {
    id: "aurora",
    title: "Aurora",
    status: "Đang viết",
    cover: "assets/images/covers/aurora.svg",
    summary: "Cô bé Aurora lớn lên cùng ông bà nuôi, học bài học đầu đời về tình thân và sách vở.",
    about:
      "Một câu chuyện ấm áp về Aurora — cô bé được ông Muller (thợ mộc) và bà Oliva nuôi nấng. " +
      "Lấy cảm hứng từ giọng văn Nguyễn Nhật Ánh: hoài niệm, dịu, để cảm xúc lặng lẽ thấm.",
    readingOrder: 1,
    chapters: [
      { id: "01", num: "Chương 1", title: "Tên chương một",   file: "stories/aurora/chuong-01.md" },
      { id: "02", num: "Chương 2", title: "Tên chương hai",   file: "stories/aurora/chuong-02.md" },
      { id: "03", num: "Chương 3", title: "Tên chương ba",    file: "stories/aurora/chuong-03.md" },
    ],
  },
  {
    id: "bo-thu-hai",
    title: "Bộ Thứ Hai",
    status: "Sắp ra mắt",
    cover: "assets/images/covers/bo-2.svg",
    summary: "Mô tả ngắn cho bộ truyện thứ hai. Thay nội dung này khi bạn bắt đầu viết.",
    about: "Phần giới thiệu dài hơn cho bộ thứ hai. Có thể dùng **Markdown**.",
    readingOrder: 2,
    chapters: [
      { id: "01", num: "Chương 1", title: "Tên chương một", file: "stories/bo-thu-hai/chuong-01.md" },
    ],
  },
];
