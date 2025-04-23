import { Component, inject, input } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { PresenceService } from 'src/app/_services/presence.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsModalComponent } from 'src/app/modals/notifications-modal/notifications-modal.component';
import { NotificationStore } from 'src/app/_stores/notification.store';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
    imports: [CommonModule, RouterModule, RouterLink, ToastrModule]
})
export class MemberCardComponent {
  public presenceService = inject(PresenceService );
    
  private notificationStore = inject(NotificationStore);   
  
  member = input<Member | undefined>(); 

  bsModalRef: BsModalRef<NotificationsModalComponent> = new BsModalRef<NotificationsModalComponent>();  

  openNotificationsModal() {
    if (this.member()) {
      this.notificationStore.openNotificationsModal(this.member()!);
    }      
  }

}
