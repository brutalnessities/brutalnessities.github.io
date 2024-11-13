import { Component, HostListener, Output } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  @Output() open = true;
  routes = [
    {
      label: 'Home',
      path: '/',
    },
    // {
    //   label: 'Miscellaneous',
    //   path: '/miscellaneous'
    // },
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

  //watch for page scroll and toggleIsShown after 100px
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this._headerHeight = document.querySelector('header')?.clientHeight ?? 135;
    if (window.scrollY > this._headerHeight + 300) {
      // if (!this.isSticky) console.log('💦💦💦', this);
      this.isSticky = true;
    } else {
      this.isSticky = false;
      // window.scrollTo(0, 0);
    }
  }

  get headerHeight() {
    return `${this._headerHeight}px`;
  }

  toggleOpen() {
    console.log('⭕⭕⭕');
    this.open = !this.open;
    window.postMessage({ type: 'toggleHeader' });
  }
}
