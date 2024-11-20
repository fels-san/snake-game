import { Snake } from "./snake.js";

const gameBoard = document.querySelector(".game-board");
const scoreElement = document.querySelector(".score");
const stopwatchElement = document.querySelector(".time");

let startBlockDirection = "up";
let lastDirection = null;
let elements = [];
let score = 0;
let timer;

for (let i = 1; i <= 12 * 13; i++) {
  const divElement = document.createElement("div");
  gameBoard.appendChild(divElement);
  elements.push(divElement);
}

class Apple {
  constructor() {
    this.index = Math.floor(Math.random() * elements.length);
    this.element = elements[this.index];
    this.element.classList.add("apple");
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snake.direction == "down") return;
      break;
    case "ArrowDown":
      if (snake.direction == "up") return;
      break;
    case "ArrowLeft":
      if (snake.direction == "right") return;
      break;
    case "ArrowRight":
      if (snake.direction == "left") return;
      break;
  }
  snake.direction =
    event.key.toString().slice(5, 6).toLowerCase() +
    event.key.toString().slice(6);
});

function moveSnake(direction) {
  let newIndex;
  switch (direction) {
    case "up":
      if (snake.direction == "down") return; // добавить проверку как-то по вопросу того, не новое ли это направление
      newIndex = snake.head.index - 12;
      if (newIndex < 0) {
        endGame();
        return;
      }
      snake.direction = "up";
      break;
    case "down":
      if (snake.direction == "up") return;
      newIndex = snake.head.index + 12;
      if (newIndex > 12 * 13 - 1) {
        endGame();
        return;
      }
      snake.direction = "down";
      break;
    case "left":
      if (snake.direction == "right") return;
      newIndex = snake.head.index - 1;
      if (newIndex < snake.head.index - (snake.head.index % 12)) {
        endGame();
        return;
      }
      snake.direction = "left";
      break;
    case "right":
      if (snake.direction == "left") return;
      newIndex = snake.head.index + 1;
      if (newIndex >= snake.head.index + (12 - (snake.head.index % 12))) {
        endGame();
        return;
      }
      snake.direction = "right";
      break;
  }

  if (snake.blockIndices.has(newIndex)) {
    endGame();
    return;
  }

  snake.prepend(elements[newIndex], newIndex);
  let deleted = snake.deleteTail();

  if (snake.head.index == apple.index) {
    apple.element.classList.remove("apple");
    apple = new Apple();

    snake.append(deleted.element, deleted.index);
    updateScore();
  }
}

function endGame() {
  clearInterval(timer);
  alert("Stop!");
}

function updateScore() {
  score++;
  scoreElement.innerText = `Score: ${score}`;
}

let seconds = 0;
let minutes = 0;
let hours = 0;

function updateTime() {
  seconds++;
  if (seconds > 59) {
    seconds = 0;
    minutes++;
  }
  if (minutes > 59) {
    minutes = 0;
    seconds = 0;
    hours++;
  }
  stopwatchElement.innerText = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const snake = new Snake();
let randomIndex = Math.floor(Math.random() * elements.length);
snake.append(elements[randomIndex], randomIndex);
snake.append(elements[randomIndex + 1], randomIndex + 1);
snake.append(elements[randomIndex + 2], randomIndex + 2);

let apple = new Apple();

startGame();

function startGame() {
  timer = setInterval(() => {
    moveSnake(snake.direction);
    updateTime();
  }, 1000);
}
