import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';
import { NgClass, NgStyle, DecimalPipe } from '@angular/common';
import { Photo } from 'src/app/_models/photo';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css'],
    imports: [NgClass, FileUploadModule, NgStyle, DecimalPipe, MatDialogModule, MatButtonModule]
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);  

  uploader = signal<FileUploader | undefined>(undefined);
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user = signal<User>(this.accountService.currentUser()!);

  readonly dialogRef = inject(MatDialogRef<PhotoEditorComponent>);
  readonly data = inject<Member>(MAT_DIALOG_DATA);
  member = input<Member | undefined>(this.data);

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }  

  initializeUploader() {
    this.uploader.set(
      new FileUploader({
        url: this.baseUrl + 'users/add-photo/' + this.member()!.username,
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
        this.member()!.userPhotos.push(photo);
        if (photo.isMain && this.user() && this.member()) {
          this.user().photoUrl = photo.url;
          this.member()!.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user());          
        }
        this.dialogRef.close();
      }
    }
  }
}