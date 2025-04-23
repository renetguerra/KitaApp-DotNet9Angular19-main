import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';
import { NgClass, NgStyle, DecimalPipe } from '@angular/common';
import { Photo } from 'src/app/_models/photo';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { GalleryService } from '../_services/gallery.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-gallery-photo-editor',
    templateUrl: './gallery-photo-editor.component.html',
    styleUrls: ['./gallery-photo-editor.component.css'],
    imports: [NgClass, FileUploadModule, NgStyle, DecimalPipe, GalleryModule, MatDialogModule, MatButtonModule]
})
export class GalleryPhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);    
  galleryPhotos = signal<Photo[]>([]);
  uploader = signal<FileUploader | undefined>(undefined);

  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user = signal<User>(this.accountService.currentUser()!);

  readonly dialogRef = inject(MatDialogRef<GalleryPhotoEditorComponent>);
  readonly data = inject<Photo>(MAT_DIALOG_DATA);

  constructor(private memberService: MembersService) {    
  }

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
      if (response) {
        const photo = JSON.parse(response);
        this.galleryPhotos.set([...this.galleryPhotos(), photo]);        
        this.dialogRef.close();
      }
    }
  }
}