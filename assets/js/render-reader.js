(function () {
  const stage = document.getElementById("reader-stage");
  const titleEl = document.getElementById("reader-title");
  const indicatorEl = document.getElementById("page-indicator");
  const backEl = document.getElementById("reader-back");
  const modeBtn = document.getElementById("mode-toggle");

  const params = new URLSearchParams(location.search);
  const seriesId = params.get("series");
  const chapterId = params.get("chapter");
  const found = seriesId && chapterId ? findChapter(seriesId, chapterId) : null;

  if (!found) {
    titleEl.textContent = "没找到这一话";
    stage.innerHTML = `<p class="reader-end">没找到这一话。<br><a href="index.html">回到全部系列</a></p>`;
    return;
  }

  const { series, chapter } = found;
  const chapterIndex = series.chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = series.chapters[chapterIndex - 1] || null;
  const nextChapter = series.chapters[chapterIndex + 1] || null;
  const pages = chapterPageUrls(series.id, chapter);

  backEl.href = `series.html?series=${series.id}`;
  titleEl.textContent = `${series.title} · ${chapter.title}`;
  document.title = `${chapter.title} · ${series.title}`;

  let mode = localStorage.getItem("reader-mode") || "paged";
  let current = 1; // 1-based page index, 翻页模式下使用

  function setModeButton() {
    const isScroll = mode === "scroll";
    modeBtn.textContent = isScroll ? "翻页阅读" : "连续滚动";
    modeBtn.setAttribute("aria-pressed", String(isScroll));
    stage.className = `reader-stage ${isScroll ? "scroll" : "paged"}`;
  }

  function readerEndBlock() {
    const nextLink = nextChapter
      ? `<a href="reader.html?series=${series.id}&chapter=${nextChapter.id}">下一话：${nextChapter.title} →</a>`
      : `<a href="series.html?series=${series.id}">已经是最后一话，回到系列页</a>`;
    return `<div class="reader-end">本话读完。${nextLink}</div>`;
  }

  function renderPaged() {
    indicatorEl.textContent = `${current} / ${pages.length}`;
    stage.innerHTML = `
      <img class="page-img" src="${pages[current - 1]}" alt="${chapter.title} 第 ${current} 页">
      <div class="tap-zone prev" aria-label="上一页"></div>
      <div class="tap-zone next" aria-label="下一页"></div>
    `;
    stage.querySelector(".tap-zone.prev").addEventListener("click", goNext);
    stage.querySelector(".tap-zone.next").addEventListener("click", goPrev);
  }

  function renderScroll() {
    indicatorEl.textContent = `共 ${pages.length} 页`;
    const imgs = pages
      .map(
        (src, i) =>
          `<img class="page-img" src="${src}" alt="${chapter.title} 第 ${i + 1} 页" loading="lazy">`
      )
      .join("");
    stage.innerHTML = imgs + readerEndBlock();
  }

  function render() {
    setModeButton();
    if (mode === "scroll") {
      renderScroll();
    } else {
      renderPaged();
    }
  }

  function goNext() {
    if (mode !== "paged") return;
    if (current < pages.length) {
      current += 1;
      renderPaged();
      window.scrollTo(0, 0);
    } else if (nextChapter) {
      location.href = `reader.html?series=${series.id}&chapter=${nextChapter.id}`;
    } else {
      stage.innerHTML = readerEndBlock();
    }
  }

  function goPrev() {
    if (mode !== "paged") return;
    if (current > 1) {
      current -= 1;
      renderPaged();
      window.scrollTo(0, 0);
    } else if (prevChapter) {
      location.href = `reader.html?series=${series.id}&chapter=${prevChapter.id}`;
    }
  }

  modeBtn.addEventListener("click", () => {
    mode = mode === "paged" ? "scroll" : "paged";
    localStorage.setItem("reader-mode", mode);
    current = 1;
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (mode !== "paged") return;
    if (e.key === "ArrowLeft" || e.key === " ") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goPrev();
    }
  });

  render();
})();
