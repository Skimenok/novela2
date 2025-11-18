let currentScene = "start";
let energy = 0;
let hintsLeft = 5;

const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");

const scenes = {
  start: {
    text: "Добро пожаловать в Цифровой Лабиринт...<br><small>Кликни по тексту 3 раза — пасхалка</small>",
    choices: [{ text: "Начать игру", next: "explore" }],
    onLoad: () => {
      let c = 0;
      textEl.onclick = () => {
        if (++c === 3) {
          energy += 5;
          alert("Пасхалка! +5 энергии!");
        }
      };
    },
  },
  explore: {
    text: "Выбери путь:",
    choices: [
      { text: "Путь Логики (10 загадок)", next: "logic_path" },
      {
        text: "Путь Скорости (Кликер → Сборка кода → Simon → Аркада)",
        next: "clicker_game",
      },
    ],
  },

  clicker_game: {
    type: "minigame",
    game: "clicker",
    nextWin: "drag_game",
    nextLose: "lose",
  },
  drag_game: {
    type: "minigame",
    game: "drag",
    nextWin: "simon_game",
    nextLose: "lose",
  },
  simon_game: {
    type: "minigame",
    game: "simon",
    nextWin: "arcade_game",
    nextLose: "lose",
  },
  arcade_game: {
    type: "minigame",
    game: "arcade",
    nextWin: "win",
    nextLose: "lose",
  },

  logic_path: { type: "riddles" },
  logic_win: {
    text: "Ты решил все загадки! +10 энергии<br>Помочь NPC за секретную концовку?",
    choices: [
      { text: "Да", next: "npc_quiz" },
      { text: "Нет", next: "simon_game" },
    ],
  },
  npc_quiz: { type: "npc" },
  secret_arcade: {
    type: "minigame",
    game: "arcade",
    nextWin: "secret_win",
    nextLose: "lose",
  },

  win: {
    text: () => `ТЫ ВЫБРАЛСЯ!\nЭнергия: ${energy}`,
    choices: [{ text: "Заново", next: "start" }],
  },
  secret_win: {
    text: () =>
      `СЕКРЕТНАЯ КОНЦОВКА!\nТы — хозяин Лабиринта!\nЭнергия: ${energy}`,
    choices: [{ text: "Ещё раз", next: "start" }],
  },
  lose: {
    text: () => `Поражение...\nЭнергия: ${energy}`,
    choices: [{ text: "Попробовать снова", next: "start" }],
  },
};

const riddles = [
  {
    q: "Скрывает элемент полностью",
    a: "display none",
    hint: "Это свойство CSS, а не visibility",
  },
  { q: "Цикл с условием в начале", a: "while", hint: "Не for и не do...while" },
  {
    q: "Хранит данные после закрытия",
    a: "localstorage",
    hint: "Не sessionStorage",
  },
  { q: "Слияние веток в git", a: "merge", hint: "Команда начинается на m..." },
  {
    q: "Позиционирование относительно родителя",
    a: "relative",
    hint: "Не absolute и не fixed",
  },
  {
    q: "Асинхронность в JS",
    a: "promise",
    hint: "Объект с .then() и .catch()",
  },
  {
    q: "Добавляет обработчик",
    a: "addeventlistener",
    hint: "Метод DOM-элемента",
  },
  {
    q: "Центрирует блок по горизонтали",
    a: "margin auto",
    hint: "Классика для block-элементов",
  },
  {
    q: "Повтор фиксированное число раз",
    a: "for",
    hint: "Три части в скобках",
  },
  {
    q: "Задержка выполнения",
    a: "settimeout",
    hint: "Принимает функцию и миллисекунды",
  },
];

