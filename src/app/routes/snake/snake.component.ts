import { Component, OnInit, viewChild, ViewChild, ViewContainerRef } from '@angular/core';

// const snake = document.getElementById("snake");
// let food;
let resetButton = true;
let tailSegments: any = [];
// let this.score;

// const gameArea = document.querySelector(".game-area");
// const areaHeight = gameArea.clientHeight - snakeOffset;
// const areaWidth = gameArea.clientWidth - snakeOffset;
let alive = false;

type Direction = [boolean, boolean, boolean, boolean]

const STOPPED: Direction = [false,false,false,false];
const UP: Direction = [true,false,false,false];
const DOWN: Direction = [false,true,false,false];
const LEFT: Direction = [false,false,true,false];
const RIGHT: Direction = [false,false,false,true];

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.sass'
})
export class SnakeComponent implements OnInit {
  @ViewChild('game_area', {read: ViewContainerRef}) gameAreaRef: any;
  @ViewChild('snake', {read: ViewContainerRef}) snakeRef: any;
  @ViewChild('food', {read: ViewContainerRef}) foodRef: any;

  DIRECTION: Direction = STOPPED;
  
  score: any;
  foodAte = 0;
  factor = 5; //rate at which points are accrued 
  snakeSpeed = 15; //px
  interval = 100; //smaller = faster
  intervalId: any;
  snakeOffset: number = 0;
  areaHeight: number = 0;
  areaWidth: number = 0;
  snakeX: number = 0;
  snakeY: number = 0;
  
  constructor() {
    // this.snakeRef = document.getElementById("snake");
    // this.score = document.getElementById("score");
    // if (this.score) {
    //   this.score.innerHTML = `score: ${this.foodAte}`;
    // }
    // this.snakeOffset = Math.floor(this.snakeRef?.clientHeight / 2 ?? 0);
    // this.gameAreaRef = document.querySelector(".game-area");
    // this.areaHeight = this.gameAreaRef.clientHeight - this.snakeOffset;
    // this.areaWidth = this.gameAreaRef.clientWidth - this.snakeOffset;
    // this.snakeX = this.areaWidth / 2;
    // this.snakeY = this.areaHeight / 2;
    // console.log(this)
    
  }

