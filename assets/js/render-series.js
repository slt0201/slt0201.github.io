/* ==========================================================================
   系列页面渲染
   由 site-router.js 调用
   ========================================================================== */

window.renderSeries = function (seriesId) {

  const root = document.getElementById("series-root");

  if (!root) {
    return;
  }

  const series = seriesId
    ? findSeries(seriesId)
    : null;


  // ==========================================================
  // 找不到系列
  // ==========================================================

  if (!series) {

    root.innerHTML = `
      <p class="empty-state">
        没找到这个系列。
        回到
        <a
          href="index.html"
          style="border-bottom:1px solid var(--line-strong)"
        >
          全部系列
        </a>
        看看？
      </p>
    `;

    return;
  }


  // ==========================================================
  // 页面标题
  // ==========================================================

  document.title =
    `${series.title} · 備忘録`;


  // ==========================================================
  // 标签
  // ==========================================================

  const tags =
    (series.tags || [])
      .map(
        (t) => `<span>${t}</span>`
      )
      .join("");


  // ==========================================================
  // 章节列表
  // ==========================================================

  const chaptersHtml =
    series.chapters.length

      ? series.chapters
          .map(
            (c) => `
              <li class="chapter-row">

                <a
                  href="reader.html?series=${encodeURIComponent(series.id)}&chapter=${encodeURIComponent(c.id)}"
                >
                  ${c.title}
                </a>

                <span class="chapter-info">
                  ${c.pageCount} 页 · ${c.date}
                </span>

              </li>
            `
          )
          .join("")

      : `
          <li class="empty-state">
            这个系列还没有收录任何话。
          </li>
        `;


  // ==========================================================
  // 页面内容
  // ==========================================================

  root.innerHTML = `

    <a
      class="back-link"
      href="index.html"
    >
      ← 全部系列
    </a>


    <div class="series-head">

      <div class="series-cover">

        <img
          src="${series.cover}"
          alt="${series.title} 封面"
        >

      </div>


      <div>

        <h1 class="series-title">
          ${series.title}
        </h1>


        <p class="series-meta">

          <span>
            ${series.original || series.title}
          </span>

          <span>
            ${series.author || ""}
          </span>

          <span>
            ${series.chapters.length} 话
          </span>

        </p>


        <p class="series-desc">
          ${series.description || ""}
        </p>


        ${
          tags
            ? `
              <p
                class="catalog-tags"
                style="margin-top:12px"
              >
                ${tags}
              </p>
            `
            : ""
        }

      </div>

    </div>


    <ul class="chapter-list">
      ${chaptersHtml}
    </ul>

  `;

};