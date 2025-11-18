let currentScene = "start";
let energy = 0;

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

  logic_path: { type: "riddles", nextWin: "logic_win", nextLose: "lose" },
  logic_win: {
    text: "Ты решил все загадки! +10 энергии<br>Помочь NPC за секретную концовку?",
    choices: [
      { text: "Да", next: "npc_quiz" },
      { text: "Нет", next: "simon_game" },
    ],
  },
  npc_quiz: { type: "npc", nextWin: "secret_arcade", nextLose: "lose" },
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
  { q: "Скрывает элемент полностью", a: "display none" },
  { q: "Цикл с условием в начале", a: "while" },
  { q: "Хранит данные после закрытия", a: "localstorage" },
  { q: "Слияние веток в git", a: "merge" },
  { q: "Позиционирование относительно родителя", a: "relative" },
  { q: "Асинхронность в JS", a: "promise" },
  { q: "Добавляет обработчик", a: "addeventlistener" },
  { q: "Центрирует блок", a: "margin auto" },
  { q: "Повтор фиксированное число раз", a: "for" },
  { q: "Задержка выполнения", a: "settimeout" },
];

showScene("start");

function showScene(name) {
  const s = scenes[name];
  currentScene = name;
  textEl.innerHTML = typeof s.text === "function" ? s.text() : s.text;
  choicesEl.innerHTML = "";

  if (s.choices) {
    s.choices.forEach((ch) => {
      const b = document.createElement("button");
      b.textContent = ch.text;
      b.onclick = () => showScene(ch.next);
      choicesEl.appendChild(b);
    });
  }

  if (s.type === "riddles") startRiddles();
  if (s.type === "npc") startNPCQuiz();
  if (s.type === "minigame") startMinigame(s.game, s.nextWin, s.nextLose);
  if (s.onLoad) s.onLoad();
}

function startRiddles() {
  let i = 0,
    correct = 0;
  const next = () => {
    if (i >= riddles.length) {
      energy += correct;
      showScene(correct === 10 ? "logic_win" : "lose");
      return;
    }
    textEl.innerHTML = `<strong>${i + 1}/10</strong><br>${riddles[i].q}`;
    choicesEl.innerHTML = `
      <input type="text" id="ans" placeholder="ответ" style="width:100%; box-sizing:border-box; padding:14px; margin:8px 0; border-radius:10px; border: none; background:#002211; color:#00ff99; font-size:18px;">
      <button style="width:100%;">OK</button>
    `;
    choicesEl.querySelector("button").onclick = () => {
      if (
        document
          .getElementById("ans")
          .value.trim()
          .toLowerCase()
          .includes(riddles[i].a)
      )
        correct++;
      i++;
      next();
    };
  };
  next();
}

function startNPCQuiz() {
  let i = 0,
    correct = 0;
  const next = () => {
    if (i >= 5) {
      energy += correct * 3;
      showScene(correct >= 4 ? "secret_arcade" : "lose");
      return;
    }
    const q = [
      "Что делает flex?",
      "Как добавить класс?",
      "Что возвращает fetch?",
      "Display для грида?",
      "Отменяет действие по умолчанию?",
    ][i];
    const opts = [
      ["Располагает элементы", "Анимирует", "Скрывает"],
      ["classList.add()", "style.class", "element.class"],
      ["Promise", "JSON", "Текст"],
      ["grid", "flex", "block"],
      ["preventDefault()", "stopPropagation()", "return false"],
    ];
    textEl.innerHTML = `<strong>${i + 1}/5</strong><br>${q}`;
    choicesEl.innerHTML = "";
    opts[i].forEach((t, idx) => {
      const b = document.createElement("button");
      b.textContent = t;
      b.onclick = () => {
        if (idx === 0) correct++;
        i++;
        next();
      };
      choicesEl.appendChild(b);
    });
  };
  next();
}