  ngOnInit(): void {

    //controller
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (this.DIRECTION !== DOWN) {
            this.DIRECTION = UP
          }
          break;
        case "ArrowDown":
          if (this.DIRECTION !== UP) {
            this.DIRECTION = DOWN
          }
          break;
        case "ArrowLeft":
          if (this.DIRECTION !== RIGHT) {
            this.DIRECTION = LEFT
          }
          break;
        case "ArrowRight":
          if (this.DIRECTION !== LEFT) {
            this.DIRECTION = RIGHT
          }
          break;
        case "Escape":
          this.endGame();
      };
    });
  }

  getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  moveFood() {
    const padding = 4
    const x = Math.floor(this.getRandomNumberInRange(this.snakeOffset + padding, this.areaWidth - padding));
    const y = Math.floor(this.getRandomNumberInRange(this.snakeOffset + padding, this.areaHeight - padding));
    this.foodRef.style.top = y + "px";
    this.foodRef.style.left = x + "px";
  }

  foundFood() {
    this.moveFood();
    this.foodAte++;
    this.score.innerHTML = `score: ${this.foodAte}`;
    this.snakeSpeed += Math.floor(this.foodAte / this.factor);
    if (Math.floor(this.foodAte / this.factor) > 0) {
      this.factor *= 2;
    }
  }

  didSnakeFindFood() {
    const snakeHitBox = this.snakeRef.getBoundingClientRect();
    const foodHitBox = this.foodRef.getBoundingClientRect();
  
    if (!(
      snakeHitBox.right < foodHitBox.left ||
      snakeHitBox.left > foodHitBox.right ||
      snakeHitBox.bottom < foodHitBox.top ||
      snakeHitBox.top > foodHitBox.bottom
    )) {
      this.foundFood();
      this.addTail();
    };
  }

  resetSnake() {
    this.snakeRef.style.top = "50%";
    this.snakeRef.style.left = "50%";
    this.snakeX = this.areaWidth / 2;
    this.snakeY = this.areaHeight / 2;
    this.DIRECTION = STOPPED;
    tailSegments = [];
    const tailElements = document.querySelectorAll(".snakeTail");
    tailElements.forEach((element) => {
      element.remove();
    });
  }

  clickReset() {
    resetButton = false
    alive = true;
    this.foodAte = 0;
    this.score.innerHTML = `this.score: ${this.foodAte}`;
    this.spawnFood();
    this.resetSnake();
  }

  endGame() {
    if (alive) {
      alive = false;
      this.closeIntervals();
      resetButton = true
      this.foodRef.remove();
    }
  }

  checkIfDead() {
    if (
      this.snakeY <= this.snakeOffset || 
      this.snakeY >= this.areaHeight || 
      this.snakeX <= this.snakeOffset || 
      this.snakeX >= this.areaWidth
    ) {
      this.endGame();
    };
  }

  checkIfBit(tailSegment: any) {
    const snakeHitBox = this.snakeRef.getBoundingClientRect();
    const tailSegmentHitBox = tailSegment.getBoundingClientRect();
    const padding = 0;
    if (!(
      snakeHitBox.right < tailSegmentHitBox.left + padding ||
      snakeHitBox.left > tailSegmentHitBox.right - padding ||
      snakeHitBox.bottom < tailSegmentHitBox.top + padding ||
      snakeHitBox.top > tailSegmentHitBox.bottom - padding
    )) {
      tailSegment.style.backgroundColor = "red";
      this.endGame();
    }
  }

  updatePosition() {
    this.intervalId = setInterval(() => {
      if (alive) {
        if (this.DIRECTION = UP) {
          this.snakeY = Math.max(this.snakeOffset, this.snakeRef.offsetTop - this.snakeSpeed);
          this.snakeRef.style.top = this.snakeY + "px";
        }

        if (this.DIRECTION = DOWN) {
          this.snakeY = Math.min(this.areaHeight, this.snakeRef.offsetTop + this.snakeSpeed);
          this.snakeRef.style.top = this.snakeY + "px";
        }

        if (this.DIRECTION = LEFT) {
          this.snakeX = Math.max(this.snakeOffset, this.snakeRef.offsetLeft - this.snakeSpeed);
          this.snakeRef.style.left = this.snakeX  + "px";
        }

        if (this.DIRECTION = RIGHT) {
          this.snakeX = Math.min(this.areaWidth, this.snakeRef.offsetLeft + this.snakeSpeed);
          this.snakeRef.style.left = this.snakeX + "px";
        }
        
        for (let i = tailSegments.length - 1; i >= 0; i--) {
          if (i === 0) {
            tailSegments[i].style.top = this.snakeY - this.snakeOffset + "px";
            tailSegments[i].style.left = this.snakeX - this.snakeOffset + "px";
          } else {
            tailSegments[i].style.top = tailSegments[i - 1].style.top;
            tailSegments[i].style.left = tailSegments[i - 1].style.left;
          }
          if (i >= 3) {
            this.checkIfBit(tailSegments[i]);
          }
        }
        
        
        this.checkIfDead();
        this.didSnakeFindFood();
      }
    }, this.interval);
  }

  spawnFood() {
    this.foodRef = document.createElement("div");
    this.foodRef.classList.add("food");
    this.foodRef.textContent = "✦";
    this.gameAreaRef.appendChild(this.foodRef);
    this.moveFood();
  }
  
  addTail() {
    const newTail = document.createElement("div");
    newTail.classList.add("snakeTail");
    newTail.style.top = this.snakeY - this.snakeOffset + "px";
    newTail.style.left = this.snakeX - this.snakeOffset + "px";
    tailSegments.push(newTail);
    this.gameAreaRef.appendChild(newTail);
  }

  closeIntervals() {
    clearInterval(this.intervalId);
  }
}



