(function () {
  const stage = document.getElementById("reader-stage");
  const titleEl = document.getElementById("reader-title");
  const indicatorEl = document.getElementById("page-indicator");
  const backEl = document.getElementById("reader-back");
  const modeBtn = document.getElementById("mode-toggle");

  // 获取 URL 参数
  const params = new URLSearchParams(location.search);
  const seriesId = params.get("series");
  const chapterId = params.get("chapter");

  const found =
    seriesId && chapterId
      ? findChapter(seriesId, chapterId)
      : null;

  // 找不到章节
  if (!found) {
    titleEl.textContent = "没找到这一话";

    stage.innerHTML = `
      <p class="reader-end">
        没找到这一话。<br>
        <a href="index.html">回到全部系列</a>
      </p>
    `;

    return;
  }

  const { series, chapter } = found;

  const chapterIndex = series.chapters.findIndex(
    (c) => c.id === chapter.id
  );

  const prevChapter =
    series.chapters[chapterIndex - 1] || null;

  const nextChapter =
    series.chapters[chapterIndex + 1] || null;

  // 获取这一话的所有图片
  const pages = chapterPageUrls(series.id, chapter);

  // 返回系列页
  backEl.href =
    `series.html?series=${encodeURIComponent(series.id)}`;

  // 阅读器标题
  titleEl.textContent =
    `${series.title} · ${chapter.title}`;

  document.title =
    `${chapter.title} · ${series.title}`;

  // 读取上次的阅读模式
  let mode =
    localStorage.getItem("reader-mode") || "paged";

  // 当前页码
  let current = 1;


  // ==========================================================
  // 阅读模式按钮
  // ==========================================================

  function setModeButton() {
    const isScroll = mode === "scroll";

    modeBtn.textContent =
      isScroll ? "翻页阅读" : "连续滚动";

    modeBtn.setAttribute(
      "aria-pressed",
      String(isScroll)
    );

    stage.className =
      `reader-stage ${isScroll ? "scroll" : "paged"}`;
  }


  // ==========================================================
  // 本话结束提示
  // ==========================================================

  function readerEndBlock() {
    const nextLink = nextChapter
      ? `
        <a href="reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(nextChapter.id)}">
          下一话：${nextChapter.title} →
        </a>
      `
      : `
        <a href="series.html?series=${encodeURIComponent(series.id)}">
          已经是最后一话，回到系列页
        </a>
      `;

    return `
      <div class="reader-end">
        本话读完。${nextLink}
      </div>
    `;
  }


  // ==========================================================
  // 翻页模式
  // ==========================================================

  function renderPaged() {
    indicatorEl.textContent =
      `${current} / ${pages.length}`;

    stage.innerHTML = `
      <img
        class="page-img"
        src="${pages[current - 1]}"
        alt="${chapter.title} 第 ${current} 页"
      >

      <div
        class="tap-zone prev"
        aria-label="上一页"
      ></div>

      <div
        class="tap-zone next"
        aria-label="下一页"
      ></div>
    `;

    const img =
      stage.querySelector(".page-img");

    // 图片加载失败时显示实际路径
    img.addEventListener("error", function () {
      console.error(
        "图片加载失败：",
        pages[current - 1]
      );

      img.alt = "图片加载失败";

      img.insertAdjacentHTML(
        "afterend",
        `
        <div class="reader-image-error">
          图片加载失败<br>
          <small>${pages[current - 1]}</small>
        </div>
        `
      );
    });

    // 左边区域 → 下一页
    stage
      .querySelector(".tap-zone.prev")
      .addEventListener("click", goNext);

    // 右边区域 → 上一页
    stage
      .querySelector(".tap-zone.next")
      .addEventListener("click", goPrev);
  }


  // ==========================================================
  // 连续滚动模式
  // ==========================================================

  function renderScroll() {
    indicatorEl.textContent =
      `共 ${pages.length} 页`;

    const imgs = pages
      .map(
        (src, i) => `
          <img
            class="page-img"
            src="${src}"
            alt="${chapter.title} 第 ${i + 1} 页"
            loading="lazy"
          >
        `
      )
      .join("");

    stage.innerHTML =
      imgs + readerEndBlock();

    stage
      .querySelectorAll(".page-img")
      .forEach((img, i) => {
        img.addEventListener("error", function () {
          console.error(
            "图片加载失败：",
            pages[i]
          );

          img.alt = "图片加载失败";

          img.insertAdjacentHTML(
            "afterend",
            `
            <div class="reader-image-error">
              图片加载失败<br>
              <small>${pages[i]}</small>
            </div>
            `
          );
        });
      });
  }


  // ==========================================================
  // 渲染
  // ==========================================================

  function render() {
    setModeButton();

    if (mode === "scroll") {
      renderScroll();
    } else {
      renderPaged();
    }
  }


  // ==========================================================
  // 下一页
  // ==========================================================

  function goNext() {
    if (mode !== "paged") return;

    if (current < pages.length) {
      current += 1;

      renderPaged();

      window.scrollTo(0, 0);

    } else if (nextChapter) {

      location.href =
        `reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(nextChapter.id)}`;

    } else {

      stage.innerHTML =
        readerEndBlock();
    }
  }


  // ==========================================================
  // 上一页
  // ==========================================================

  function goPrev() {
    if (mode !== "paged") return;

    if (current > 1) {
      current -= 1;

      renderPaged();

      window.scrollTo(0, 0);

    } else if (prevChapter) {

      location.href =
        `reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(prevChapter.id)}`;
    }
  }


  // ==========================================================
  // 切换阅读模式
  // ==========================================================

  modeBtn.addEventListener("click", () => {
    mode =
      mode === "paged"
        ? "scroll"
        : "paged";

    localStorage.setItem(
      "reader-mode",
      mode
    );

    current = 1;

    render();
  });


  // ==========================================================
  // 键盘操作
  // ==========================================================

  document.addEventListener("keydown", (e) => {
    if (mode !== "paged") return;

    if (
      e.key === "ArrowLeft" ||
      e.key === " "
    ) {
      e.preventDefault();
      goNext();

    } else if (
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
      goPrev();
    }
  });


  // ==========================================================
  // 开始
  // ==========================================================

  render();

})();