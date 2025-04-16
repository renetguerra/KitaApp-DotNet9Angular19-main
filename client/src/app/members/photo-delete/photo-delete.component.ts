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
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-photo-delete',
    templateUrl: './photo-delete.component.html',
    styleUrls: ['./photo-delete.component.css'],
    imports: [NgClass, FileUploadModule, GalleryModule, MatDialogModule, MatButtonModule]
})
export class PhotoDeleteComponent implements OnInit {
  private accountService = inject(AccountService);    
  
  uploader = signal<FileUploader | undefined>(undefined);

  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user = signal<User>(this.accountService.currentUser()!);

  // galleryImages: GalleryItem[] = [];

  readonly dialogRef = inject(MatDialogRef<PhotoDeleteComponent>);
  readonly data = inject<Member>(MAT_DIALOG_DATA);
  member = input<Member | undefined>(this.data);

  constructor(private memberService: MembersService) {    
  }

  ngOnInit(): void {    
    
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }  

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: _ => {
        if (this.user() && this.member()) {
          this.user().photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user());
          this.member()!.photoUrl = photo.url;
          this.member()!.userPhotos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          })
        }
      }
    })
  }

  deletePhoto(username: string, photoId: number) {
    this.memberService.deletePhoto(username, photoId).subscribe({
      next: _ => {
        if (this.member()) {
          this.member()!.userPhotos = this.member()!.userPhotos.filter(x => x.id !== photoId);          
        }
      }
    })
  }
    
}