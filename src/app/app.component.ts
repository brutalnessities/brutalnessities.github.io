import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, AppModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'torgs-art';

  activeRoute: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ngOnInit() {
  //   this.router.events.subscribe((event) => {
  //     console.log(event);
  //     // this.activeRoute.next(event.toString());
  //   });
  }
}
