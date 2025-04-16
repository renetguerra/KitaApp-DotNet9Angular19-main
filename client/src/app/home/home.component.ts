import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { NgIf } from '@angular/common';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { GalleryPhotoEditorComponent } from '../gallery-photo-editor/gallery-photo-editor.component';
import { Photo } from '../_models/photo';
import { GalleryService } from '../_services/gallery.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GalleryPhotoDeleteComponent } from '../gallery-photo-delete/gallery-photo-delete.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [RegisterComponent, GalleryModule, MatButtonModule, MatDialogModule, MatIconModule]
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  private accountService = inject(AccountService);
  user = signal<User>(this.accountService.currentUser()!);

  galleryImages: GalleryItem[] = [];
  private galleryService = inject(GalleryService);
  galleryPhotos = signal<Photo[]>([]);

  readonly dialog = inject(MatDialog);

  constructor() {}

  ngOnInit(): void {
    this.loadGalleryPhotos();
  }

  registerToggle() {
    this.registerMode = !this.registerMode
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
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

  openDialogAddPhoto() {
    const dialogRef = this.dialog.open(GalleryPhotoEditorComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.loadGalleryPhotos();
    });
  }

  openDialogDeletePhoto() {
    const dialogRef = this.dialog.open(GalleryPhotoDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.loadGalleryPhotos();
    });
  }

}
