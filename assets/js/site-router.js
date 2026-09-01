/* ==========================================================================
   全站无刷新路由
   ========================================================================== */

(function () {

  const appMain = document.getElementById("app-main");

  if (!appMain) {
    console.error("找不到 #app-main");
    return;
  }


  // ==========================================================
  // 判断页面
  // ==========================================================

  function getPage(url) {

    const path = url.pathname;

    if (path.includes("reader.html")) {
      return "reader";
    }

    if (path.includes("series.html")) {
      return "series";
    }

    return "home";
  }


  // ==========================================================
  // 首页
  // ==========================================================

  function showHome() {

    document.body.className = "";
    document.body.dataset.page = "home";

    document.title = "我的漫画库";


    appMain.innerHTML = `
      <div class="wrap">

        <p
          class="section-label"
          id="catalog-count"
        >
          收录中
        </p>

        <ul
          class="catalog"
          id="catalog-list"
        ></ul>

      </div>
    `;


    if (
      typeof window.renderHome === "function"
    ) {

      window.renderHome();

    } else {

      console.error(
        "renderHome 不存在"
      );

    }


    updateLayout("home");
  }


  // ==========================================================
  // 系列页
  // ==========================================================

  function showSeries(url) {

    document.body.className = "";
    document.body.dataset.page = "series";


    const seriesId =
      url.searchParams.get("series");


    appMain.innerHTML = `
      <div
        class="wrap"
        id="series-root"
      ></div>
    `;


    if (
      typeof window.renderSeries === "function"
    ) {

      window.renderSeries(
        seriesId
      );

    } else {

      console.error(
        "renderSeries 不存在"
      );

    }


    updateLayout("series");
  }


  // ==========================================================
  // 阅读器
  // ==========================================================

  function showReader(url) {

    document.body.className =
      "reader-page";

    document.body.dataset.page =
      "reader";


    const seriesId =
      url.searchParams.get("series");

    const chapterId =
      url.searchParams.get("chapter");


    if (
      typeof window.renderReader === "function"
    ) {

      window.renderReader(
        seriesId,
        chapterId
      );

    } else {

      console.error(
        "renderReader 不存在"
      );

    }


    updateLayout("reader");
  }


  // ==========================================================
  // Header / Footer
  // ==========================================================

  function updateLayout(page) {

    const header =
      document.querySelector(
        ".site-head"
      );

    const footer =
      document.querySelector(
        ".site-foot"
      );


    if (header) {

      header.style.display =
        page === "reader"
          ? "none"
          : "";

    }


    if (footer) {

      footer.style.display =
        page === "reader"
          ? "none"
          : "";

    }

  }


  // ==========================================================
  // 页面导航
  // ==========================================================

  function navigate(
    url,
    push = true
  ) {

    const page =
      getPage(url);


    if (push) {

      history.pushState(
        {
          page: page
        },
        "",
        url.href
      );

    }


    if (page === "home") {

      showHome();

    }

    else if (page === "series") {

      showSeries(url);

    }

    else if (page === "reader") {

      showReader(url);

    }


    window.scrollTo(
      0,
      0
    );

  }


  // ==========================================================
  // ★ 拦截所有本站页面链接
  // ==========================================================

  document.addEventListener(
    "click",
    function (event) {

      const link =
        event.target.closest(
          "a[href]"
        );


      if (!link) {
        return;
      }


      // 鼠标辅助点击不拦截
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }


      // 新窗口 / 下载
      if (
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }


      const href =
        link.getAttribute("href");


      if (!href) {
        return;
      }


      // 外部 / 特殊链接
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }


      const url =
        new URL(
          href,
          location.href
        );


      // 外站
      if (
        url.origin !==
        location.origin
      ) {
        return;
      }


      const page =
        getPage(url);


      // 只处理本站三个页面
      if (
        page !== "home" &&
        page !== "series" &&
        page !== "reader"
      ) {
        return;
      }


      // ★ 阻止浏览器真正跳转
      event.preventDefault();
      event.stopPropagation();


      navigate(
        url,
        true
      );

    }
  );


  // ==========================================================
  // 浏览器后退 / 前进
  // ==========================================================

  window.addEventListener(
    "popstate",
    function () {

      navigate(
        new URL(location.href),
        false
      );

    }
  );


  // ==========================================================
  // ★ 首次进入网站
  // ==========================================================

  const currentUrl =
    new URL(location.href);

  const currentPage =
    getPage(currentUrl);


  if (currentPage === "home") {

    showHome();

  }

  else if (currentPage === "series") {

    showSeries(currentUrl);

  }

  else if (currentPage === "reader") {

    showReader(currentUrl);

  }

})();