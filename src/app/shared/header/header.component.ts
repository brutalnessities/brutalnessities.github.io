import { Component, OnInit, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from '../../../services/utility.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent implements OnInit {
  open: boolean = true;

  routes = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Test',
      path: '/test',
    },
    {
      label: 'Snake game',
      path: '/snake',
    },
    {
      label: 'Config-builder',
      path: '/config-builder',
    },
  ];

  isSticky = false;
  _headerHeight = 135;

  constructor(private utility: UtilityService) {}

  ngOnInit() {
    this.utility.headerOpen$.subscribe((value) => {
      this.open = value;
    });
  }

  get headerHeight() {
    return `${this._headerHeight}px`;
  }

  toggleOpen() {
    this.utility.headerOpen = !this.open;
  }

  contactMe() {
    window.open('mailto:colton.torgrimson@gmail.com');
  }

}

/**
 * @Idea
 * nest all of the buttons into the visibility button. When click it exands radially with options
 * 
 *  ___________
 * |           |
 * |    o - O  |
 * |      / |  |
 * |     o  o  |
 * |           |
 */