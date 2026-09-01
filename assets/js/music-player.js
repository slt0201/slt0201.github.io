/* ==========================================================================
   全站音乐播放器
   ========================================================================== */

const PLAYLIST = [
  { title: "ここでファーストキッス", file: "ここでファーストキッス.mp3" },
  { title: "モブノデレラ", file: "モブノデレラ.mp3" },
  { title: "星が消えないうちに", file: "星が消えないうちに.mp3" },
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

  let index = Number(
    localStorage.getItem("music-index") || 0
  );

  if (
    !Number.isFinite(index) ||
    index < 0 ||
    index >= PLAYLIST.length
  ) {
    index = 0;
  }

  let savedTime = Number(
    localStorage.getItem("music-time") || 0
  );

  const savedVolume =
    localStorage.getItem("music-volume");

  const wasPlaying =
    localStorage.getItem("music-playing") === "true";


  // ==========================================================
  // 基础
  // ==========================================================

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

    titleEl.textContent =
      PLAYLIST[index].title;

    playBtn.disabled = false;
    prevBtn.disabled =
      PLAYLIST.length < 2;
    nextBtn.disabled =
      PLAYLIST.length < 2;
  }


  // ==========================================================
  // 播放器 UI
  // ==========================================================

  function setPlayingUI() {
    const playing = !audio.paused;

    playBtn.textContent =
      playing ? "Ⅱ" : "▶";

    playBtn.setAttribute(
      "aria-label",
      playing ? "暂停" : "播放"
    );

    player.classList.toggle(
      "is-playing",
      playing
    );

    localStorage.setItem(
      "music-playing",
      String(playing)
    );
  }


  // ==========================================================
  // 保存播放位置
  // ==========================================================

  function savePosition() {
    if (!hasTracks()) return;

    localStorage.setItem(
      "music-index",
      String(index)
    );

    if (
      Number.isFinite(audio.currentTime)
    ) {
      localStorage.setItem(
        "music-time",
        String(audio.currentTime)
      );
    }
  }


  // ==========================================================
  // 加载歌曲
  // ==========================================================

  function loadTrack(
    autoplay = false,
    restoreTime = true
  ) {
    if (!hasTracks()) {
      updateTitle();
      return;
    }

    const track =
      PLAYLIST[index];

    audio.src =
      "assets/music/" +
      encodeURI(track.file);

    audio.load();

    titleEl.textContent =
      track.title;

    localStorage.setItem(
      "music-index",
      String(index)
    );

    if (restoreTime && savedTime > 0) {
      const restore = () => {
        if (
          Number.isFinite(audio.duration) &&
          audio.duration > 0
        ) {
          audio.currentTime =
            Math.min(
              savedTime,
              audio.duration
            );
        }

        audio.removeEventListener(
          "loadedmetadata",
          restore
        );

        if (autoplay) {
          audio.play().catch(() => {});
        }
      };

      audio.addEventListener(
        "loadedmetadata",
        restore
      );
    } else if (autoplay) {
      audio.play().catch(() => {});
    }
  }


  // ==========================================================
  // 播放 / 暂停
  // ==========================================================

  playBtn.addEventListener(
    "click",
    function () {
      if (!hasTracks()) return;

      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  );


  // ==========================================================
  // 上一首
  // ==========================================================

  prevBtn.addEventListener(
    "click",
    function () {
      if (!hasTracks()) return;

      index =
        (index - 1 + PLAYLIST.length) %
        PLAYLIST.length;

      savedTime = 0;

      localStorage.setItem(
        "music-time",
        "0"
      );

      loadTrack(true, false);
    }
  );


  // ==========================================================
  // 下一首
  // ==========================================================

  nextBtn.addEventListener(
    "click",
    function () {
      if (!hasTracks()) return;

      index =
        (index + 1) %
        PLAYLIST.length;

      savedTime = 0;

      localStorage.setItem(
        "music-time",
        "0"
      );

      loadTrack(true, false);
    }
  );


  // ==========================================================
  // 播放事件
  // ==========================================================

  audio.addEventListener(
    "play",
    function () {
      setPlayingUI();
      savePosition();
    }
  );


  audio.addEventListener(
    "pause",
    function () {
      setPlayingUI();
      savePosition();
    }
  );


  // ==========================================================
  // 播放结束 → 下一首
  // ==========================================================

  audio.addEventListener(
    "ended",
    function () {
      if (!hasTracks()) return;

      index =
        (index + 1) %
        PLAYLIST.length;

      savedTime = 0;

      localStorage.setItem(
        "music-time",
        "0"
      );

      loadTrack(true, false);
    }
  );


  // ==========================================================
  // 播放进度
  // ==========================================================

  audio.addEventListener(
    "timeupdate",
    function () {
      if (!audio.duration) return;

      progress.value =
        String(
          (audio.currentTime /
            audio.duration) *
          100
        );

      savePosition();
    }
  );


  progress.addEventListener(
    "input",
    function () {
      if (!audio.duration) return;

      audio.currentTime =
        (Number(progress.value) / 100) *
        audio.duration;

      savePosition();
    }
  );


  // ==========================================================
  // 音量
  // ==========================================================

  volume.value =
    savedVolume || "0.7";

  audio.volume =
    Number(volume.value);

  volume.addEventListener(
    "input",
    function () {
      audio.volume =
        Number(volume.value);

      localStorage.setItem(
        "music-volume",
        volume.value
      );
    }
  );


  // ==========================================================
  // 收起播放器
  // ==========================================================

  function updateCollapsedUI(
    collapsed
  ) {
    player.classList.toggle(
      "is-collapsed",
      collapsed
    );

    toggleBtn.textContent =
      collapsed ? "♪" : "×";

    toggleBtn.setAttribute(
      "aria-label",
      collapsed
        ? "展开音乐播放器"
        : "收起音乐播放器"
    );
  }


  toggleBtn.addEventListener(
    "click",
    function () {
      const collapsed =
        player.classList.toggle(
          "is-collapsed"
        );

      localStorage.setItem(
        "music-collapsed",
        String(collapsed)
      );

      updateCollapsedUI(
        collapsed
      );
    }
  );


  if (
    localStorage.getItem(
      "music-collapsed"
    ) === "true"
  ) {
    updateCollapsedUI(true);
  }


  // ==========================================================
  // 页面离开前保存状态
  // ==========================================================

  window.addEventListener(
    "beforeunload",
    savePosition
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        savePosition();
      }
    }
  );


  // ==========================================================
  // 初始化
  // ==========================================================

  updateTitle();

  loadTrack(
    false,
    true
  );

  setPlayingUI();

})();