function startMinigame(type, win, lose) {
  choicesEl.innerHTML = "";

  if (type === "clicker") {
    textEl.innerHTML = "Кликер: 350 очков за 16 сек!";
    let score = 0,
      time = 16;
    choicesEl.innerHTML = `
      <progress value="0" max="350"></progress>
      <div style="font-size:28px;text-align:center;margin:15px">Время: ${time}</div>
      <button id="clickBtn" style="width:100%;padding:18px;font-size:28px">КЛИК! (или пробел)</button>
    `;
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

  if (type === "drag") {
    textEl.innerHTML = "Собери код в правильном порядке:";
    choicesEl.innerHTML = `
      <div id="pieces" style="margin:20px 0;">
        <div class="drag-piece" draggable="true" data-id="1">function hack() {</div>
        <div class="drag-piece" draggable="true" data-id="2">  alert("Взлом!");</div>
        <div class="drag-piece" draggable="true" data-id="3">}</div>
      </div>

      <div id="dropZone" class="drop-zone">← Перетащи сюда по порядку</div>
    `;

    const pieces = document.querySelectorAll(".drag-piece");
    const zone = document.getElementById("dropZone");
    let order = [];

    pieces.forEach((piece) => {
      piece.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", piece.dataset.id);
        piece.style.opacity = "0.5";
      });
      piece.addEventListener("dragend", () => {
        piece.style.opacity = "1";
      });
    });

    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const piece = document.querySelector(`[data-id="${id}"]`);
      if (piece && !zone.contains(piece)) {
        if (order.length === 0) {
          zone.innerHTML = "";
        }
        zone.appendChild(piece);
        order.push(id);
        if (order.length === 3) {
          energy += 4;
          showScene(order.join("") === "123" ? win : lose);
        }
      }
    });
  }

  if (type === "simon") {
    textEl.innerHTML = "Запомни 5 цветов!";
    choicesEl.innerHTML = `
      <button id="startSimon">Начать</button>
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

      const sequence = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 3),
      );
      let userSeq = [];
      let showing = true;
      const statusEl = document.getElementById("simonStatus");

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const showSequence = async () => {
        showing = true;
        statusEl.textContent = "Смотри!";
        statusEl.style.color = "#ffaa00";
        await delay(1000);
        for (let i = 0; i < sequence.length; i++) {
          statusEl.textContent = `Шаг ${i + 1}/5`;
          const btn = document.querySelector(`[data-color="${sequence[i]}"]`);
          btn.classList.add("glow");
          await delay(900);
          btn.classList.remove("glow");
          await delay(300);
        }
        showing = false;
        statusEl.textContent = "Твой ход! Вспоминай сколько нужно.";
        statusEl.style.color = "#00ff99";
      };
      showSequence();

      document.querySelectorAll(".btn").forEach((btn) => {
        btn.onclick = async () => {
          if (showing) return;
          const color = +btn.dataset.color;
          userSeq.push(color);
          btn.classList.add("glow");
          await delay(300);
          btn.classList.remove("glow");

          if (userSeq[userSeq.length - 1] !== sequence[userSeq.length - 1]) {
            statusEl.textContent = "Ошибка!";
            statusEl.style.color = "#ff0066";
            await delay(1800);
            showScene(lose);
            return;
          }
          if (userSeq.length === sequence.length) {
            energy += 5;
            statusEl.textContent = "Отлично!";
            await delay(1200);
            showScene(win);
          }
        };
      });
    };
  }

  if (type === "arcade") {
    textEl.innerHTML = "Выживи 20 секунд!<br>WASD или ФЫВАЦ";
    choicesEl.innerHTML = `<canvas id="canvas" width="400" height="400"></canvas><div id="timer" style="text-align:center;font-size:28px;margin:10px">20</div>
      <div style="display:flex; justify-content:space-around; margin:20px 0;">
        <button style="padding:20px; font-size:24px;" onmousedown="keys['w']=true; keys['ц']=true" onmouseup="keys['w']=false; keys['ц']=false" ontouchstart="keys['w']=true; keys['ц']=true" ontouchend="keys['w']=false; keys['ц']=false">↑</button>
        <button style="padding:20px; font-size:24px;" onmousedown="keys['a']=true; keys['ф']=true" onmouseup="keys['a']=false; keys['ф']=false" ontouchstart="keys['a']=true; keys['ф']=true" ontouchend="keys['a']=false; keys['ф']=false">←</button>
        <button style="padding:20px; font-size:24px;" onmousedown="keys['s']=true; keys['ы']=true" onmouseup="keys['s']=false; keys['ы']=false" ontouchstart="keys['s']=true; keys['ы']=true" ontouchend="keys['s']=false; keys['ы']=false">↓</button>
        <button style="padding:20px; font-size:24px;" onmousedown="keys['d']=true; keys['в']=true" onmouseup="keys['d']=false; keys['в']=false" ontouchstart="keys['d']=true; keys['в']=true" ontouchend="keys['d']=false; keys['в']=false">→</button>
      </div>`;
    const canvas = document.getElementById("canvas");
    if (window.innerWidth < 600) {
      canvas.width = 300;
      canvas.height = 300;
    }
    const ctx = canvas.getContext("2d");
    let x = canvas.width / 2,
      y = canvas.height - 60,
      timeLeft = 20,
      viruses = [],
      alive = true;
    const timerEl = document.getElementById("timer");

    const keys = {};
    window.addEventListener(
      "keydown",
      (e) => (keys[e.key.toLowerCase()] = true),
    );
    window.addEventListener(
      "keyup",
      (e) => (keys[e.key.toLowerCase()] = false),
    );

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

      if (keys["a"] || keys["ф"]) x -= 6;
      if (keys["d"] || keys["в"]) x += 6;
      if (keys["w"] || keys["ц"]) y -= 6;
      if (keys["s"] || keys["ы"]) y += 6;
      x = Math.max(30, Math.min(canvas.width - 30, x));
      y = Math.max(30, Math.min(canvas.height - 30, y));

      ctx.fillStyle = "#00ff99";
      ctx.fillRect(x - 25, y - 25, 50, 50);

      viruses = viruses.filter((v) => v.y < canvas.height + 40); // Clean up off-screen viruses
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
