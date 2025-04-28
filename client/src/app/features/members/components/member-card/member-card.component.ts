import { Component, inject, input } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { Member } from 'src/app/core/_models/member';
import { PresenceService } from 'src/app/core/_services/presence.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationStore } from 'src/app/core/_stores/notification.store';
import { NotificationsModalComponent } from 'src/app/features/modals/notifications-modal/notifications-modal.component';

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
