// Глобальные переменные
let currentScene = "start";
let energy = 0;
let hintsUsed = 0;
const globalMaxHints = 5;

const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");

// Объект сцен
const scenes = {
  start: {
    text: "Ты просыпаешься в цифровом мире. Экран мигает: 'Добро пожаловать в Лабиринт Кода. Реши испытания, чтобы выбраться.' (Пасхалка: кликни на текст 3 раза для +1 energy)",
    choices: [
      { text: "Начать исследование", next: "explore" },
      { text: "Игнорировать", next: "ignore" },
    ],
    onLoad: () => {
      let clicks = 0;
      textEl.onclick = () => {
        clicks++;
        if (clicks === 3) {
          energy += 1;
          alert("Пасхалка найдена! +1 energy");
        }
      };
    },
  },
  ignore: {
    text: "Ты игнорируешь вызов. Лабиринт стирает тебя... Конец.",
    choices: [{ text: "Начать заново", next: "start" }],
  },
  explore: {
    text: "Ты подходишь к первому терминалу. 'Выбери путь: Логика или Скорость?'",
    choices: [
      { text: "Логика (загадки)", next: "logic_path" },
      { text: "Скорость (игра)", next: "speed_path" },
    ],
  },
  logic_path: {
    type: "riddle_series_open",
    riddles: [
      {
        question:
          "Я скрываю элементы на странице, но не прячу их навсегда — что я?",
        answers: [
          "display none",
          "display: none",
          "visibility hidden",
          "visibility: hidden",
          "дисплей ноне",
          "визIBILITY хидден",
        ],
        rules: "Пиши свойство CSS с значением, на англ или рус транслитом.",
        hints: [
          "Это CSS-свойство, влияет на рендер.",
          "Не opacity: 0, а что-то радикальное.",
        ],
        maxHints: 2,
      },
      {
        question:
          "Я управляю потоком выполнения в JS, повторяя код по условию — что я?",
        answers: ["while", "for", "loop", "цикл", "вайл", "фор"],
        rules: "Назови конструкцию JS, на англ или рус.",
        hints: ["Это цикл.", "Начинается с w или f."],
        maxHints: 2,
      },
      {
        question: "Я храню данные в браузере даже после перезагрузки — что я?",
        answers: [
          "localstorage",
          "local storage",
          "локалсторадж",
          "локал сторадж",
        ],
        rules: "Назови API браузера.",
        hints: ["Не cookies.", "Часть Web Storage API."],
        maxHints: 2,
      },
      {
        question: "Я объединяю изменения в git, решая конфликты — что я?",
        answers: ["merge", "мерж", "слияние"],
        rules: "Команда git.",
        hints: ["Не commit.", "Связана с ветками."],
        maxHints: 2,
      },
      {
        question: "Я позиционирую элементы относительно родителя — что я?",
        answers: [
          "position relative",
          "position: relative",
          "позишн релатив",
          "относительное позиционирование",
        ],
        rules: "CSS-свойство с значением.",
        hints: ["Не absolute.", "Для контейнера."],
        maxHints: 2,
      },
      {
        question: "Я асинхронный, обещаю результат — что я?",
        answers: ["promise", "промис"],
        rules: "JS-конструкция.",
        hints: ["Для async.", "then/catch."],
        maxHints: 2,
      },
      {
        question: "Я рендерю DOM, но не художник — что я?",
        answers: ["render", "рендер", "browser render"],
        rules: "Процесс в браузере.",
        hints: ["Не React.", "Базовый."],
        maxHints: 2,
      },
      {
        question: "Я циклю код, пока условие верно — что я?",
        answers: ["while loop", "while", "вайл луп"],
        rules: "JS-цикл.",
        hints: ["Не for.", "Условие в начале."],
        maxHints: 2,
      },
      {
        question: "Я добавляю событие клика в JS — что я?",
        answers: [
          "addeventlistener click",
          "addEventListener('click')",
          "onclick",
        ],
        rules: "Метод DOM.",
        hints: ["Не таймер.", "Слушатель."],
        maxHints: 2,
      },
      {
        question: "Я центрирую div — что я?",
        answers: ["margin auto", "margin: auto", "марджин ауто"],
        rules: "CSS для блока.",
        hints: ["Не flex.", "Для горизонтального центра."],
        maxHints: 2,
      },
    ],
    nextWin: "logic_win",
    nextLose: "start", // Рестарт
  },
  speed_path: {
    type: "minigame",
    gameType: "clicker",
    nextWin: "speed_win",
    nextLose: "lose", // Теперь экран поражения
  },
  logic_win: {
    text: "Отлично! Ты решил серию загадок. Энергия повышается. Теперь выбор: Помочь цифровому NPC?",
    choices: [
      { text: "Помочь", next: "help_npc" },
      { text: "Идти дальше", next: "go_on" },
    ],
  },
  logic_lose: {
    text: "Неверно в серии. Энергия падает. Но лабиринт даёт второй шанс.",
    choices: [{ text: "Попробовать снова", next: "logic_path" }],
  },
  speed_win: {
    text: "Успех в игре! Энергия +1. Теперь финальный вызов.",
    next: "final_challenge",
  },
  speed_lose: {
    text: "Провал. Энергия -1. Попробуй снова.",
    choices: [{ text: "Повторить", next: "speed_path" }],
  },
  help_npc: {
    type: "riddle_series_open",
    riddles: [
      {
        question: "Что делает flexbox?",
        answers: ["flexbox", "флексбокс", "располагает элементы"],
        rules: "Назови CSS-модель.",
        hints: ["Layout.", "display: flex."],
        maxHints: 2,
      },
      {
        question: "Как добавить событие клика в JS?",
        answers: ["addEventListener click", "onclick"],
        rules: "Метод.",
        hints: ["DOM.", "Не таймер."],
        maxHints: 2,
      },
      {
        question: "Что такое commit в git?",
        answers: ["commit", "коммит", "снимок изменений"],
        rules: "Команда git.",
        hints: ["Базовая.", "git commit -m."],
        maxHints: 2,
      },
      {
        question: "Как центрировать div?",
        answers: ["margin auto", "flex justify center"],
        rules: "CSS.",
        hints: ["Для блока.", "Не padding."],
        maxHints: 2,
      },
      {
        question: "Что возвращает Promise?",
        answers: ["асинхронный результат", "promise result"],
        rules: "Для async.",
        hints: ["then/catch.", "Не синхронно."],
        maxHints: 2,
      },
    ],
    nextWin: "npc_win",
    nextLose: "start", // Рестарт
  },
  go_on: {
    text: "Ты идёшь дальше без помощи. Энергия не меняется.",
    next: "final_challenge",
  },
  npc_win: {
    text: "NPC благодарит: 'Вот секретный путь!' Ты получаешь бонус.",
    next: "arcade", // Аркада перед секретной
  },
  npc_lose: {
    text: "NPC исчезает. Ты продолжаешь один.",
    next: "final_challenge",
  },
  final_challenge: {
    type: "minigame",
    gameType: "simon",
    nextWin: "arcade", // Аркада перед хорошей
    nextLose: "lose", // Экран поражения
  },
  arcade: {
    type: "minigame",
    gameType: "arcade",
    nextWin: currentScene === "final_challenge" ? "win" : "secret_ending",
    nextLose: "lose", // Экран поражения
  },
  win: {
    text: () => `Ты выбрался! Энергия: ${energy}. Хорошая концовка.`,
    choices: [{ text: "Сыграть снова", next: "start" }],
  },
  lose: {
    text: () => `Лабиринт победил. Энергия: ${energy}. Плохая концовка.`,
    choices: [{ text: "Попробовать снова", next: "start" }],
  },
  secret_ending: {
    text: () =>
      `Секретная концовка: Ты становишься хозяином лабиринта! Энергия: ${energy}.`,
    choices: [{ text: "Сыграть снова", next: "start" }],
  },
};

