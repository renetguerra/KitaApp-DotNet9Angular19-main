import { Component, OnInit, inject, signal } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from 'src/app/core/_services/account.service';
import { environment } from 'src/environments/environment';
import { NgClass, NgStyle, DecimalPipe } from '@angular/common';
import { Photo } from 'src/app/core/_models/photo';
import { GalleryModule } from 'ng-gallery';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PhotoStore } from 'src/app/core/_stores/photo.store';

@Component({
    selector: 'app-gallery-photo-editor',
    templateUrl: './gallery-photo-editor.component.html',
    styleUrls: ['./gallery-photo-editor.component.css'],
    imports: [NgClass, FileUploadModule, NgStyle, DecimalPipe, GalleryModule, MatDialogModule, MatButtonModule]
})
export class GalleryPhotoEditorComponent implements OnInit {
  
  readonly dialogRef = inject(MatDialogRef<GalleryPhotoEditorComponent>);
  readonly data = inject<Photo>(MAT_DIALOG_DATA);

  private photoStore = inject(PhotoStore);

  uploader = signal<FileUploader | undefined>(undefined);
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  uploadedPhotos: Photo[] = [];
  galleryPhotos = this.photoStore.galleryPhotos;
  
  user = this.photoStore.user;
  member = this.photoStore.member;
 
  ngOnInit(): void {    
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }  

  initializeUploader() {
    this.uploader.set(
      new FileUploader({
        url: this.baseUrl + 'gallery/add-photo',
        authToken: 'Bearer ' + this.user()?.token,
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024
      })
  );

    this.uploader()!.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }    

    this.uploader()!.onSuccessItem = (item, response, status, headers) => {
      if (!response) return;
      const photo: Photo = JSON.parse(response);
      this.uploadedPhotos.push(photo);
    };

    this.uploader()!.onCompleteAll = () => {
      this.uploadedPhotos.forEach(photo => {
        this.photoStore.addGalleryPhoto(photo);
      });
      this.dialogRef.close();
    };
  }
}