class SnakeBlock {
  constructor(element, index, next = null, previous = null) {
    this.element = element;
    this.element.classList.add("snake-block");
    this.index = index;

    this.next = next;
    this.previous = previous;
  }
}

export class Snake {
  constructor() {
    this.head = null;
    this.tail = null;
    this.direction = "left";
    this.lastDirection = null;
    this.blockIndices = new Set();
  }

  prepend(element, index) {
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

  append(element, index) {
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

  deleteTail() {
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

  deleteHead() {
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

  delete() {
    while (this.head) {
      this.deleteTail();
    }
    return this;
  }
}