showScene(currentScene);

function showScene(name) {
  const scene = scenes[name];
  currentScene = name;
  textEl.classList.add("fade-in");
  setTimeout(() => textEl.classList.remove("fade-in"), 800);

  const sceneText =
    typeof scene.text === "function" ? scene.text() : scene.text;
  textEl.innerHTML = sceneText;

  if (scene.onLoad) scene.onLoad();

  if (scene.type === "minigame") {
    showMiniGame(scene.gameType, scene.nextWin, scene.nextLose);
    return;
  } else if (scene.type === "riddle_series_open") {
    showRiddleSeriesOpen(scene.riddles, scene.nextWin, scene.nextLose);
    return;
  } else if (scene.type === "riddle_open") {
    showRiddleOpen(scene.riddle);
    return;
  } else if (scene.type === "riddle_choice") {
    showRiddleChoice(scene.riddle);
    return;
  }

  choicesEl.innerHTML = "";
  if (scene.choices && scene.choices.length > 0) {
    scene.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => showScene(choice.next);
      choicesEl.appendChild(btn);
    });
  } else if (scene.next) {
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Продолжить";
    continueBtn.onclick = () => showScene(scene.next);
    choicesEl.appendChild(continueBtn);
  }
}

// Функция для серии открытых загадок
function showRiddleSeriesOpen(riddles, nextWin, nextLose) {
  let currentRiddleIndex = 0;
  let seriesEnergy = 0;

  function loadCurrentRiddle() {
    const riddle = riddles[currentRiddleIndex];
    showRiddleOpen(
      riddle,
      () => {
        seriesEnergy += 1;
        currentRiddleIndex += 1;
        if (currentRiddleIndex < riddles.length) {
          loadCurrentRiddle();
        } else {
          if (seriesEnergy === riddles.length) {
            energy += seriesEnergy;
            showScene(nextWin);
          } else {
            showScene(nextLose);
          }
        }
      },
      () => {
        alert("Неверно! Серия прервана.");
        showScene(nextLose);
      },
    );
  }

  loadCurrentRiddle();
}

