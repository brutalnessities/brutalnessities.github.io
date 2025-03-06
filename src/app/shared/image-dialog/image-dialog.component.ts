import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.sass',
})
export class ImageDialogComponent {
  imageUrls = [];

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.imageUrls = this.data.imageUrls;
  }
}
