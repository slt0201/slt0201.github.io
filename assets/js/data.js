const MANGA_DATA = {
  series: [
    {
      id: "arcadia",
      title: "【やとさきはる】两人的理想世界 #1",
      original: "两人的理想世界 / やとさきはる",
      author: "やとさきはる",
      tags: ["百合"],
      cover: "assets/img/covers/二人のアルカディア【合本版】 - 001.jpg",
      description: "简介",

      chapters: [
        {
          id: "arcadiamain1",
          title: "两人的理想世界 #1",
          pageCount: 24,
          date: "2026-08-04",
        },
        {
          id: "arcadiamain2",
          title: "两人的理想世界 #2",
          pageCount: 20,
          date: "2026-08-08",
        },
        {
          id: "arcadiamain3",
          title: "两人的理想世界 #3",
          pageCount: 20,
          date: "2026-08-11",
        },
      ],
    },
  ],
};


// 根据 id 查找系列
function findSeries(seriesId) {
  return MANGA_DATA.series.find((s) => s.id === seriesId);
}

// 根据系列 id + 话 id 查找章节
function findChapter(seriesId, chapterId) {
  const series = findSeries(seriesId);
  if (!series) return null;

  const chapter = series.chapters.find((c) => c.id === chapterId);

  return chapter ? { series, chapter } : null;
}

// 生成某一话的图片路径列表
function chapterPageUrls(seriesId, chapter) {
  const urls = [];

  for (let i = 1; i <= chapter.pageCount; i++) {
    const n = String(i).padStart(2, "0");

    urls.push(
      `assets/img/pages/${seriesId}/${chapter.id}/p${n}.svg`
    );
  }

  return urls;
}