import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MiscellaneousComponent } from './routes/miscellaneous/miscellaneous.component';
import { SnakeComponent } from './routes/snake/snake.component';
import { ConfigBuilderComponent } from './routes/config-builder/config-builder.component';
import { TestComponent } from './routes/test/test.component';

@NgModule({
  declarations: [
    MiscellaneousComponent,
    SnakeComponent,
    TestComponent,
    ConfigBuilderComponent,
  ],
  imports: [SharedModule],
  exports: [SharedModule],
})
export class AppModule {}
