import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Notification } from '../_models/notification';
import { of, map, take, catchError, throwError } from 'rxjs';
import { UserNotification } from '../_models/userNotification';
import { Menu } from '../_models/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  baseUrl = environment.apiUrl;
  private menus = signal<Menu[]>([]);  
  
  constructor(private http: HttpClient) {}

  getAvailablesMenus() {    
    return this.http.get<Menu[]>(this.baseUrl + 'menus/list/').pipe(
          catchError(error => {
            console.error('Error en la petición HTTP:', error);
            return throwError(() => new Error('Error al obtener los menus'));
          })
        );
  }    
  
  getMenusSignal = () => this.menus;  

  
  deleteMenu(id: number) {
    return this.http.delete(this.baseUrl + 'menus/' + id);
  }
  
}
