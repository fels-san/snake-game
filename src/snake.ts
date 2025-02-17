type Direction = "up" | "down" | "left" | "right";

class SnakeBlock {
  element: HTMLDivElement;
  index: number;
  next: SnakeBlock | null;
  previous: SnakeBlock | null;

  constructor(
    element: HTMLDivElement,
    index: number,
    next: SnakeBlock | null = null,
    previous: SnakeBlock | null = null
  ) {
    this.element = element;
    this.element.classList.add("snake-block");
    this.index = index;

    this.next = next;
    this.previous = previous;
  }
}

export class Snake {
  head: SnakeBlock | null;
  tail: SnakeBlock | null;
  direction: Direction;
  lastDirection: Direction;
  blockIndices: Set<number>;

  constructor() {
    this.head = null;
    this.tail = null;
    this.direction = "left";
    this.lastDirection = "left";
    this.blockIndices = new Set();
  }

  prepend(element: HTMLDivElement, index: number): this {
    const newBlock = new SnakeBlock(element, index, this.head);
    if (this.head) {
      this.head.element.classList.remove("head");
      this.head.previous = newBlock;
    }
    this.head = newBlock;
    newBlock.element.classList.add("head");
    if (!this.tail) {
      this.tail = newBlock;
    }
    this.blockIndices.add(index);
    return this;
  }

  append(element: HTMLDivElement, index: number): this {
    const newBlock = new SnakeBlock(element, index);
    if (this.tail) {
      this.tail.next = newBlock;
    }
    newBlock.previous = this.tail;
    this.tail = newBlock;
    if (!this.head) {
      this.head = newBlock;
      newBlock.element.classList.add("head");
    }
    this.blockIndices.add(index);
    return this;
  }

  deleteTail(): SnakeBlock | null {
    if (!this.tail) {
      return null;
    }
    const deletedTail = this.tail;

    deletedTail.element.classList.remove("snake-block");
    if (deletedTail.element.classList.contains("head")) {
      deletedTail.element.classList.remove("head");
    }

    if (this.tail.previous) {
      this.tail = this.tail.previous;
      this.tail.next = null;
    } else {
      this.head = null;
      this.tail = null;
    }
    this.blockIndices.delete(deletedTail.index);
    return deletedTail;
  }

  deleteHead(): SnakeBlock | null {
    if (!this.head) {
      return null;
    }
    const deletedHead = this.head;

    deletedHead.element.classList.remove("snake-block");
    if (deletedHead.element.classList.contains("head")) {
      deletedHead.element.classList.remove("head");
    }

    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = null;
    } else {
      this.head = null;
      this.tail = null;
    }
    this.blockIndices.delete(deletedHead.index);
    return deletedHead;
  }

  delete(): this {
    while (this.head) {
      this.deleteTail();
    }
    return this;
  }
}
