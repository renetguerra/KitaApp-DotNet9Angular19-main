import { Component, computed, inject } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { GalleryModule, ImageItem } from 'ng-gallery';
import { GalleryPhotoEditorComponent } from '../gallery/gallery-photo-editor/gallery-photo-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GalleryPhotoDeleteComponent } from '../gallery/gallery-photo-delete/gallery-photo-delete.component';
import { Subject } from 'rxjs';
import { PhotoStore } from 'src/app/core/_stores/photo.store';
import { GalleryService } from 'src/app/core/_services/gallery.service';
import { AccountService } from 'src/app/core/_services/account.service';

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

  readonly photoStore = inject(PhotoStore);
  
  user = this.photoStore.user;

  readonly galleryPhotos = this.photoStore.galleryHomePhotos; 

  private readonly refreshTrigger = new Subject<void>();    

  readonly galleryImages = computed(() =>
    this.galleryPhotos().map(photo =>
      new ImageItem({ src: photo.url, thumb: photo.url })
    )
  );
  
  registerMode = false;      

  ngOnInit(): void {       
    this.photoStore.loadGalleryPhotos();
  }

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
