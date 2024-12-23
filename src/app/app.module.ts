import { NgModule } from '@angular/core';
import { SnakeComponent } from './routes/snake/snake.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from "./shared/header/header.component";
import { HomeComponent } from './routes/home/home.component';
import { JsonDirective } from './directives/json.directive';
import { TestComponent } from './routes/test/test.component';

@NgModule({
  declarations: [
    SnakeComponent,
    TestComponent,
    ConfigBuilderComponent,
    HomeComponent,
    JsonDirective,
  ],
  imports: [SharedModule, HeaderComponent],
  exports: [SharedModule],
})
export class AppModule {}
