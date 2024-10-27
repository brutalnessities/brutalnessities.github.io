import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.sass'
})
export class TestComponent {
  constructor() {
    console.log('TestComponent');
  }
}
