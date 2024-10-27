import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppModule } from './app.module';

@Component({
  standalone: true,
  imports: [AppModule],
  selector: 'app-root',
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
