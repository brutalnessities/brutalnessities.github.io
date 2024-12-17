import { Component } from '@angular/core';

interface WorkHistory {
  title: string;
  company: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  summary: string;
  bullets?: string[];
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.sass',
})
export class TestComponent {
  constructor() {
    console.log('TestComponent');
  }

  log(value: any) {
    console.log(value);
  }

  randColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  emailMe() {
    window.location.href = 'mailto:colton.torgrimson@gmail.com';
  }
}
