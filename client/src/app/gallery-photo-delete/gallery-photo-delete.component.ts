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
    selector: 'app-gallery-photo-delete',
    templateUrl: './gallery-photo-delete.component.html',
    styleUrls: ['./gallery-photo-delete.component.css'],
    imports: [FileUploadModule, GalleryModule, MatDialogModule, MatButtonModule]
})
export class GalleryPhotoDeleteComponent implements OnInit {
  private accountService = inject(AccountService);    
  galleryPhotos = signal<Photo[]>([]);
  uploader = signal<FileUploader | undefined>(undefined);

  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user = signal<User>(this.accountService.currentUser()!);

  galleryImages: GalleryItem[] = [];
  private galleryService = inject(GalleryService);

  readonly dialogRef = inject(MatDialogRef<GalleryPhotoDeleteComponent>);
  readonly data = inject<Photo>(MAT_DIALOG_DATA);

  constructor(private memberService: MembersService) {    
  }

  ngOnInit(): void {    
    this.loadGalleryPhotos();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }  

  deletePhoto(photoId: number) {
    this.galleryService.deleteGalleryPhoto(photoId).subscribe({
      next: _ => {        
          this.galleryPhotos.set(this.galleryPhotos()!.filter(x => x.id !== photoId));        
      }
    })
  }
  
  loadGalleryPhotos() {
    this.galleryService.getGalleryPhotos().subscribe({
      next: (photos) => {
        this.galleryPhotos.set(photos);        
        this.updateGalleryImages();
      },
      error: error => {
        console.error('Error loading gallery photos:', error);
      }
    });     
  }
  
  updateGalleryImages() {
    this.galleryImages = this.galleryPhotos().map(photo => 
      new ImageItem({ src: photo.url, thumb: photo.url })
    );
  }
}