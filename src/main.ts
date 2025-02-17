import './style.css'
import { Snake } from "./snake";

type Direction = "up" | "down" | "left" | "right";

const gameBoard = document.querySelector(".game-board") as HTMLDivElement;
const scoreElement = document.querySelector(".score") as HTMLSpanElement;
const highScoreElement = document.querySelector(
  ".high-score"
) as HTMLSpanElement;
const stopwatchElement = document.querySelector(".time") as HTMLSpanElement;
const endScreenElement = document.querySelector(
  ".end-screen"
) as HTMLDivElement;
const restartButton = document.querySelector(
  ".restart-btn"
) as HTMLButtonElement;

const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 13;
const TOTAL_CELLS = BOARD_WIDTH * BOARD_HEIGHT;
const MOVE_INTERVAL = 200;

let elements: HTMLDivElement[] = [];
let nextDirections: Direction[] = [];
let score: number;
let timer: ReturnType<typeof setInterval>;
let stopwatch: ReturnType<typeof setInterval>;

for (let i = 1; i <= TOTAL_CELLS; i++) {
  const divElement = document.createElement("div");
  gameBoard.appendChild(divElement);
  elements.push(divElement);
}

function startGame(): void {
  score = 0;
  if (!localStorage.getItem("score")) {
    localStorage.setItem("score", "0");
  }
  highScoreElement.innerText = `High score: ${localStorage.getItem("score")}`;
  stopwatchElement.innerText = "00:00:00";

  initializeSnake();
  apple.reposition();

  timer = setInterval(() => {
    moveSnake();
  }, MOVE_INTERVAL);
  updateTime();
}

class Apple {
  element: HTMLDivElement | null = null;
  index: number = 0;

  constructor() {
    this.reposition();
  }

  reposition(): void {
    this.index = this.getRandomIndex();
    while (snake.blockIndices.has(this.index)) {
      this.index = this.getRandomIndex();
    }
    this.element?.classList.remove("apple");
    this.element = elements[this.index];
    this.element.classList.add("apple");
  }

  getRandomIndex(): number {
    return Math.floor(Math.random() * TOTAL_CELLS);
  }
}

function updateScore(): void {
  score++;
  scoreElement.innerText = `Score: ${score}`;
}

function updateTime(): void {
  let totalSeconds = 0;

  stopwatch = setInterval(() => {
    totalSeconds++;
    stopwatchElement.innerText = formatTime(totalSeconds);
  }, 1000);
}

function formatTime(seconds: number): string {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  seconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  const oppositeDirections: { [key in Direction]: Direction } = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  let newDirection = event.key.slice(5).toLowerCase() as Direction;
  if (snake.direction !== oppositeDirections[newDirection]) {
    nextDirections.push(newDirection);
  }
});

const snake = new Snake();
let apple = new Apple();

function moveSnake(): void {
  if (nextDirections.length > 0) {
    const newDirection = nextDirections.shift();
    if (newDirection) {
      snake.direction = newDirection;
    }
  }

  let newIndex;
  switch (snake.direction) {
    case "up":
      newIndex = snake.head!.index - BOARD_WIDTH;
      break;
    case "down":
      newIndex = snake.head!.index + BOARD_WIDTH;
      break;
    case "left":
      newIndex = snake.head!.index - 1;
      break;
    case "right":
      newIndex = snake.head!.index + 1;
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

  if (snake.head!.index == apple.index) {
    apple.reposition();
    snake.append(deleted!.element, deleted!.index);
    updateScore();
  }
}

function isOutOfBounds(index: number, direction: Direction) {
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
  if (score > +localStorage.getItem("score")!) {
    localStorage.setItem("score", score.toString());
  }
  highScoreElement.innerText = `High score: ${localStorage.getItem("score")}`;
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
  nextDirections = [];
  snake.delete();
  snake.direction = "left";
  apple.reposition();
  endScreenElement.classList.add("hide");
  startGame();
}

startGame();

