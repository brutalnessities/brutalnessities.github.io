import { Component, Host, HostListener, OnInit } from '@angular/core';

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
    return Array(num ?? this._scale)
      .fill(0)
      .map((_x: any, i) => i);
  }

  px(num: number) {
    `${num}px`;
  }

  X = 1;
  Y = 1;
  H = 1;
  constructor() {
    this.resize();
  }

  _gridArray: Array<Array<number>> = [];
  gridArray() {
    this._gridArray = this.scaleOf(this.X).map(
      (e: any) => (e = this.scaleOf(this.Y))
    );
    return this._gridArray;
  }

  resize() {
    const a = window.innerWidth;
    const b = document.querySelector('.main')?.clientHeight ?? 135;
    const c = Math.sqrt(a ^ (2 + b) ^ 2);
    this.H = c;
    this.X = Math.floor(a / c);
    this.Y = Math.floor(b / c);
    this.gridArray();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize();
    console.log('🔁🔁🔁');
  }

  @HostListener('toggleHeader', ['$event'])
  toggleHeader() {
    this.resize();
    console.log('🤯🤯🤯');
  }

  ngOnInit(): void {}

  getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