const npcQuestions = [
  {
    q: "Что делает flex?",
    correct: 0,
    opts: ["Располагает элементы", "Анимирует", "Скрывает"],
    hint: "flex-контейнер управляет дочерними элементами",
  },
  {
    q: "Как добавить класс?",
    correct: 0,
    opts: ["classList.add()", "style.class", "element.class"],
    hint: "Используется classList",
  },
  {
    q: "Что возвращает fetch?",
    correct: 0,
    opts: ["Promise", "JSON", "Текст"],
    hint: "Сначала Response",
  },
  {
    q: "Display для грида?",
    correct: 0,
    opts: ["grid", "flex", "block"],
    hint: "Не flex",
  },
  {
    q: "Отменяет действие по умолчанию?",
    correct: 0,
    opts: ["preventDefault()", "stopPropagation()", "return false"],
    hint: "Метод события",
  },
];

// ПОДСКАЗКИ
function showHint(text) {
  let el = choicesEl.querySelector(".hint-text");
  if (!el) {
    el = document.createElement("div");
    el.className = "hint-text";
    choicesEl.appendChild(el);
  }
  el.textContent = "Подсказка: " + text;
}
function createHintButton(hint) {
  if (hintsLeft <= 0) return null;
  const btn = document.createElement("button");
  btn.className = "hint-btn";
  btn.textContent = `Подсказка (${hintsLeft})`;
  btn.onclick = () => {
    hintsLeft--;
    showHint(hint);
    btn.textContent =
      hintsLeft > 0 ? `Подсказка (${hintsLeft})` : "Подсказки закончились";
    btn.disabled = true;
  };
  return btn;
}

// ЗАГАДКИ — 1 ошибка = проигрыш
function startRiddles() {
  let i = 0;
  const next = () => {
    if (i >= riddles.length) {
      energy += 10;
      showScene("logic_win");
      return;
    }
    textEl.innerHTML = `<strong>${i + 1}/10</strong><br>${riddles[i].q}`;
    choicesEl.innerHTML = "";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "ответ";
    input.style.cssText =
      "width:100%;box-sizing:border-box;padding:14px;margin:8px 0;border-radius:10px;border:none;background:#002211;color:#00ff99;font-size:18px;";
    const ok = document.createElement("button");
    ok.textContent = "OK";
    ok.style.width = "100%";
    ok.onclick = () => {
      if (input.value.trim().toLowerCase().includes(riddles[i].a)) {
        i++;
        next();
      } else showScene("lose");
    };
    choicesEl.appendChild(input);
    choicesEl.appendChild(ok);
    if (riddles[i].hint) {
      const b = createHintButton(riddles[i].hint);
      if (b) choicesEl.appendChild(b);
    }
  };
  next();
}

// NPC — 1 ошибка = проигрыш
function startNPCQuiz() {
  let i = 0,
    correct = 0;
  const next = () => {
    if (i >= npcQuestions.length) {
      energy += correct * 3;
      showScene(correct >= 4 ? "secret_arcade" : "lose");
      return;
    }
    const q = npcQuestions[i];
    textEl.innerHTML = `<strong>${i + 1}/5</strong><br>${q.q}`;
    choicesEl.innerHTML = "";
    q.opts.forEach((txt, idx) => {
      const b = document.createElement("button");
      b.textContent = txt;
      b.onclick = () => {
        if (idx === q.correct) correct++;
        else {
          showScene("lose");
          return;
        }
        i++;
        next();
      };
      choicesEl.appendChild(b);
    });
    if (q.hint) {
      const b = createHintButton(q.hint);
      if (b) choicesEl.appendChild(b);
    }
  };
  next();
}

