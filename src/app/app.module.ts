import { NgModule } from '@angular/core';
import { SnakeComponent } from './routes/snake/snake.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from "./shared/header/header.component";
import { HomeComponent } from './routes/home/home.component';
import { JsonDirective } from './directives/json.directive';
import { AboutMeComponent } from './routes/about-me/about-me.component';
import { ImageDialogComponent } from './shared/image-dialog/image-dialog.component';

@NgModule({
  declarations: [
    SnakeComponent,
    AboutMeComponent,
    ConfigBuilderComponent,
    HomeComponent,
    JsonDirective,
  ],
  imports: [SharedModule, HeaderComponent, ImageDialogComponent],
  exports: [SharedModule],
})
export class AppModule {}
