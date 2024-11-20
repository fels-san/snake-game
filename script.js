import { Snake } from "./snake.js";

const gameBoard = document.querySelector(".game-board");
const scoreElement = document.querySelector(".score");
const stopwatchElement = document.querySelector(".time");
const endScreenElement = document.querySelector(".end-screen");
const restartButton = document.querySelector(".restart-btn");

const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 13;
const TOTAL_CELLS = BOARD_WIDTH * BOARD_HEIGHT;
const MOVE_INTERVAL = 300;

let elements = [];
let score;
let timer;
let stopwatch;

for (let i = 1; i <= TOTAL_CELLS; i++) {
  const divElement = document.createElement("div");
  gameBoard.appendChild(divElement);
  elements.push(divElement);
}

function startGame() {
  score = 0;
  stopwatchElement.innerText = "00:00:00";

  initializeSnake();
  apple.reposition();

  timer = setInterval(() => {
    moveSnake();
  }, MOVE_INTERVAL);
  updateTime();
}

class Apple {
  constructor() {
    this.reposition();
  }

  reposition() {
    this.index = this.getRandomIndex();
    while (snake.blockIndices.has(this.index)) {
      this.index = this.getRandomIndex();
    }
    this.element?.classList.remove("apple");
    this.element = elements[this.index];
    this.element.classList.add("apple");
  }

  getRandomIndex() {
    return Math.floor(Math.random() * TOTAL_CELLS);
  }
}

function updateScore() {
  score++;
  scoreElement.innerText = `Score: ${score}`;
}

function updateTime() {
  let totalSeconds = 0;

  stopwatch = setInterval(() => {
    totalSeconds++;
    stopwatchElement.innerText = formatTime(totalSeconds);
  }, 1000);
}

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  seconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

document.addEventListener("keydown", (event) => {
  const oppositeDirections = {
    ArrowUp: "down",
    ArrowDown: "up",
    ArrowLeft: "right",
    ArrowRight: "left",
  };
  if (snake.direction !== oppositeDirections[event.key]) {
    snake.direction = event.key.slice(5).toLowerCase();
  }
});

const snake = new Snake();
let apple = new Apple();

function moveSnake() {
  let newIndex;
  switch (snake.direction) {
    case "up":
      newIndex = snake.head.index - BOARD_WIDTH;
      break;
    case "down":
      newIndex = snake.head.index + BOARD_WIDTH;
      break;
    case "left":
      newIndex = snake.head.index - 1;
      break;
    case "right":
      newIndex = snake.head.index + 1;
      break;
  }

  if (
    isOutOfBounds(newIndex, snake.direction) ||
    snake.blockIndices.has(newIndex)
  ) {
    endGame();
    return;
  }

  snake.prepend(elements[newIndex], newIndex);
  let deleted = snake.deleteTail();

  if (snake.head.index == apple.index) {
    apple.reposition();
    snake.append(deleted.element, deleted.index);
    updateScore();
  }
}

function isOutOfBounds(index, direction) {
  switch (direction) {
    case "up":
      return index < 0;
    case "down":
      return index >= TOTAL_CELLS;
    case "left":
      return (index + 1) % BOARD_WIDTH === 0;
    case "right":
      return index % BOARD_WIDTH === 0;
    default:
      return false;
  }
}

function endGame() {
  clearInterval(timer);
  clearInterval(stopwatch);
  endScreenElement.classList.remove("hide");
}

function initializeSnake() {
  let startIndex = Math.floor(TOTAL_CELLS / 2) + 2;
  snake.append(elements[startIndex], startIndex);
  snake.append(elements[startIndex + 1], startIndex + 1);
  snake.append(elements[startIndex + 2], startIndex + 2);
}

restartButton.addEventListener("click", restartGame);

function restartGame() {
  snake.delete();
  snake.direction = "left";
  apple.reposition();
  endScreenElement.classList.add("hide");
  startGame();
}

startGame();
