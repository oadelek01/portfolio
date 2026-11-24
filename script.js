/* =====================================================================
   NOSTALGIA COMPUTER — portfolio logic
   ===================================================================== */
(function () {
  "use strict";

  const bootScreen = document.getElementById("boot-screen");
  const monitor = document.getElementById("monitor");
  const desktop = document.getElementById("desktop");
  const bootLog = document.getElementById("boot-log");
  const clockEl = document.getElementById("clock");
  const typedEl = document.getElementById("typed");
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");
  const themeBtn = document.getElementById("theme-btn");

  const THEMES = ["amber", "green", "blue", "white"];
  let themeIndex = 0;
  let booted = false;

  /* ------------------------------------------------------------------
     Pixel icons (rendered as crisp SVG)
     ------------------------------------------------------------------ */
  const PIXELS = {
    home: [
      "...........",
      ".....#.....",
      "....###....",
      "...#####...",
      "..#######..",
      ".#########.",
      "###########",
      ".#########.",
      ".###...###.",
      ".###...###.",
      ".###...###.",
    ],
    folder: [
      "...........",
      ".#####.....",
      "#.....#....",
      ".##########",
      ".#........#",
      ".#........#",
      ".#........#",
      ".#........#",
      ".#........#",
      ".#........#",
      ".##########",
    ],
    user: [
      "....###....",
      "...#####...",
      "...#...#...",
      "...#####...",
      "....###....",
      "...#####...",
      "..#######..",
      "..#######..",
      ".#########.",
      ".#########.",
      "...........",
    ],
    mail: [
      "...........",
      "###########",
      "#.........#",
      "#..#####..#",
      "#.#.....#.#",
      "#..##.##..#",
      "#....#....#",
      "#.........#",
      "#.........#",
      "#.........#",
      "###########",
    ],
    doc: [
      "..#######..",
      "..#.....#..",
      "..#..###.#.",
      "..#..#.#.#.",
      "..#..###.#.",
      "..#..#.#.#.",
      "..#..#.#.#.",
      "..#..###.#.",
      "..#.....#..",
      "..#######..",
      "...........",
    ],
  };

  function renderPixel(map) {
    const rows = map.length;
    const cols = map[0].length;
    let rects = "";
    map.forEach((row, y) => {
      for (let x = 0; x < cols; x++) {
        if (row[x] === "#") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    });
    return (
      `<svg viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
      `<g fill="currentColor">${rects}</g></svg>`
    );
  }

  document.querySelectorAll("[data-pixel]").forEach((el) => {
    const key = el.getAttribute("data-pixel");
    if (PIXELS[key]) el.innerHTML = renderPixel(PIXELS[key]);
  });

  /* ------------------------------------------------------------------
     Typed intro
     ------------------------------------------------------------------ */
  const PHRASES = [
    "I build full-stack web apps and AI-powered tools.",
    "Python, JavaScript, React, Node.js, AWS.",
    "From AI sports-betting analysis to real-time waiting rooms.",
    "Open to new-graduate software engineering roles.",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = PHRASES[phraseIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
      setTimeout(typeLoop, 34);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 16);
    }
  }

  /* ------------------------------------------------------------------
     Clock
     ------------------------------------------------------------------ */
  function tick() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    clockEl.textContent = hh + ":" + mm;
  }
  tick();
  setInterval(tick, 15000);

  /* ------------------------------------------------------------------
     Boot sequence
     ------------------------------------------------------------------ */
  const BOOT_LINES = [
    "NOSTALGIA COMPUTER BIOS v1.0",
    "CPU ........ OK",
    "MEMORY ..... 640K OK",
    "PHOSPHOR ... AMBER",
    "LOADING DESKTOP.SYS ...",
    "WELCOME, OLUWATITOMI.",
    "",
  ];

  function beginBoot() {
    if (booted) return;
    booted = true;
    bootScreen.classList.add("is-hidden");
    monitor.classList.remove("is-hidden");

    // Boot log sequence
    bootLog.classList.remove("is-hidden");
    desktop.querySelector(".intro").classList.add("is-hidden");
    desktop.querySelector(".desktop-icons").classList.add("is-hidden");

    let li = 0;
    bootLog.innerHTML = "";
    function writeLine() {
      if (li < BOOT_LINES.length) {
        bootLog.innerHTML += BOOT_LINES[li] + "\n";
        li++;
        setTimeout(writeLine, 90);
      } else {
        bootLog.innerHTML += "<span class='cursor'>█</span>";
        setTimeout(finishBoot, 500);
      }
    }
    writeLine();
  }

  function finishBoot() {
    bootLog.classList.add("is-hidden");
    desktop.querySelector(".intro").classList.remove("is-hidden");
    desktop.querySelector(".desktop-icons").classList.remove("is-hidden");
    typeLoop();
  }

  bootScreen.addEventListener("click", beginBoot);
  document.addEventListener("keydown", function onFirstKey() {
    beginBoot();
  }, { once: false });

  /* ------------------------------------------------------------------
     Window management
     ------------------------------------------------------------------ */
  const windows = Array.from(document.querySelectorAll(".window"));
  const WIN_SIZE = {
    "win-work": { w: 470, h: 440 },
    "win-about": { w: 660, h: 480 },
    "win-contact": { w: 470, h: 400 },
    "win-project-sharpai": { w: 540, h: 500 },
    "win-project-queueup": { w: 540, h: 440 },
    "win-project-olli": { w: 540, h: 420 },
  };
  let cascade = 0;

  function focusWindow(win) {
    windows.forEach((w) => w.classList.remove("is-focused"));
    win.classList.add("is-focused");
    win.style.zIndex = 40;
    const max = Math.max(...windows.filter((w) => w !== win).map((w) => parseInt(w.style.zIndex) || 30), 29);
    // bring above others
    win.style.zIndex = max + 1;
  }

  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    startMenu.classList.add("is-hidden");
    win.classList.remove("is-hidden");
    win.classList.remove("is-maximized");

    // set size once
    if (!win.dataset.sized) {
      const size = WIN_SIZE[id] || { w: 480, h: 380 };
      const dw = desktop.clientWidth - 28;
      const dh = desktop.clientHeight - 28;
      win.style.width = Math.min(size.w, dw) + "px";
      win.style.height = Math.min(size.h, dh) + "px";
      win.dataset.sized = "1";
    }

    // position (center + cascade) unless already placed
    if (!win.dataset.placed) {
      const w = parseInt(win.style.width);
      const h = parseInt(win.style.height);
      const dw = desktop.clientWidth;
      const dh = desktop.clientHeight;
      const ox = (cascade % 5) * 22;
      const oy = (cascade % 5) * 22;
      cascade++;
      win.style.left = Math.max(8, Math.round((dw - w) / 2 + ox)) + "px";
      win.style.top = Math.max(8, Math.round((dh - h) / 2 + oy)) + "px";
      win.dataset.placed = "1";
    }

    focusWindow(win);
  }

  function closeWindow(win) {
    win.classList.add("is-hidden");
    win.classList.remove("is-maximized");
  }

  function toggleMaximize(win) {
    win.classList.toggle("is-maximized");
    focusWindow(win);
  }

  windows.forEach((win) => {
    const close = win.querySelector(".win-close");
    const min = win.querySelector(".win-min");
    const max = win.querySelector(".win-max");
    const titlebar = win.querySelector(".window-titlebar");

    close.addEventListener("click", () => closeWindow(win));
    min.addEventListener("click", () => closeWindow(win));
    max.addEventListener("click", () => toggleMaximize(win));

    win.addEventListener("pointerdown", () => focusWindow(win));

    // Drag
    titlebar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".win-btn")) return;
      if (win.classList.contains("is-maximized")) return;
      const rect = win.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;
      const move = (ev) => {
        const nx = ev.clientX - desktop.getBoundingClientRect().left - offX;
        const ny = ev.clientY - desktop.getBoundingClientRect().top - offY;
        win.style.left = Math.max(-rect.width + 40, Math.min(desktop.clientWidth - 40, nx)) + "px";
        win.style.top = Math.max(0, Math.min(desktop.clientHeight - 30, ny)) + "px";
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  });

  /* ------------------------------------------------------------------
     Openers
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-window]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.window;
      startMenu.classList.add("is-hidden");

      if (target === "cv") {
        const a = document.createElement("a");
        a.href = "assets/Oluwatitomi-Adeleke-CV.pdf";
        a.download = "Oluwatitomi-Adeleke-CV.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      if (target === "home") {
        windows.forEach(closeWindow);
        return;
      }
      openWindow("win-" + target);
    });
  });

  document.querySelectorAll("[data-project]").forEach((el) => {
    el.addEventListener("click", () => openWindow("win-project-" + el.dataset.project));
  });

  /* ------------------------------------------------------------------
     Start menu
     ------------------------------------------------------------------ */
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("is-hidden");
  });
  document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      startMenu.classList.add("is-hidden");
    }
  });

  function shutDown() {
    startMenu.classList.add("is-hidden");
    windows.forEach(closeWindow);
    desktop.querySelector(".intro").classList.add("is-hidden");
    desktop.querySelector(".desktop-icons").classList.add("is-hidden");
    monitor.classList.add("is-hidden");
    bootScreen.classList.remove("is-hidden");
    booted = false;
  }

  document.getElementById("start-power").addEventListener("click", shutDown);
  const monitorPower = document.getElementById("monitor-power");
  if (monitorPower) monitorPower.addEventListener("click", shutDown);

  /* ------------------------------------------------------------------
     Theme switching
     ------------------------------------------------------------------ */
  themeBtn.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % THEMES.length;
    monitor.setAttribute("data-theme", THEMES[themeIndex]);
  });

  /* ------------------------------------------------------------------
     Live demos
     ------------------------------------------------------------------ */
  function initDemos() {
    // SharpAI (real app UI demo — pick a preset game, receive analysis)
    const saiGame = document.getElementById("sai-game");
    const saiSubmit = document.getElementById("sai-submit");
    const saiNewChat = document.getElementById("sai-new-chat");
    const saiWelcome = document.getElementById("sai-welcome");
    const saiForm = document.getElementById("sai-form");
    const saiLoading = document.getElementById("sai-loading");
    const saiChat = document.getElementById("sai-chat");
    const saiMessages = document.getElementById("sai-messages");
    const saiMsg = document.getElementById("sai-msg");
    const saiSend = document.getElementById("sai-send");

    function saiAddMessage(role, content) {
      const d = document.createElement("div");
      d.className = "sai-msg " + role;
      d.textContent = content;
      saiMessages.appendChild(d);
      saiMessages.scrollTop = saiMessages.scrollHeight;
    }

    function saiReset() {
      saiWelcome.style.display = "";
      saiForm.style.display = "";
      saiLoading.style.display = "none";
      saiChat.style.display = "none";
      saiMessages.innerHTML = "";
      saiMsg.value = "";
      saiGame.value = "";
      saiSubmit.disabled = true;
    }

    function saiAnalyze() {
      const pick = saiGame.value;
      if (!pick) return; // restrictive: only preset games
      const parts = pick.split(" vs ");
      const a = parts[0];
      const b = parts[1];
      saiWelcome.style.display = "none";
      saiForm.style.display = "none";
      saiLoading.style.display = "flex";
      saiChat.style.display = "none";
      setTimeout(() => {
        saiLoading.style.display = "none";
        saiChat.style.display = "flex";
        saiMessages.innerHTML = "";
        saiAddMessage("assistant",
          "Summary of " + a + " Last 5 Games:\n3W 2L · strong home form · 112.4 PPG\n\n" +
          "Summary of " + b + " Last 5 Games:\n2W 3L · road-heavy stretch · 104.1 PPG\n\n" +
          "Injury Report:\n" + a + ": 1 starter questionable (ankle)\n" + b + ": 2 rotation players out\n\n" +
          "Projections:\nModel projects " + a + " to edge " + b + " by 5.5 pts (56% win probability).\n\n" +
          "Recommendation:\nSMALL bet (1–2% of bankroll) · MEDIUM risk. Bet responsibly.");
      }, 1200);
    }

    if (saiSubmit) {
      saiSubmit.addEventListener("click", saiAnalyze);
      saiGame.addEventListener("change", () => { saiSubmit.disabled = !saiGame.value; });
    }
    if (saiNewChat) saiNewChat.addEventListener("click", saiReset);

    function saiSendMessage() {
      const t = saiMsg.value.trim();
      if (!t) return;
      saiAddMessage("user", t);
      saiMsg.value = "";
      setTimeout(() => {
        saiAddMessage("assistant", "Based on the analysis, recent form favors the selected team, but injuries add variance. Treat this as informational, not a guarantee.");
      }, 600);
    }
    if (saiSend) {
      saiSend.addEventListener("click", saiSendMessage);
      saiMsg.addEventListener("keydown", (e) => { if (e.key === "Enter") saiSendMessage(); });
    }

    // QueueUp (real app UI demo)
    const quName = document.getElementById("qu-name");
    const quJoinBtn = document.getElementById("qu-join-btn");
    const quJoin = document.getElementById("qu-join");
    const quStatus = document.getElementById("qu-status");
    const quServe = document.getElementById("qu-serve");
    const quPosition = document.getElementById("qu-position");
    const quAhead = document.getElementById("qu-ahead");
    const quWait = document.getElementById("qu-wait");
    const quLeaveBtn = document.getElementById("qu-leave-btn");
    const quDoneBtn = document.getElementById("qu-done-btn");
    let quTimer = null;
    let quPos = 0;

    function quShow(el) {
      [quJoin, quStatus, quServe].forEach((s) => { if (s) s.style.display = "none"; });
      if (el) el.style.display = "flex";
    }

    function quUpdateStatus() {
      quPosition.textContent = "#" + quPos;
      quAhead.textContent = String(Math.max(0, quPos - 1));
      quWait.textContent = "~" + (quPos * 2) + " min";
    }

    if (quJoinBtn) {
      quName.addEventListener("input", () => { quJoinBtn.disabled = !quName.value.trim(); });
      quJoinBtn.addEventListener("click", () => {
        quPos = 3 + Math.floor(Math.random() * 4);
        quShow(quStatus);
        quUpdateStatus();
        clearInterval(quTimer);
        quTimer = setInterval(() => {
          quPos--;
          if (quPos <= 0) {
            clearInterval(quTimer);
            quShow(quServe);
            return;
          }
          quUpdateStatus();
        }, 1500);
      });
    }
    if (quLeaveBtn) {
      quLeaveBtn.addEventListener("click", () => {
        clearInterval(quTimer);
        quName.value = "";
        quJoinBtn.disabled = true;
        quShow(quJoin);
      });
    }
    if (quDoneBtn) {
      quDoneBtn.addEventListener("click", () => {
        quName.value = "";
        quJoinBtn.disabled = true;
        quShow(quJoin);
      });
    }

    // OlliCheer (social feed)
    const olliFeed = document.getElementById("olli-feed");
    const olliInput = document.getElementById("olli-input");
    const olliPost = document.getElementById("olli-post");
    if (olliPost && olliFeed) {
      const addPost = () => {
        const t = olliInput.value.trim();
        if (!t) return;

        const post = document.createElement("div");
        post.className = "olli-post";

        const head = document.createElement("div");
        head.className = "olli-post-head";
        const avatar = document.createElement("span");
        avatar.className = "olli-avatar olli-avatar-me";
        avatar.textContent = "T";
        const name = document.createElement("span");
        name.className = "olli-post-name";
        name.textContent = "You ";
        const time = document.createElement("em");
        time.className = "olli-time";
        time.textContent = "· now";
        name.appendChild(time);
        head.appendChild(avatar);
        head.appendChild(name);

        const body = document.createElement("p");
        body.className = "olli-post-body";
        body.textContent = t;

        const actions = document.createElement("div");
        actions.className = "olli-actions";
        const like = document.createElement("span");
        like.textContent = "❤️ 0";
        const cmt = document.createElement("span");
        cmt.textContent = "💬 0";
        actions.appendChild(like);
        actions.appendChild(cmt);

        post.appendChild(head);
        post.appendChild(body);
        post.appendChild(actions);
        olliFeed.prepend(post);
        olliInput.value = "";
      };
      olliPost.addEventListener("click", addPost);
      olliInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addPost(); });
    }
  }

  initDemos();

  /* Expose for debugging */
  window.__portfolio = { openWindow, closeWindow, beginBoot };
})();
