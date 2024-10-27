import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    RouterOutlet,
    MatButtonModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    RouterOutlet,
    MatButtonModule,
  ]
})
export class AppModule {}
