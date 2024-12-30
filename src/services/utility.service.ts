import { BehaviorSubject } from 'rxjs';
import Hammer from 'hammerjs';
import { Injectable } from '@angular/core';

enum Direction {
  Up = 1,
  Right = 2,
  Down = 3,
  Left = 4,
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  headerOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  set headerOpen(value: boolean) {
    this.headerOpen$.next(value);
    window.localStorage.setItem('headerOpen', JSON.stringify(value));
  }

  get headerOpen() {
    return this.headerOpen$.value;
  }

  setupService() {
    // get the headerOpen from local storage
    const headerOpen = window.localStorage.getItem('headerOpen');
    this.headerOpen$.next(headerOpen ? JSON.parse(headerOpen) : true);

    // listen for pan gestures
    const hammertime = new Hammer(document.body);
    hammertime.on('pan', (event) => {
      if (event.direction === Direction.Left) {
        this.headerOpen = true;
      } else if (event.direction === Direction.Right) {
        this.headerOpen = false;
      }
    });
  }
}
