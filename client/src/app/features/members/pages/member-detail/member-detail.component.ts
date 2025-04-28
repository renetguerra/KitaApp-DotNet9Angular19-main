import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/core/_models/member';
import { MemberMessagesComponent } from '../../components/member-messages/member-messages.component';
import { MessageService } from 'src/app/core/_services/message.service';
import { PresenceService } from 'src/app/core/_services/presence.service';
import { AccountService } from 'src/app/core/_services/account.service';
import { GalleryModule } from 'ng-gallery';
import { MemberCalendarComponent } from '../../components/member-calendar/member-calendar.component';
import { MemberListComponent } from '../member-list/member-list.component';
import { HasRoleDirective } from 'src/app/shared/_directives/has-role.directive';
import { UserNotification } from 'src/app/core/_models/userNotification';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PhotoEditorComponent } from '../../components/member-photo/photo-editor/photo-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NotificationStore } from 'src/app/core/_stores/notification.store';
import { MemberStore } from 'src/app/core/_stores/member.store';
import { PhotoStore } from 'src/app/core/_stores/photo.store';
import { PhotoDeleteComponent } from '../../components/member-photo/photo-delete/photo-delete.component';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
    imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, 
        MemberMessagesComponent, MemberCalendarComponent, MemberListComponent, 
        MatDialogModule, MatIconModule, MatButtonModule,
        HasRoleDirective]
})
export class MemberDetailComponent {  
  
  memberTabs = viewChild<TabsetComponent>('memberTabs');  

  private accountService = inject(AccountService);    
  private messageService = inject(MessageService);  
  public presenceService = inject(PresenceService);  
  private _bottomSheet = inject(MatBottomSheet);
  private notificationService = inject(NotificationService); 
  readonly dialog = inject(MatDialog);

  private memberStore = inject(MemberStore);
  private notificationStore = inject(NotificationStore);  
  private photoStore = inject(PhotoStore);

  readonly user = signal(this.accountService.currentUser());  
  member = this.memberStore.member;
  members = this.memberStore.members;

  activeTab?: TabDirective;  
  
  userNameParam = signal<string>('');
    
  galleryImages = this.photoStore.galleryImages;
  familyMemberGalleryImages = this.photoStore.galleryImagesFamilyMembers;
  
  readonly calendarEvents = this.memberStore.calendarEvents;

  readonly memberByUser = this.memberStore.memberByUsername;
  
  readonly userCalendars = this.memberStore.userCalendars;

  isMessagesTabDisabled = signal(false);
  
  assignedNotifications = signal<UserNotification[]>([]);
  notifications = this.notificationStore.assignedNotifications; 
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.user.set(this.accountService.currentUser()!);
    const memberValue = this.member();
    if (memberValue) {
      this.memberStore.setMember(memberValue);
    }
  }

  ngOnInit(): void {    

    if (!this.member()! || this.member()!.id === 0) {
      this.userNameParam.set(this.route.snapshot.paramMap.get('username')!);      
      this.memberStore.memberByUsername();                              
    }

    this.route.data.subscribe({
      next: data => this.memberStore.setMember(data['member'])
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })        
  }  

  setMember(member: Member) {
    this.memberStore.setMember(member);
  }  

  selectTab(heading: string) {
    if (this.memberTabs()) {
      this.memberTabs()!.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;    
    if ((this.activeTab.heading === 'Messages' || this.activeTab.heading === 'Calendar') && this.user()) {      
      this.messageService.createHubConnection(this.user()!, this.member()!.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }   
  
  openDialogAddPhoto() {    
    this.dialog.open(PhotoEditorComponent, {
      data: this.member()
    });    
  }
  
  openDialogDeletePhoto() {        
    this.dialog.open(PhotoDeleteComponent, {
      data: this.member()
    });            
  }

}
