import { Component, OnInit, inject } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { Photo } from 'src/app/core/_models/photo';
import { GalleryModule } from 'ng-gallery';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PhotoStore } from 'src/app/core/_stores/photo.store';

@Component({
    selector: 'app-gallery-photo-delete',
    templateUrl: './gallery-photo-delete.component.html',
    styleUrls: ['./gallery-photo-delete.component.css'],
    imports: [FileUploadModule, GalleryModule, MatDialogModule, MatButtonModule]
})
export class GalleryPhotoDeleteComponent implements OnInit {
   
  readonly dialogRef = inject(MatDialogRef<GalleryPhotoDeleteComponent>);
  readonly data = inject<Photo>(MAT_DIALOG_DATA);
  
  readonly photoStore = inject(PhotoStore);

  user = this.photoStore.user;  

  galleryPhotos = this.photoStore.galleryHomePhotos;  

  ngOnInit(): void {       
    this.photoStore.loadGalleryPhotos();
  } 

  deletePhoto(photoId: number) {    
    this.photoStore.deleteGalleryPhoto(photoId);
  }    
}