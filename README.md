# Thư Viện Truyện

Một website tĩnh đơn giản để đọc nhiều bộ truyện do bạn viết: thư viện chọn bộ → mục lục chương → đọc. Có timeline gợi ý thứ tự đọc, bấm vào là mở thẳng bộ đó.

---

## 1. Đưa lên GitHub Pages (một lần)

1. Tạo repo mới trên GitHub.
2. Tải **cả thư mục `thu-vien`** lên repo — quan trọng nhất là phải giữ nguyên cấu trúc thư mục `assets/` và `stories/`. Cách chắc ăn: ở trang Upload của GitHub, **kéo cả các folder vào**, đừng kéo từng file rời.
3. Vào **Settings → Pages → Source: main / (root)** rồi Save.
4. Đợi một phút. Web ở địa chỉ `https://<tên-github>.github.io/<tên-repo>/`.

File `.nojekyll` đã có sẵn.

---

## 2. Thêm một bộ truyện mới

**Bước 1.** Tạo thư mục mới trong `stories/`, ví dụ `stories/ten-bo-moi/`. Đặt file chương đầu tiên vào: `stories/ten-bo-moi/chuong-01.md`.

**Bước 2.** Mở `assets/js/data.js`, sao chép một khối trong `STORIES` rồi sửa:

```js
{
  id: "ten-bo-moi",
  title: "Tên Bộ Mới",
  status: "Đang viết",
  cover: "assets/images/covers/ten-bo-moi.svg",
  summary: "Một, hai câu giới thiệu ngắn.",
  about: "Mô tả dài hơn, có thể dùng **Markdown**.",
  readingOrder: 3,    // vị trí trên timeline (nhỏ hơn = đọc trước)
  chapters: [
    { id: "01", num: "Chương 1", title: "Tên chương", file: "stories/ten-bo-moi/chuong-01.md" },
  ],
},
```

Xong. Thư viện và timeline tự cập nhật.

---

## 3. Thêm chương vào bộ đã có

1. Tạo file `stories/<tên-bộ>/chuong-04.md` (hoặc tên nào bạn thích).
2. Trong `data.js`, mảng `chapters` của bộ đó, thêm:

```js
{ id: "04", num: "Chương 4", title: "Tên chương bốn", file: "stories/<tên-bộ>/chuong-04.md" },
```

---

## 4. Chèn ảnh minh hoạ

Bỏ ảnh vào `assets/images/`, rồi trong file `.md` viết:

```markdown
![Chú thích sẽ hiện mờ dưới ảnh](assets/images/canh-mua-he.jpg)
```

---

## 5. Đổi tên thư viện, màu

- Tên thư viện và lời giới thiệu: đầu file `assets/js/data.js`, mục `LIBRARY`.
- Màu nhấn: file `assets/css/style.css`, dòng `--accent` ở phần `:root`.

---

## Cấu trúc

```
.
├── index.html          ← thư viện (lưới các bộ)
├── story.html          ← trang một bộ (mục lục chương)
├── reader.html         ← trang đọc một chương
├── timeline.html       ← dòng đọc gợi ý
├── stories/            ← nội dung từng bộ — BẠN VIẾT Ở ĐÂY
│   └── aurora/
│       ├── chuong-01.md
│       └── ...
├── assets/
│   ├── css/style.css
│   ├── js/data.js      ← KHAI BÁO bộ & chương — BẠN SỬA Ở ĐÂY
│   ├── js/app.js
│   ├── js/marked.min.js
│   └── images/
└── .nojekyll
```

## Xem thử trên máy

Vì trang đọc nạp file `.md` qua mạng, nhấp đúp `index.html` sẽ không đủ. Chạy server cục bộ:

```bash
cd thu-vien
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

Hoặc trong VS Code: cài extension *Live Server* → chuột phải `index.html` → *Open with Live Server*.
