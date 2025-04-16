import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Notification } from '../_models/notification';
import { of, map, take, catchError, throwError } from 'rxjs';
import { UserNotification } from '../_models/userNotification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseUrl = environment.apiUrl;
  private notifications = signal<Notification[]>([]);  
  private notification = signal<Notification>(
    { 
      id: 0,       
      description: '', 
      dateRead: new Date(), 
      notificationSent: new Date(), 
      isDone: false      
    }
  );

  private userNotifications = signal<UserNotification[]>([]);  

  constructor(private http: HttpClient) {}

  getAvailablesNotifications() {    
    return this.http.get<Notification[]>(this.baseUrl + 'notifications/availables-notifications/').pipe(      
      catchError(error => {
        console.error('Error en la petición HTTP:', error);
        return throwError(() => new Error('Error al obtener las notificaciones'));
      })
    );
  }  

  getAssignedNotifications(username: string) {        
    return this.http.get<UserNotification[]>(this.baseUrl + 'notifications/user-notifications/' + username).pipe(
          catchError(error => {
            console.error('Error en la petición HTTP:', error);
            return throwError(() => new Error('Error al obtener las notificaciones de usuarios'));
          })
        );        
  }  
  
  getNotificationsSignal = () => this.notifications;

  getNotificationSignal() {
    return this.notification; 
  }

  getUserNotificationsSignal = () => this.userNotifications;

  updateNotifications(newNotifications: Notification[]) {
    this.notifications.set(newNotifications); 
  }

  deleteNotification(id: number, username: string) {
    return this.http.delete(this.baseUrl + 'notifications/' + id + '/' + username);
  }
  
}
