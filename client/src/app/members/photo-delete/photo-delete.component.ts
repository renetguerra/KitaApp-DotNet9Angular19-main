import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { NgClass } from '@angular/common';
import { Photo } from 'src/app/_models/photo';
import { GalleryModule } from 'ng-gallery';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PhotoStore } from 'src/app/_stores/photo.store';
import { MemberStore } from 'src/app/_stores/member.store';

@Component({
    selector: 'app-photo-delete',
    templateUrl: './photo-delete.component.html',
    styleUrls: ['./photo-delete.component.css'],
    imports: [NgClass, FileUploadModule, GalleryModule, MatDialogModule, MatButtonModule]
})
export class PhotoDeleteComponent implements OnInit {
  private accountService = inject(AccountService);      
  readonly dialogRef = inject(MatDialogRef<PhotoDeleteComponent>);
  readonly data = inject<Member>(MAT_DIALOG_DATA);

  readonly photoStore = inject(PhotoStore);
  readonly memberStore = inject(MemberStore);
  
  user = signal<User>(this.accountService.currentUser()!);  
  member = input<Member | undefined>(this.data);
  userPhotos = computed(() => this.photoStore.userPhotos());
  

  constructor() {
    this.memberStore.setMember(this.data);
  }

  ngOnInit(): void { }  

  setMainPhoto(photo: Photo) {
    this.photoStore.setMainPhoto(photo);
  }

  deletePhoto(photoId: number) {
    this.photoStore.deletePhoto(photoId);
  }
    
}