window.renderHome = function () {

  const listEl =
    document.getElementById("catalog-list");

  const countEl =
    document.getElementById("catalog-count");

  if (!listEl || !countEl) {
    return;
  }

  const series =
    MANGA_DATA.series;

  countEl.textContent =
    `共 ${series.length} 部作品`;

  if (series.length === 0) {

    listEl.innerHTML = `
      <li class="empty-state">
        还没有收录任何作品，
        去 assets/js/data.js 里加一个吧。
      </li>
    `;

    return;
  }


  // 按最新一话日期倒序排列
  const sorted =
    [...series].sort(
      (a, b) => {

        const dateA =
          a.chapters[
            a.chapters.length - 1
          ]?.date || "";

        const dateB =
          b.chapters[
            b.chapters.length - 1
          ]?.date || "";

        return dateB.localeCompare(dateA);

      }
    );


  listEl.innerHTML =
    sorted
      .map(
        (s) => {

          const latest =
            s.chapters[
              s.chapters.length - 1
            ];

          const tags =
            (s.tags || [])
              .map(
                (t) => `<span>${t}</span>`
              )
              .join("");


          return `

            <li class="catalog-item">

              <div class="catalog-cover">

                <img
                  src="${s.cover}"
                  alt="${s.title} 封面"
                  loading="lazy"
                >

              </div>


              <div class="catalog-body">

                <h2>

                  <a
                    href="series.html?series=${encodeURIComponent(s.id)}"
                  >
                    ${s.title}
                  </a>

                </h2>


                <p class="catalog-meta">

                  <span>
                    ${s.original || s.title}
                  </span>

                  <span>
                    ${s.author || ""}
                  </span>

                </p>


                <p class="catalog-desc">
                  ${s.description || ""}
                </p>


                ${
                  tags
                    ? `
                      <p class="catalog-tags">
                        ${tags}
                      </p>
                    `
                    : ""
                }

              </div>


              <div class="catalog-stat">

                <strong>
                  ${s.chapters.length}
                </strong>

                话

                ${
                  latest
                    ? `
                      <br>
                      更新 ${latest.date}
                    `
                    : ""
                }

              </div>

            </li>

          `;

        }
      )
      .join("");

};