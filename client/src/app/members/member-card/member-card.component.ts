import { Component, inject, input, OnInit, signal, computed } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from 'src/app/_services/admin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsModalComponent } from 'src/app/modals/notifications-modal/notifications-modal.component';
import { arrayEqual } from 'src/app/_extensions/arrays';
import { NotificationService } from 'src/app/_services/notification.service';
import { Notification } from 'src/app/_models/notification';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
    imports: [CommonModule, RouterModule, RouterLink, ToastrModule]
})
export class MemberCardComponent implements OnInit {
  member = input<Member | undefined>();
  
  public presenceService = inject(PresenceService );
  private toastr = inject(ToastrService);

  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);

  bsModalRef: BsModalRef<NotificationsModalComponent> = new BsModalRef<NotificationsModalComponent>();
  availableNotifications = signal<Notification[]>([]);
  private notificationService = inject(NotificationService);  
  // availableNotifications = computed(() => this.notificationService.getNotifications());  
  // availableNotifications = computed(() => this.notificationService.getNotificationsSignal()());

  constructor() { 
    console.log('Member_Username:', this.member()?.username);
  }

  ngOnInit(): void { } 

  // getUserNotifications() {
  //   this.adminService.getUserNotifications().subscribe({
  //     next: notifications => {
  //       this.notifications.set(notifications);        

  //       const selectedNotifications: { [id: number]: boolean } = {};
  //       notifications.forEach(notification => {
  //         selectedNotifications[notification.id] = user.canSendMessages;
  //       });
  //       this.canSendMessages.set(messagePermissions);
  //     }
  //   })
  // }

  openNotificationsModal(member: Member) {
    this.notificationService.getAvailablesNotifications().subscribe({
      next: notifications => {
        this.availableNotifications.set(notifications);
        const config = {
          class: 'modal-dialog-centered',
          initialState: {
            username: member.username,
            availableNotifications: this.availableNotifications(),            
            selectedNotifications: []
          }
        }
        this.bsModalRef = this.modalService.show(NotificationsModalComponent, config);        
      }
    })            
  }

}