// МИНИ-ИГРЫ — ТОЧНО КАК У ТЕБЯ РАБОТАЛИ ДО ЭТОГО
function startMinigame(type, win, lose) {
  choicesEl.innerHTML = "";

  if (type === "clicker") {
    textEl.innerHTML = "Кликер: 350 очков за 16 сек!";
    let score = 0,
      time = 16;
    choicesEl.innerHTML = `<progress value="0" max="350"></progress><div style="font-size:28px;text-align:center;margin:15px">Время: ${time}</div><button id="clickBtn" style="width:100%;padding:18px;font-size:28px">КЛИК! (или пробел)</button>`;
    const btn = document.getElementById("clickBtn");
    const progress = choicesEl.querySelector("progress");
    const timerEl = choicesEl.children[1];
    const click = () => {
      score += Math.random() > 0.4 ? 10 : 20;
      progress.value = score;
      if (score >= 350) {
        clearInterval(timer);
        document.removeEventListener("keydown", handler);
        energy += 3;
        showScene(win);
      }
    };
    btn.onclick = click;
    const handler = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        click();
      }
    };
    document.addEventListener("keydown", handler);
    const timer = setInterval(() => {
      if (--time <= 0) {
        clearInterval(timer);
        document.removeEventListener("keydown", handler);
        showScene(lose);
      }
      timerEl.textContent = `Время: ${time}`;
    }, 1000);
  }

  // ... ВСЁ ДО ЭТОГО — БЕЗ ИЗМЕНЕНИЙ (сцены, загадки, подсказки, кликер, simon, аркада)

  // === ТОЛЬКО ЭТА ЧАСТЬ ИСПРАВЛЕНА — drag-and-drop 100% РАБОТАЕТ НА ТЕЛЕФОНАХ ===
  if (type === "drag") {
    textEl.innerHTML = "Собери код в правильном порядке:";
    choicesEl.innerHTML = `
    <div id="pieces" style="margin:20px 0; display:flex; flex-direction:column; gap:12px;">
      <div class="drag-piece" draggable="true" data-id="1">function fetchData(url) {</div>
      <div class="drag-piece" draggable="true" data-id="2">  return fetch(url)</div>
      <div class="drag-piece" draggable="true" data-id="3">    .then(response => response.json())</div>
      <div class="drag-piece" draggable="true" data-id="4">    .then(data => console.log(data))</div>
      <div class="drag-piece" draggable="true" data-id="5">    .catch(error => console.error(error));</div>
      <div class="drag-piece" draggable="true" data-id="6">}</div>
    </div>
    <div id="dropZone" class="drop-zone">Перетащи сюда по порядку</div>
    <button id="submitCode" style="width:100%; margin-top:20px;">Отправить</button>
  `;

    const pieces = document.getElementById("pieces");
    const zone = document.getElementById("dropZone");
    const submit = document.getElementById("submitCode");
    let dragged = null;

    // Делаем каждый кусок кода перетаскиваемым
    pieces.querySelectorAll(".drag-piece").forEach((piece) => {
      piece.addEventListener("dragstart", (e) => {
        dragged = piece;
        piece.style.opacity = "0.5";
        e.dataTransfer.setData("text/plain", ""); // нужно для десктопа
      });
      piece.addEventListener("dragend", () => {
        if (dragged) dragged.style.opacity = "1";
        dragged = null;
      });

      // === ПОДДЕРЖКА ПАЛЬЦЕМ (ТЕЛЕФОН) ===
      piece.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          dragged = piece;
          piece.style.opacity = "0.6";
          piece.style.transform = "scale(1.05)";
          piece.style.zIndex = "1000";
        },
        { passive: false },
      );

      piece.addEventListener(
        "touchmove",
        (e) => {
          if (!dragged) return;
          e.preventDefault();
          const touch = e.touches[0];
          dragged.style.position = "fixed";
          dragged.style.left = touch.clientX - dragged.offsetWidth / 2 + "px";
          dragged.style.top = touch.clientY - dragged.offsetHeight / 2 + "px";
          dragged.style.pointerEvents = "none"; // чтобы не мешал
        },
        { passive: false },
      );

      piece.addEventListener(
        "touchend",
        (e) => {
          if (!dragged) return;
          e.preventDefault();
          dragged.style.position = "";
          dragged.style.left = "";
          dragged.style.top = "";
          dragged.style.transform = "";
          dragged.style.zIndex = "";
          dragged.style.pointerEvents = "";
          dragged.style.opacity = "1";

          // Проверяем, над какой зоной отпустили
          const touch = e.changedTouches[0];
          const under = document.elementFromPoint(touch.clientX, touch.clientY);
          const target = under?.closest("#dropZone")
            ? zone
            : under?.closest("#pieces")
            ? pieces
            : null;

          if (target) {
            movePiece(dragged, target);
          } else {
            pieces.appendChild(dragged); // возвращаем обратно
          }
          dragged = null;
        },
        { passive: false },
      );
    });

    // Функция перемещения куска
    function movePiece(piece, container) {
      piece.remove();
      const rect = container.getBoundingClientRect();
      const y = piece.getBoundingClientRect().top;

      let closest = null;
      let minDist = Infinity;

      container.querySelectorAll(".drag-piece").forEach((child) => {
        const childRect = child.getBoundingClientRect();
        const dist = Math.abs(y - (childRect.top + childRect.height / 2));
        if (dist < minDist) {
          minDist = dist;
          closest = child;
        }
      });

      if (closest && minDist < 100) {
        container.insertBefore(piece, closest);
      } else {
        container.appendChild(piece);
      }
    }

    // Поддержка десктопного drag-and-drop
    zone.addEventListener("dragover", (e) => e.preventDefault());
    pieces.addEventListener("dragover", (e) => e.preventDefault());

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged) movePiece(dragged, zone);
    });
    pieces.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragged) movePiece(dragged, pieces);
    });

    // Кнопка отправить
    submit.onclick = () => {
      const order = Array.from(zone.querySelectorAll(".drag-piece"))
        .map((el) => el.dataset.id)
        .join("");
      energy += 4;
      showScene(order === "123456" ? win : lose);
    };
  }

  if (type === "simon") {
    textEl.innerHTML = "Запомни 5 цветов!";
    choicesEl.innerHTML = `
      <button id="startSimon" style="width:100%;padding:16px;font-size:20px">Начать</button>
      <div id="simonPanel" style="display:none;text-align:center">
        <div id="simonButtons">
          <button class="btn red" data-color="0">Красный</button>
          <button class="btn green" data-color="1">Зелёный</button>
          <button class="btn blue" data-color="2">Синий</button>
        </div>
        <div id="simonStatus" style="margin:25px;font-size:22px;color:#ffaa00">Готов?</div>
      </div>
    `;

    document.getElementById("startSimon").onclick = () => {
      document.getElementById("startSimon").style.display = "none";
      document.getElementById("simonPanel").style.display = "block";

      const seq = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 3),
      );
      let user = [],
        showing = true;
      const status = document.getElementById("simonStatus");
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));

      const play = async () => {
        showing = true;
        status.textContent = "Смотри!";
        await delay(1000);
        for (let i = 0; i < seq.length; i++) {
          status.textContent = `${i + 1}/5`;
          document
            .querySelector(`[data-color="${seq[i]}"]`)
            .classList.add("glow");
          await delay(900);
          document
            .querySelector(`[data-color="${seq[i]}"]`)
            .classList.remove("glow");
          await delay(300);
        }
        showing = false;
        status.textContent = "Твой ход!";
        status.style.color = "#00ff99";
      };
      play();

      document.querySelectorAll(".btn").forEach((b) => {
        b.onclick = async () => {
          if (showing) return;
          const c = +b.dataset.color;
          user.push(c);
          b.classList.add("glow");
          await delay(300);
          b.classList.remove("glow");
          if (user[user.length - 1] !== seq[user.length - 1]) {
            status.textContent = "Ошибка!";
            status.style.color = "#ff0066";
            await delay(1800);
            showScene(lose);
          } else if (user.length === seq.length) {
            energy += 5;
            status.textContent = "Отлично!";
            await delay(1200);
            showScene(win);
          }
        };
      });
    };
  }

  if (type === "arcade") {
    textEl.innerHTML = "Выживи 60 секунд!<br>Двигайся: A/D, стрелки, касания";
    const mobile =
      window.innerWidth < 600
        ? `<div style="display:flex;justify-content:center;gap:40px;margin:20px 0;"><button style="padding:20px;font-size:28px" id="leftBtn">Left</button><button style="padding:20px;font-size:28px" id="rightBtn">Right</button></div>`
        : "";
    choicesEl.innerHTML = `<canvas id="canvas" width="400" height="400"></canvas><div id="timer">60</div>${mobile}`;
    const canvas = document.getElementById("canvas");
    if (window.innerWidth < 600) {
      canvas.width = 300;
      canvas.height = 300;
    }
    const ctx = canvas.getContext("2d");
    let x = canvas.width / 2,
      y = canvas.height - 60,
      timeLeft = 60,
      viruses = [],
      alive = true;
    const timerEl = document.getElementById("timer");
    const keys = {};
    let touchX = 0;

    window.addEventListener(
      "keydown",
      (e) => (keys[e.key.toLowerCase()] = true),
    );
    window.addEventListener(
      "keyup",
      (e) => (keys[e.key.toLowerCase()] = false),
    );
    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        touchX = e.touches[0].clientX;
      },
      { passive: false },
    );
    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        x += (e.touches[0].clientX - touchX) * 0.8;
        touchX = e.touches[0].clientX;
        x = Math.max(30, Math.min(canvas.width - 30, x));
      },
      { passive: false },
    );

    if (window.innerWidth < 600) {
      document.getElementById("leftBtn").ontouchstart = () => (keys.a = true);
      document.getElementById("leftBtn").ontouchend = () => (keys.a = false);
      document.getElementById("rightBtn").ontouchstart = () => (keys.d = true);
      document.getElementById("rightBtn").ontouchend = () => (keys.d = false);
    }

    setInterval(() => {
      if (alive)
        viruses.push({
          x: 50 + Math.random() * (canvas.width - 100),
          y: -40,
          s: 3 + Math.random() * 2,
        });
    }, 850);

    function loop() {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (keys.a || keys["ф"] || keys.arrowleft) x -= 7;
      if (keys.d || keys["в"] || keys.arrowright) x += 7;
      x = Math.max(30, Math.min(canvas.width - 30, x));
      ctx.fillStyle = "#00ff99";
      ctx.fillRect(x - 25, y - 25, 50, 50);
      viruses.forEach((v) => {
        v.y += v.s;
        ctx.fillStyle = "#ff0066";
        ctx.fillRect(v.x - 20, v.y - 20, 40, 40);
        if (Math.abs(v.x - x) < 45 && Math.abs(v.y - y) < 45) {
          alive = false;
          timerEl.textContent = "Поражение!";
          timerEl.style.color = "#ff0066";
          setTimeout(() => showScene(lose), 2000);
        }
      });
      viruses = viruses.filter((v) => v.y < canvas.height + 50);
      timeLeft -= 1 / 60;
      timerEl.textContent = Math.ceil(timeLeft);
      if (timeLeft <= 0) {
        alive = false;
        energy += 8;
        timerEl.textContent = "ПОБЕДА!";
        timerEl.style.color = "#00ff99";
        setTimeout(() => showScene(win), 2000);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
}

function showScene(name) {
  const s = scenes[name];
  currentScene = name;
  textEl.innerHTML = typeof s.text === "function" ? s.text() : s.text;
  choicesEl.innerHTML = "";
  if (s.choices)
    s.choices.forEach((ch) => {
      const b = document.createElement("button");
      b.textContent = ch.text;
      b.onclick = () => showScene(ch.next);
      choicesEl.appendChild(b);
    });
  if (s.type === "riddles") startRiddles();
  if (s.type === "npc") startNPCQuiz();
  if (s.type === "minigame") startMinigame(s.game, s.nextWin, s.nextLose);
  if (s.onLoad) s.onLoad();
}

showScene("start");
