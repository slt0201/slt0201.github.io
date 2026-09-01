/* ==========================================================================
   MANGA_DATA — 网站的全部内容清单
   要收录新系列 / 新话，只需要编辑这个文件，不用碰其它代码。

   目录结构约定：
     assets/img/pages/<series.id>/<chapter.id>/p01.jpg, p02.jpg ...
     assets/img/covers/<series.id>.jpg

   页码文件名请保持三段式排序（p01, p02 ... p10），避免 p1, p10, p2 这种
   字典序错乱。
   ========================================================================== */

const MANGA_DATA = {
  series: [
    {
      id: "arcadia",
      title: "【やとさきはる】两人的理想世界 #1",
      original: "两人的理想世界 / やとさきはる",
      author: "やとさきはる",
      tags: ["百合"],
      cover: "assets/img/covers/二人のアルカディア【合本版】 - 001.jpg",
      description:
        "简介",
      chapters: [
        {
          id: "arcadiamain2",
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
    // 示例数据用的是 .svg 占位图；换成你自己的扫图后，
    // 把下面这行的扩展名改成 .jpg / .png / .webp 即可。
    urls.push(`assets/img/pages/${seriesId}/${chapter.id}/p${n}.svg`);
  }
  return urls;
}
