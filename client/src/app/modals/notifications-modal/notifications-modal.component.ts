import { Component, computed, inject, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { Notification } from 'src/app/_models/notification';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { UserNotification } from 'src/app/_models/userNotification';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
    selector: 'app-notifications-modal',
    templateUrl: './notifications-modal.component.html',
    styleUrls: ['./notifications-modal.component.css'],
    imports: [FormsModule]
})
export class NotificationsModalComponent {
  username = '';
  availableNotifications: Notification[] = [];
  selectedNotifications: Notification[] = [];

  private adminService = inject(AdminService);

  private accountService = inject(AccountService);
  user = signal<User>(this.accountService.currentUser()!);

  checkedNotification = signal<{ [notificationId: number]: boolean }>({});

  assignedNotifications = signal<UserNotification[]>([]);
  private notificationService = inject(NotificationService);    

  constructor(public bsModalRef: BsModalRef) {     
  }

  ngOnInit(): void {
    if (this.user()) 
      this.getAssignedNotifications();
  }

 getAssignedNotifications() {    
    this.notificationService.getAssignedNotifications(this.username).subscribe({
      next: notifications => {
        this.assignedNotifications.set(notifications);

        const assignedIds = new Set(notifications.map(n => n.notification.id));

        const combinedNotifications = this.availableNotifications.map(n => ({
          ...n,
          isAssigned: assignedIds.has(n.id)
        }));

        this.availableNotifications = combinedNotifications;

        const selectedNotifications: { [id: number]: boolean } = {};
        notifications.forEach(notification => {
          selectedNotifications[notification.notification.id] = true;
        });
        this.checkedNotification.set(selectedNotifications);
      }
    })
  }


  updateChecked(selectedNotification: Notification) {    
    const currentState = this.checkedNotification()[selectedNotification.id];
    this.checkedNotification.update(state => ({
      ...state,
      [selectedNotification.id]: !currentState
    }));

    if (!currentState) {
      this.selectedNotifications.push(selectedNotification);
    }
    else {      
      this.selectedNotifications = this.selectedNotifications.filter(n => n.id !== selectedNotification.id);
    }
  }

  createNotifications() {              
    this.adminService.createUserNotifications(this.username, this.selectedNotifications).subscribe();
    this.cancel();
  }

  deleteNotification(id: number, username: string) {
    this.notificationService.deleteNotification(id, username).subscribe({
      next: () => {              
        this.getAssignedNotifications();
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }

}
