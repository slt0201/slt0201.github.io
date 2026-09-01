const MANGA_DATA = {
  series: [
    {
      id: "arcadia",
      title: "【やとさきはる】两人的理想世界",
      original: "二人のアルカディア",
      author: "やとさきはる",
      tags: ["百合"],
      cover: "assets/img/covers/二人のアルカ迪ア【合本版】 - 001.jpg",
      description: "老漫画挖坟",

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

    {
      id: "cr",
      title: "教室",
      original: "教室",
      author: "森永みるく",
      tags: ["百合"],
      cover: "assets/img/covers/083",
      description: "季刊ガレツト",

      chapters: [
        {
          id: "cr1",
          title: "教室 #1",
          pageCount: 21,
          date: "2026-08-31",
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

  const chapter = series.chapters.find(
    (c) => c.id === chapterId
  );

  return chapter ? { series, chapter } : null;
}


// 生成某一话的图片路径列表
function chapterPageUrls(seriesId, chapter) {
  const urls = [];

  for (let i = 1; i <= chapter.pageCount; i++) {
    const n = String(i).padStart(3, "0");

    urls.push(
      `assets/img/pages/${seriesId}/${chapter.id}/二人のアルカディア【合本版】 - ${n}.jpg`
    );
  }

  return urls;
}