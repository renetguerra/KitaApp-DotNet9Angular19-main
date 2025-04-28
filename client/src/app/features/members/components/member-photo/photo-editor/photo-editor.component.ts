import { Component, OnInit, inject, signal } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Member } from 'src/app/core/_models/member';
import { environment } from 'src/environments/environment';
import { NgClass, NgStyle, DecimalPipe } from '@angular/common';
import { Photo } from 'src/app/core/_models/photo';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PhotoStore } from 'src/app/core/_stores/photo.store';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css'],
    imports: [NgClass, FileUploadModule, NgStyle, DecimalPipe, MatDialogModule, MatButtonModule]
})
export class PhotoEditorComponent implements OnInit {
   
  readonly dialogRef = inject(MatDialogRef<PhotoEditorComponent>);
  readonly data = inject<Member>(MAT_DIALOG_DATA);

  private photoStore = inject(PhotoStore);

  uploader = signal<FileUploader | undefined>(undefined);
  hasBaseDropzoneOver = signal(false);
  baseUrl = environment.apiUrl;
  uploadedPhotos: Photo[] = [];
  
  user = this.photoStore.user;
  member = this.photoStore.member;

  constructor() {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }  

  initializeUploader() {
    const currentMember = this.member();
    const currentUser = this.user();

    this.uploader.set(
      new FileUploader({
        url: this.baseUrl + 'users/add-photo/' + currentMember!.username,
        authToken: 'Bearer ' + currentUser!.token,
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
        this.photoStore.addPhoto(photo);
      });
      this.dialogRef.close();
    };
  }
}