/* ==========================================================================
   阅读器
   由 site-router.js 调用
   音乐播放器不参与页面切换，因此不会中断
   ========================================================================== */

window.renderReader = function (seriesId, chapterId) {

  const appMain = document.getElementById("app-main");

  if (!appMain) return;


  // ==========================================================
  // 找到系列和章节
  // ==========================================================

  const result = findChapter(
    seriesId,
    chapterId
  );

  if (!result) {

    appMain.innerHTML = `
      <div class="reader-bar">
        <a href="index.html" id="reader-back">
          ← 系列
        </a>

        <p class="reader-title">
          没找到这一话
        </p>

        <div class="reader-controls"></div>
      </div>

      <div class="reader-stage paged">
        <p class="reader-end">
          没找到这一话。<br>
          <a href="index.html">
            回到全部系列
          </a>
        </p>
      </div>
    `;

    return;
  }


  let series = result.series;
  let chapter = result.chapter;

  let pages =
    chapterPageUrls(
      series.id,
      chapter
    );

  let current = 1;

  let mode =
    localStorage.getItem("reader-mode")
    || "paged";


  // ==========================================================
  // 阅读器界面
  // ==========================================================

  appMain.innerHTML = `

    <div class="reader-bar">

      <a
        href="series.html?series=${encodeURIComponent(series.id)}"
        id="reader-back"
      >
        ← 系列
      </a>

      <p
        class="reader-title"
        id="reader-title"
      >
        ${series.title} · ${chapter.title}
      </p>

      <div class="reader-controls">

        <span
          class="page-indicator"
          id="page-indicator"
        ></span>

        <span class="reading-direction">
          右→左
        </span>

        <button
          class="mode-toggle"
          id="mode-toggle"
          type="button"
          aria-pressed="false"
        >
          连续滚动
        </button>

      </div>

    </div>


    <div
      class="reader-stage paged"
      id="reader-stage"
    ></div>

  `;


  const stage =
    document.getElementById(
      "reader-stage"
    );

  const titleEl =
    document.getElementById(
      "reader-title"
    );

  const indicatorEl =
    document.getElementById(
      "page-indicator"
    );

  const modeBtn =
    document.getElementById(
      "mode-toggle"
    );


  document.title =
    `${chapter.title} · ${series.title}`;


  // ==========================================================
  // 图片加载错误
  // ==========================================================

  function addImageError(img, src) {

    img.addEventListener(
      "error",
      function () {

        console.error(
          "图片加载失败：",
          src
        );

        img.alt =
          "图片加载失败";

        if (
          img.nextElementSibling &&
          img.nextElementSibling.classList.contains(
            "reader-image-error"
          )
        ) {
          return;
        }

        img.insertAdjacentHTML(
          "afterend",
          `
            <div class="reader-image-error">
              图片加载失败<br>
              <small>${src}</small>
            </div>
          `
        );

      }
    );

  }


  // ==========================================================
  // 当前章节位置
  // ==========================================================

  function getChapterIndex() {

    return series.chapters.findIndex(
      c => c.id === chapter.id
    );

  }


  function getPrevChapter() {

    const index =
      getChapterIndex();

    return (
      series.chapters[index - 1]
      || null
    );

  }


  function getNextChapter() {

    const index =
      getChapterIndex();

    return (
      series.chapters[index + 1]
      || null
    );

  }


  // ==========================================================
  // 章节 URL
  // ==========================================================

  function updateURL() {

    const url =
      `reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(chapter.id)}`;

    history.pushState(
      {
        type: "reader",
        series: series.id,
        chapter: chapter.id
      },
      "",
      url
    );

  }


  // ==========================================================
  // 下一话
  // ==========================================================

  function goNextChapter() {

    const nextChapter =
      getNextChapter();

    if (!nextChapter) return;


    const result =
      findChapter(
        series.id,
        nextChapter.id
      );

    if (!result) return;


    chapter =
      result.chapter;

    pages =
      chapterPageUrls(
        series.id,
        chapter
      );

    current = 1;


    updateURL();


    updateChapterInfo();

    render();


    window.scrollTo(
      0,
      0
    );

  }


  // ==========================================================
  // 上一话
  // ==========================================================

  function goPrevChapter() {

    const prevChapter =
      getPrevChapter();

    if (!prevChapter) return;


    const result =
      findChapter(
        series.id,
        prevChapter.id
      );

    if (!result) return;


    chapter =
      result.chapter;

    pages =
      chapterPageUrls(
        series.id,
        chapter
      );

    current =
      mode === "paged"
        ? pages.length
        : 1;


    updateURL();


    updateChapterInfo();

    render();


    window.scrollTo(
      0,
      0
    );

  }


  // ==========================================================
  // 更新章节信息
  // ==========================================================

  function updateChapterInfo() {

    const backEl =
      document.getElementById(
        "reader-back"
      );

    backEl.href =
      `series.html?series=${encodeURIComponent(series.id)}`;

    titleEl.textContent =
      `${series.title} · ${chapter.title}`;

    document.title =
      `${chapter.title} · ${series.title}`;

  }


  // ==========================================================
  // 阅读结束
  // ==========================================================

  function readerEndBlock() {

    const nextChapter =
      getNextChapter();


    if (nextChapter) {

      return `
        <div class="reader-end">

          本话读完。<br>

          <a
            href="reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(nextChapter.id)}"
            class="chapter-next-link"
            data-series="${series.id}"
            data-chapter="${nextChapter.id}"
          >
            下一话：${nextChapter.title} →
          </a>

        </div>
      `;

    }


    return `
      <div class="reader-end">

        已经是最后一话。<br>

        <a
          href="series.html?series=${encodeURIComponent(series.id)}"
        >
          回到系列页
        </a>

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
      stage.querySelector(
        ".page-img"
      );

    addImageError(
      img,
      pages[current - 1]
    );


    stage
      .querySelector(".tap-zone.prev")
      .addEventListener(
        "click",
        goNext
      );


    stage
      .querySelector(".tap-zone.next")
      .addEventListener(
        "click",
        goPrev
      );

  }


  // ==========================================================
  // 连续滚动
  // ==========================================================

  function renderScroll() {

    indicatorEl.textContent =
      `共 ${pages.length} 页`;


    const imgs =
      pages
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
      imgs +
      readerEndBlock();


    stage
      .querySelectorAll(".page-img")
      .forEach(
        (img, i) => {

          addImageError(
            img,
            pages[i]
          );

        }
      );

  }


  // ==========================================================
  // 阅读模式按钮
  // ==========================================================

  function setModeButton() {

    const isScroll =
      mode === "scroll";


    modeBtn.textContent =
      isScroll
        ? "翻页阅读"
        : "连续滚动";


    modeBtn.setAttribute(
      "aria-pressed",
      String(isScroll)
    );


    stage.className =
      `reader-stage ${
        isScroll
          ? "scroll"
          : "paged"
      }`;

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
  // 翻页
  // ==========================================================

  function goNext() {

    if (mode !== "paged") {
      return;
    }


    if (current < pages.length) {

      current += 1;

      renderPaged();

      window.scrollTo(
        0,
        0
      );

      return;
    }


    goNextChapter();

  }


  function goPrev() {

    if (mode !== "paged") {
      return;
    }


    if (current > 1) {

      current -= 1;

      renderPaged();

      window.scrollTo(
        0,
        0
      );

      return;
    }


    goPrevChapter();

  }


  // ==========================================================
  // 模式切换
  // ==========================================================

  modeBtn.addEventListener(
    "click",
    function () {

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

    }
  );


  // ==========================================================
  // 键盘
  // ==========================================================

  document.addEventListener(
    "keydown",
    function readerKeyboard(e) {

      if (
        document.body.dataset.page !==
        "reader"
      ) {
        document.removeEventListener(
          "keydown",
          readerKeyboard
        );

        return;
      }


      if (mode !== "paged") {
        return;
      }


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

    }
  );


  // ==========================================================
  // 初始渲染
  // ==========================================================

  updateChapterInfo();

  render();

};