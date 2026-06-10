/* =========================================================================
   app.js — logic cho thư viện
   ========================================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const findStory = (id) => STORIES.find((s) => s.id === id);
const findChapter = (story, cid) => story.chapters.find((c) => c.id === cid);
const chapterIdx = (story, cid) => story.chapters.findIndex((c) => c.id === cid);

function fillChrome() {
  $$("[data-lib-title]").forEach((n) => (n.textContent = LIBRARY.title));
  $$("[data-year]").forEach((n) => (n.textContent = LIBRARY.year));
  $$("[data-author]").forEach((n) => (n.textContent = LIBRARY.author));
}

function enhanceFigures(container) {
  $$("p > img", container).forEach((img) => {
    const p = img.parentElement;
    if (p.childNodes.length !== 1) return;
    const fig = el("figure");
    fig.appendChild(img.cloneNode());
    const cap = img.getAttribute("alt");
    if (cap) fig.appendChild(el("figcaption", null, cap));
    p.replaceWith(fig);
  });
}

function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((n) => obs.observe(n));
}

/* =========================================================================
   THƯ VIỆN — index.html
   ========================================================================= */
function initLibrary() {
  fillChrome();
  $("#lib-title").textContent = LIBRARY.title;
  $("#lib-intro").textContent = LIBRARY.intro;

  const grid = $("#lib-grid");
  if (!STORIES.length) {
    grid.replaceWith(el("p", "empty", "Chưa có bộ nào. Thêm bộ trong <code>assets/js/data.js</code>."));
    return;
  }
  STORIES.forEach((s) => {
    const a = el("a", "story-card reveal");
    a.href = `story.html?s=${s.id}`;
    a.innerHTML = `
      ${s.cover ? `<img class="story-card__cover" src="${s.cover}" alt="" loading="lazy">` : `<div class="story-card__cover"></div>`}
      <div class="story-card__body">
        ${s.status ? `<span class="story-card__status">${s.status}</span>` : ""}
        <h3 class="story-card__title">${s.title}</h3>
        <p class="story-card__summary">${s.summary || ""}</p>
        <span class="story-card__meta">${s.chapters.length} chương</span>
      </div>`;
    grid.appendChild(a);
  });
  initReveal();
}

/* =========================================================================
   TRANG BỘ TRUYỆN — story.html
   ========================================================================= */
function initStory() {
  fillChrome();
  const sid = new URLSearchParams(location.search).get("s");
  const s = findStory(sid);
  const main = $("#story-main");

  if (!s) {
    main.innerHTML = `<p class="empty">Không tìm thấy bộ truyện. <a href="index.html">Về thư viện</a>.</p>`;
    return;
  }
  document.title = `${s.title} — ${LIBRARY.title}`;

  const first = s.chapters[0];
  main.innerHTML = `
    <header class="story-hero">
      ${s.cover ? `<img class="story-hero__cover" src="${s.cover}" alt="">` : `<div class="story-hero__cover"></div>`}
      <div>
        ${s.status ? `<span class="story-hero__status">${s.status}</span>` : ""}
        <h1 class="story-hero__title">${s.title}</h1>
        <div class="story-hero__about">${s.about ? marked.parse(s.about) : ""}</div>
        <div class="story-hero__cta">
          ${first
            ? `<a class="btn btn--primary" href="reader.html?s=${s.id}&c=${first.id}">Đọc từ đầu <span class="btn__arrow">→</span></a>`
            : `<span class="btn btn--ghost">Chưa có chương</span>`}
          <a class="btn btn--ghost" href="index.html">← Thư viện</a>
        </div>
      </div>
    </header>
    <h2 class="section-title">Mục lục</h2>
    <div class="chapter-list" id="chapter-list"></div>`;

  const list = $("#chapter-list");
  if (!s.chapters.length) {
    list.replaceWith(el("p", "empty", "Bộ này chưa có chương nào."));
    return;
  }
  s.chapters.forEach((c) => {
    const a = el("a", "chapter-row");
    a.href = `reader.html?s=${s.id}&c=${c.id}`;
    a.innerHTML = `
      <span class="chapter-row__num">${c.num}</span>
      <span class="chapter-row__title">${c.title}</span>
      <span class="chapter-row__arrow">→</span>`;
    list.appendChild(a);
  });
}

/* =========================================================================
   READER — reader.html
   ========================================================================= */
