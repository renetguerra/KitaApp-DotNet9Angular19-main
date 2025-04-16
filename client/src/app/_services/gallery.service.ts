import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Notification } from '../_models/notification';
import { of, map, take, catchError, throwError } from 'rxjs';
import { UserNotification } from '../_models/userNotification';
import { Menu } from '../_models/menu';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  baseUrl = environment.apiUrl;
  private galleryPhotos = signal<Photo[]>([]);  
  
  constructor(private http: HttpClient) {}

  getGalleryPhotos() {    
    return this.http.get<Photo[]>(this.baseUrl + 'gallery/list/').pipe(
          catchError(error => {
            console.error('Error en la petición HTTP:', error);
            return throwError(() => new Error('Error al obtener las fotos de la galería'));
          })
        );
  }    
  
  getGalleryPhotosSignal = () => this.galleryPhotos;  

  addGalleryPhoto(photo: Photo) {    
      return this.http.post(`${this.baseUrl}gallery/add-photo`, photo);
  }
  
  deleteGalleryPhoto(id: number) {
    return this.http.delete(this.baseUrl + 'gallery/delete-photo/' + id);
  }
  
}