// Открытые загадки
function showRiddleOpen(riddle, onSuccess, onFail) {
  textEl.innerHTML =
    riddle.question + "<br><small>" + riddle.rules + "</small>";
  choicesEl.innerHTML = `
    <input id="answer" type="text">
    <button id="submit">Ответить</button>
    <button id="hint">Подсказка (осталось: ${
      globalMaxHints - hintsUsed
    })</button>
  `;

  let currentHint = 0;
  document.getElementById("submit").onclick = () => {
    const user = document.getElementById("answer").value.toLowerCase().trim();
    if (riddle.answers.some((ans) => ans.toLowerCase() === user)) {
      if (onSuccess) onSuccess();
      else showScene(riddle.nextWin);
    } else {
      if (onFail) onFail();
      else alert("Неверно!");
    }
  };

  document.getElementById("hint").onclick = () => {
    if (hintsUsed < globalMaxHints && currentHint < riddle.hints.length) {
      alert(riddle.hints[currentHint]);
      currentHint++;
      hintsUsed++;
    } else {
      alert("Подсказки кончились!");
    }
  };
}

// Загадки с вариантами
function showRiddleChoice(riddle) {
  textEl.innerHTML = riddle.question;
  choicesEl.innerHTML = "";
  riddle.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option.text;
    btn.onclick = () => {
      if (option.correct) {
        energy += 1;
        showScene(riddle.nextWin);
      } else {
        energy -= 1;
        showScene(riddle.nextLose);
      }
    };
    choicesEl.appendChild(btn);
  });

  const hintBtn = document.createElement("button");
  hintBtn.textContent =
    "Подсказка (осталось: " + (globalMaxHints - hintsUsed) + ")";
  let currentHint = 0;
  hintBtn.onclick = () => {
    if (hintsUsed < globalMaxHints && currentHint < riddle.hints.length) {
      alert(riddle.hints[currentHint]);
      currentHint++;
      hintsUsed++;
    } else {
      alert("Подсказки кончились!");
    }
  };
  choicesEl.appendChild(hintBtn);
}