async function initReader() {
  fillChrome();
  const params = new URLSearchParams(location.search);
  const s = findStory(params.get("s"));
  if (!s) { document.body.innerHTML = `<p class="empty">Không tìm thấy bộ truyện. <a href="index.html">Về thư viện</a>.</p>`; return; }

  const cid = params.get("c") || (s.chapters[0] && s.chapters[0].id);
  const i = chapterIdx(s, cid);
  const c = s.chapters[i];

  // breadcrumb + thanh trên
  $("#bar-back-lib").href = "index.html";
  $("#bar-back-story").href = `story.html?s=${s.id}`;
  $("#bar-back-story").textContent = s.title;

  const titleEl = $("#chapter-title");
  if (!c) {
    $("#chapter-num").textContent = "";
    titleEl.textContent = "Không tìm thấy chương";
    $("#prose").innerHTML = `<p class="empty">Chương không tồn tại. Quay lại <a href="story.html?s=${s.id}">${s.title}</a>.</p>`;
    return;
  }

  $("#chapter-crumb").innerHTML = `<a href="index.html">Thư viện</a> · <a href="story.html?s=${s.id}">${s.title}</a>`;
  $("#chapter-num").textContent = c.num;
  titleEl.textContent = c.title;
  document.title = `${c.title} — ${s.title}`;

  const prose = $("#prose");
  try {
    const res = await fetch(c.file);
    if (!res.ok) throw new Error(res.status);
    const md = await res.text();
    prose.innerHTML = marked.parse(md);
    enhanceFigures(prose);
    const words = md.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    $("#chapter-meta").innerHTML = `<span>${mins} phút đọc</span>`;
  } catch (err) {
    prose.innerHTML = `<p class="empty">Chưa nạp được nội dung từ <code>${c.file}</code>.<br>
      Nếu xem trên máy bằng cách nhấp đúp, hãy chạy server cục bộ hoặc đẩy lên GitHub Pages (xem README).</p>`;
  }

  // điều hướng
  const prev = s.chapters[i - 1], next = s.chapters[i + 1];
  $("#chapter-nav").innerHTML = `
    ${prev
      ? `<a class="chapter-nav__link" href="reader.html?s=${s.id}&c=${prev.id}">
           <div class="chapter-nav__dir">← ${prev.num}</div>
           <div class="chapter-nav__name">${prev.title}</div></a>`
      : `<a class="chapter-nav__link" href="story.html?s=${s.id}">
           <div class="chapter-nav__dir">← Mục lục</div>
           <div class="chapter-nav__name">${s.title}</div></a>`}
    ${next
      ? `<a class="chapter-nav__link chapter-nav__link--next" href="reader.html?s=${s.id}&c=${next.id}">
           <div class="chapter-nav__dir">${next.num} →</div>
           <div class="chapter-nav__name">${next.title}</div></a>`
      : `<a class="chapter-nav__link chapter-nav__link--next" href="story.html?s=${s.id}">
           <div class="chapter-nav__dir">Hết bộ này →</div>
           <div class="chapter-nav__name">Về mục lục</div></a>`}`;

  // thanh tiến độ + tiêu đề trồi lên
  const fill = $("#progress-fill");
  const barTitle = $("#reader-bar-title");
  barTitle.textContent = c.title;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    fill.style.width = `${p * 100}%`;
    barTitle.classList.toggle("is-visible", h.scrollTop > 240);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================================================================
   TIMELINE — timeline.html (mỗi node = một BỘ)
   ========================================================================= */
function initTimeline() {
  fillChrome();
  const wrap = $("#timeline");
  if (!STORIES.length) {
    wrap.innerHTML = `<p class="empty">Chưa có bộ nào.</p>`;
    return;
  }

  // sắp xếp theo readingOrder; không có thì giữ nguyên thứ tự khai báo
  const ordered = [...STORIES].sort((a, b) => {
    const ao = a.readingOrder ?? 9999, bo = b.readingOrder ?? 9999;
    return ao - bo;
  });

  wrap.innerHTML = `<div class="timeline__spine"></div>`;
  ordered.forEach((s, i) => {
    const first = s.chapters[0];
    const href = first ? `reader.html?s=${s.id}&c=${first.id}` : `story.html?s=${s.id}`;
    const a = el("a", "tl-node reveal");
    a.href = href;
    a.innerHTML = `
      <span class="tl-node__dot"></span>
      ${s.cover ? `<img class="tl-node__cover" src="${s.cover}" alt="">` : `<span class="tl-node__cover"></span>`}
      <div>
        <span class="tl-node__order">Thứ tự ${String(i + 1).padStart(2, "0")}${s.status ? ` · ${s.status}` : ""}</span>
        <h3 class="tl-node__title">${s.title}</h3>
        <p class="tl-node__sum">${s.summary || ""}</p>
        <p class="tl-node__meta">${s.chapters.length} chương · bấm để bắt đầu đọc</p>
      </div>`;
    wrap.appendChild(a);
  });
  initReveal();
}
