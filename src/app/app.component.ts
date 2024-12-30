import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppModule } from './app.module';
import { HeaderComponent } from "./shared/header/header.component";
import { UtilityService } from '../services/utility.service';

@Component({
  standalone: true,
  imports: [AppModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'torgs-art';

  activeRoute: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private utility: UtilityService) {}

  ngOnInit() {
    //   this.router.events.subscribe((event) => {
    //     console.log(event);
    //     // this.activeRoute.next(event.toString());
    //   });
    this.utility.setupService();
  }
}
