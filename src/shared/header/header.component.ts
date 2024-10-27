import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AppModule } from '../../app/app.module';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
  imports: [AppModule]
})
export class HeaderComponent {
  routes = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Miscellaneous',
      path: '/miscellaneous'
    },
    {
      label: 'Test',
      path: '/test'
    },
    {
      label: 'Snake game',
      path: '/snake'
    },
    {
      label: 'Config-builder',
      path: '/config-builder'
    },
  ];

  isShown = true;

  //watch for page scroll and toggleIsShown after 100px
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    console.log(Math.floor(window.screenY), header.clientHeight * .75);
    if (header && window.scrollY >= header.clientHeight) {
      this.isShown = false;
      console.log('😊', this.isShown);
    } else {
      this.isShown = true
      console.log('😍', this.isShown);
    }
  }
  
  toggleIsShown() {
    console.log('toggleIsShown');
    this.isShown = !this.isShown;
  }
}

