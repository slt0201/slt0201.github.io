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
      id: "s01",
      title: "花期",
      original: "花期 / はなどき",
      author: "示例原作 · 汉化：你自己",
      tags: ["百合", "短篇集", "日译中"],
      cover: "assets/img/covers/s01.svg",
      description:
        "关于两个女孩子在同一片花田里错开又重叠的四个季节。示例数据，替换为你自己的作品简介。",
      chapters: [
        {
          id: "c01",
          title: "第1话　初见",
          pageCount: 5,
          date: "2026-06-02",
        },
        {
          id: "c02",
          title: "第2话　梅雨",
          pageCount: 4,
          date: "2026-07-10",
        },
      ],
    },
    {
      id: "s02",
      title: "潮见坂",
      original: "潮見坂",
      author: "示例原作 · 汉化：你自己",
      tags: ["百合", "长篇连载"],
      cover: "assets/img/covers/s02.svg",
      description:
        "坡道尽头能看见海的小镇，两个转学生的连载故事。示例数据，替换为你自己的作品简介。",
      chapters: [
        {
          id: "c01",
          title: "第1话　转学生",
          pageCount: 6,
          date: "2026-05-20",
        },
        {
          id: "c02",
          title: "第2话　放学后",
          pageCount: 5,
          date: "2026-06-15",
        },
      ],
    },
    {
      id: "s03",
      title: "室内乐",
      original: "室内楽",
      author: "示例原作 · 汉化：你自己",
      tags: ["百合", "单行本"],
      cover: "assets/img/covers/s03.svg",
      description:
        "音乐教室里的单行本短篇。示例数据，替换为你自己的作品简介。",
      chapters: [
        {
          id: "c01",
          title: "第1话",
          pageCount: 4,
          date: "2026-04-01",
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
    // 示例数据用的是 .svg 占位图；换成你自己的扫图后，
    // 把下面这行的扩展名改成 .jpg / .png / .webp 即可。
    urls.push(`assets/img/pages/${seriesId}/${chapter.id}/p${n}.svg`);
  }
  return urls;
}
