import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, Subject, switchMap } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [RegisterComponent, GalleryModule, MatButtonModule, MatDialogModule, MatIconModule]
})
export class HomeComponent {
  private accountService = inject(AccountService);
  private galleryService = inject(GalleryService);
  readonly dialog = inject(MatDialog);
  
  user = signal<User>(this.accountService.currentUser()!);

  private readonly refreshTrigger = new Subject<void>();
  
  readonly galleryPhotos = toSignal(
    this.refreshTrigger.pipe(
      startWith(void 0),
      switchMap(() => this.galleryService.getGalleryPhotos())
    ),
    { initialValue: [] }
  );

  readonly galleryImages = computed(() =>
    this.galleryPhotos().map(photo =>
      new ImageItem({ src: photo.url, thumb: photo.url })
    )
  );
  
  registerMode = false;      

  registerToggle() {
    this.registerMode = !this.registerMode
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }  

  openDialogAddPhoto() {
    const dialogRef = this.dialog.open(GalleryPhotoEditorComponent);

    dialogRef.afterClosed().subscribe(() => this.refreshTrigger.next());          
  }  

  openDialogDeletePhoto() {
    const dialogRef = this.dialog.open(GalleryPhotoDeleteComponent);

    dialogRef.afterClosed().subscribe(() => this.refreshTrigger.next());
  }

}