// Мини-игры
function showMiniGame(type, nextWin, nextLose) {
  if (type === "clicker") {
    textEl.innerHTML =
      "Взломай систему: Кликай быстро, чтобы заполнить бар! (Усложнено: max 300, +3-10)";
    choicesEl.innerHTML = `
      <progress id="progress" value="0" max="300"></progress>
      <div id="timer">20</div>
      <button id="click-btn">Клик!</button>
    `;

    let progress = 0;
    let timeLeft = 20;
    const progressBar = document.getElementById("progress");
    const timerEl = document.getElementById("timer");
    const btn = document.getElementById("click-btn");

    btn.onclick = () => {
      progress += Math.floor(Math.random() * 8) + 3; // 3-10
      progressBar.value = progress;
      if (progress >= 300) {
        energy += 1;
        alert("Успех!");
        showScene(nextWin);
      }
    };

    const countdown = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        showScene(nextLose); // Экран поражения
      }
    }, 1000);
  } else if (type === "drag") {
    textEl.innerHTML = "Собери код: Перетащи блоки в правильный порядок.";
    choicesEl.innerHTML = `
      <div class="pieces">
        <div draggable="true" data-id="1">function hack() {</div>
        <div draggable="true" data-id="2">console.log('Взлом!');</div>
        <div draggable="true" data-id="3">}</div>
      </div>
      <div id="drop-zone" class="drop-zone"></div>
    `;

    const pieces = document.querySelectorAll(".pieces > div");
    const dropZone = document.getElementById("drop-zone");
    let order = [];

    pieces.forEach((piece) => {
      piece.addEventListener("dragstart", (e) =>
        e.dataTransfer.setData("text", piece.dataset.id),
      );
    });

    dropZone.addEventListener("dragover", (e) => e.preventDefault());
    dropZone.addEventListener("drop", (e) => {
      const id = e.dataTransfer.getData("text");
      const piece = document.querySelector(`[data-id="${id}"]`);
      dropZone.appendChild(piece);
      order.push(id);
      if (order.length === 3) {
        if (order.join("") === "123") {
          energy += 1;
          showScene(nextWin);
        } else {
          showScene(nextLose); // Экран поражения
        }
      }
    });
  } else if (type === "simon") {
    textEl.innerHTML =
      "Игра 'Повтори последовательность':<br>Я покажу 4 цвета по порядку. Запомни и повтори кликами!<br><div id='status' style='color: #ffaa00;'>Готов? Нажми 'Начать'</div>";
    choicesEl.innerHTML = `
      <button id="start-simon">🚀 Начать игру</button>
      <div id="simon-buttons" style="display: none;">
        <button class="btn red" data-color="0">Красный</button>
        <button class="btn green" data-color="1">Зелёный</button>
        <button class="btn blue" data-color="2">Синий</button>
      </div>
    `;

    const startBtn = document.getElementById("start-simon");
    const simonDiv = document.getElementById("simon-buttons");
    const statusEl = document.getElementById("status");

    startBtn.onclick = () => {
      startBtn.style.display = "none";
      simonDiv.style.display = "block";
      statusEl.textContent = "Смотри внимательно...";
      statusEl.style.color = "#ffaa00";

      const buttons = document.querySelectorAll(".btn");
      const sequence = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 3),
      );
      let userSequence = [];
      let step = 0;
      let isShowing = true;

      function showSequence() {
        statusEl.textContent = `Шаг ${step + 1}/4`;
        const color = sequence[step];
        buttons[color].classList.add("glow");
        setTimeout(() => {
          buttons[color].classList.remove("glow");
          step++;
          if (step < sequence.length) {
            setTimeout(showSequence, 800);
          } else {
            isShowing = false;
            statusEl.textContent = "Твой черёд! Повторяй...";
            statusEl.style.color = "#00ff99";
          }
        }, 800);
      }

      setTimeout(showSequence, 500);

      buttons.forEach((btn) => {
        btn.onclick = () => {
          if (isShowing) return;

          const color = parseInt(btn.dataset.color);
          userSequence.push(color);
          btn.classList.add("glow");
          setTimeout(() => btn.classList.remove("glow"), 400);

          if (
            userSequence[userSequence.length - 1] !==
            sequence[userSequence.length - 1]
          ) {
            statusEl.textContent = "Ошибка! Поражение.";
            statusEl.style.color = "#ff4444";
            setTimeout(() => showScene(nextLose), 1500); // Экран поражения
            return;
          }

          if (userSequence.length === sequence.length) {
            statusEl.textContent = "Успех! Победа.";
            statusEl.style.color = "#44ff44";
            energy += 1;
            setTimeout(() => showScene(nextWin), 1500);
          }
        };
      });
    };
  } else if (type === "arcade") {
    textEl.innerHTML =
      "Финальная аркада: Уворачивайся от вирусов! Управление: W/A/S/D или Ф/Ы/В/А, или touch. Выживи 20 сек.";
    choicesEl.innerHTML =
      '<canvas id="arcade-canvas" width="400" height="400"></canvas> <div id="arcade-status" style="text-align: center; color: #ffaa00;">Время: 20</div>';

    const canvas = document.getElementById("arcade-canvas");
    const ctx = canvas.getContext("2d");
    const statusEl = document.getElementById("arcade-status");
    let playerX = canvas.width / 2;
    let playerY = canvas.height - 40;
    const playerSize = 30; // Увеличено
    const virusSize = 20; // Увеличено
    let viruses = [];
    let time = 20;
    let gameOver = false;
    let keys = {};

    function spawnVirus() {
      viruses.push({
        x: Math.random() * (canvas.width - virusSize * 2) + virusSize,
        y: -virusSize,
        speed: Math.random() * 2 + 2,
      }); // Быстрее, спавн в границах
    }

    const spawnInterval = setInterval(spawnVirus, 500); // Чаще спавн

    function update() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Плавное движение
      if (keys["ArrowLeft"] || keys["a"] || keys["ф"] || keys["A"] || keys["Ф"])
        playerX -= 5;
      if (
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["в"] ||
        keys["D"] ||
        keys["В"]
      )
        playerX += 5;
      if (keys["ArrowUp"] || keys["w"] || keys["ц"] || keys["W"] || keys["Ц"])
        playerY -= 5;
      if (keys["ArrowDown"] || keys["s"] || keys["ы"] || keys["S"] || keys["Ы"])
        playerY += 5;

      // Границы
      playerX = Math.max(0, Math.min(canvas.width - playerSize, playerX));
      playerY = Math.max(0, Math.min(canvas.height - playerSize, playerY));

      ctx.fillStyle = "#00ff99";
      ctx.fillRect(playerX, playerY, playerSize, playerSize);

      viruses.forEach((v) => {
        v.y += v.speed;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(v.x, v.y, virusSize, virusSize);
        if (v.y > canvas.height)
          viruses = viruses.filter((virus) => virus !== v);
        if (
          Math.abs(v.x - playerX) < playerSize / 2 + virusSize / 2 &&
          Math.abs(v.y - playerY) < playerSize / 2 + virusSize / 2
        ) {
          gameOver = true;
          statusEl.textContent = "Поражение! Вирус пойман.";
          statusEl.style.color = "#ff4444";
          setTimeout(() => showScene(nextLose), 2000);
        }
      });

      time -= 1 / 60; // Для 60fps
      statusEl.textContent = "Время: " + Math.ceil(time);
      if (time <= 0) {
        gameOver = true;
        statusEl.textContent = "Успех! Выжил.";
        statusEl.style.color = "#44ff44";
        energy += 1;
        setTimeout(() => showScene(nextWin), 2000); // Сообщение перед переходом
      }

      requestAnimationFrame(update); // Плавная анимация
    }

    update();

    // Клавиши
    document.addEventListener("keydown", (e) => (keys[e.key] = true));
    document.addEventListener("keyup", (e) => (keys[e.key] = false));

    // Touch
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      playerX =
        touch.clientX - canvas.getBoundingClientRect().left - playerSize / 2;
      playerY =
        touch.clientY - canvas.getBoundingClientRect().top - playerSize / 2;
    });
  }
}
