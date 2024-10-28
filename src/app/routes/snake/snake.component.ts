import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.sass',
})  

export class SnakeComponent implements OnInit {
  alive = false;
  resetButton = true;
  _scale = 1;
  scaleOf(num?: number): Array<number> {
    return Array(num ?? this._scale).fill(0).map((x: any, i) => i);
  }

  px(num: number){
    `${num}px`
  }

  X = 1;
  Y = 1;
  constructor() {
    const a = window.innerWidth;
    const b = window.innerHeight;
    const c = Math.sqrt(a^2 + b^2);
    this.X = Math.floor(a/c);
    this.Y = Math.floor(b/c);
  }

  ngOnInit(): void {
  }

  getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
