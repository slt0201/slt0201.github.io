/* ==========================================================================
   音乐播放器
   把音乐文件放进 assets/music/，然后在 PLAYLIST 里填写文件名即可。
   支持 mp3 / ogg / wav 等浏览器支持的音频格式。
   ========================================================================== */

const PLAYLIST = [
  { title: "ここでファーストキッス", file: "ここでファーストキッス.mp3" },
  { title: "モブノデレラ", file: "モブノデレラ.mp3" },
  { title: "星が消えないうちに", file: "星が消えないうちに.mp3" },
  { title: "殺してぇ", file: "殺してぇ.mp3" },
  { title: "私の悪夢でいて", file: "私の悪夢でいて.mp3" }
];

(function () {
  const player = document.getElementById("music-player");
  if (!player) return;

  const audio = player.querySelector("#music-audio");
  const titleEl = player.querySelector("#music-title");
  const playBtn = player.querySelector("#music-play");
  const prevBtn = player.querySelector("#music-prev");
  const nextBtn = player.querySelector("#music-next");
  const progress = player.querySelector("#music-progress");
  const volume = player.querySelector("#music-volume");
  const toggleBtn = player.querySelector("#music-toggle");
  const body = document.body;

  let index = Number(localStorage.getItem("music-index") || 0);
  if (!Number.isFinite(index) || index < 0 || index >= PLAYLIST.length) index = 0;

  function hasTracks() {
    return PLAYLIST.length > 0;
  }

  function updateTitle() {
    if (!hasTracks()) {
      titleEl.textContent = "暂无音乐";
      playBtn.disabled = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      progress.disabled = true;
      return;
    }

    titleEl.textContent = PLAYLIST[index].title;
    playBtn.disabled = false;
    prevBtn.disabled = PLAYLIST.length < 2;
    nextBtn.disabled = PLAYLIST.length < 2;
  }

  function loadTrack(autoplay = false) {
    if (!hasTracks()) {
      updateTitle();
      return;
    }

    const track = PLAYLIST[index];
    audio.src = "assets/music/" + encodeURI(track.file);
    audio.load();
    titleEl.textContent = track.title;
    localStorage.setItem("music-index", String(index));

    if (autoplay) {
      audio.play().catch(() => {});
    }
  }

  function setPlayingUI() {
    playBtn.textContent = audio.paused ? "▶" : "Ⅱ";
    playBtn.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
    player.classList.toggle("is-playing", !audio.paused);
  }

  playBtn.addEventListener("click", () => {
    if (!hasTracks()) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });

  prevBtn.addEventListener("click", () => {
    if (!hasTracks()) return;
    index = (index - 1 + PLAYLIST.length) % PLAYLIST.length;
    loadTrack(true);
  });

  nextBtn.addEventListener("click", () => {
    if (!hasTracks()) return;
    index = (index + 1) % PLAYLIST.length;
    loadTrack(true);
  });

  audio.addEventListener("play", setPlayingUI);
  audio.addEventListener("pause", setPlayingUI);
  audio.addEventListener("ended", () => {
    if (!hasTracks()) return;
    index = (index + 1) % PLAYLIST.length;
    loadTrack(true);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progress.value = String((audio.currentTime / audio.duration) * 100);
  });

  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  volume.value = localStorage.getItem("music-volume") || "0.7";
  audio.volume = Number(volume.value);
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    localStorage.setItem("music-volume", volume.value);
  });

  toggleBtn.addEventListener("click", () => {
    const hidden = player.classList.toggle("is-collapsed");
    localStorage.setItem("music-collapsed", String(hidden));
    toggleBtn.textContent = hidden ? "♪" : "×";
    toggleBtn.setAttribute("aria-label", hidden ? "展开音乐播放器" : "收起音乐播放器");
  });

  if (localStorage.getItem("music-collapsed") === "true") {
    player.classList.add("is-collapsed");
    toggleBtn.textContent = "♪";
    toggleBtn.setAttribute("aria-label", "展开音乐播放器");
  }

  // 阅读器切换页面时也保持播放器状态；浏览器刷新后不会自动播放，这是浏览器的限制。
  updateTitle();
  loadTrack(false);
  setPlayingUI();
})();
