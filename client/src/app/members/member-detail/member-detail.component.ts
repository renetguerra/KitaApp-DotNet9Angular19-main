import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';
import { MembersService } from 'src/app/_services/members.service';
import { ToastrService } from 'ngx-toastr';
import { calculateAge } from 'src/app/_extensions/date-time';
import { Photo } from 'src/app/_models/photo';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { MemberCalendarComponent } from '../member-calendar/member-calendar.component';
import { UserCalendar } from 'src/app/_models/userCalendar';
import { CalendarService } from 'src/app/_services/calendar.service';
import { Calendar } from 'src/app/_models/calendar';
import { MemberListComponent } from '../member-list/member-list.component';
import { HasRoleDirective } from 'src/app/_directives/has-role.directive';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
    imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent, MemberCalendarComponent, MemberListComponent, HasRoleDirective]
})
export class MemberDetailComponent implements OnInit, OnDestroy {  
  // @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  memberTabs = viewChild<TabsetComponent>('memberTabs');  
  member = signal<Member>({} as Member);
  activeTab?: TabDirective;
  messages = signal<Message[]>([]);
  user = signal<User | null>(null);
  userName? = signal<string>;

  userNameParam = signal<string>('');
    
  galleryImages: GalleryItem[] = [];
  familyMemberGalleryImages: GalleryItem[] = [];

  userCalendars = signal<UserCalendar[]>([]);
  calendarEvents = signal<Calendar[]>([]);  

  isMessagesTabDisabled = false;

  private accountService = inject(AccountService);  
  private memberService = inject(MembersService);
  private messageService = inject(MessageService);
  private calendarService = inject(CalendarService);
  public presenceService = inject(PresenceService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.user.set(this.accountService.currentUser()!);
  }

  ngOnInit(): void {
    this.calendarService.getEvents();
    this.loadUserCalendars();

    if (this.member() === null || this.member() === undefined || this.member().id === 0 || this.member().id === undefined || this.member().id === null) {
      this.userNameParam.set(this.route.snapshot.paramMap.get('username')!);
      this.getMemberByParam(this.userNameParam());                              
    }

    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })    

  }

  async getMemberByParam(userNameParam: string) {
    await this.memberService.getMember(userNameParam).subscribe({    
      next: (response) => {
        if (response) {          
          this.setMember(response);            
          this.getImages();
          this.getFamilyMembersImages();
        }
      }
    });
  }

  setMember(member: any) {
    this.member.set({  
        id: member.id,        
        username: member.username,
        age: member.age, 
        photoUrl: member.userPhotos?.find((x: Photo) => x.isMain)?.url,
        knownAs: member.knownAs,
        created: member.created,
        lastActive: member.lastActive,
        gender: member.gender,
        introduction: member.introduction,  
        interests: member.interests,
        addresses: member.addresses,
        city: member.city,             
        country: member.country,        
        userPhotos: member.userPhotos,
        familyMembers: member.familyMembers,
        userCalendars: member.userCalendars
    });   
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  loadMessages() {
    if (this.member())
      this.messageService.getMessageThread(this.member().username).subscribe({
        next: messages => this.messages.set(messages)
      })
  }

  selectTab(heading: string) {
    if (this.memberTabs()) {
      this.memberTabs()!.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if ((this.activeTab.heading === 'Messages' || this.activeTab.heading === 'Calendar') && this.user()?.roles.includes('Admin') && this.user()?.username === this.member().username) {      
      this.activeTab.disabled = true;
      this.activeTab.active = false;
      this.activeTab.customClass = 'inactive-tab';
      this.isMessagesTabDisabled = true; 
                       
      this.router.navigate(['members', this.member().username], {
        queryParams: { tab: 'Students' },
      }).then(() => {        
        this.selectTab('Students');
      });      

      this.cdr.detectChanges();      
    }
    else if ((this.activeTab.heading === 'Messages' || this.activeTab.heading === 'Calendar') && this.user()) {
      this.messageService.createHubConnection(this.user()!, this.member().username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  getImages() {
    if (!this.member()) return;
    for (const photo of this.member()?.userPhotos) {
      this.galleryImages.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }

  getFamilyMembersImages() {
    if (!this.member() || !this.member().familyMembers) return [];
       
    const familyMemberPhotos = this.member()?.familyMembers
      .map(fm => fm.familyMemberPhotos.find(p => p.isMain));
      
    for (const photo of familyMemberPhotos) {
      this.familyMemberGalleryImages.push(new ImageItem({ src: photo?.url, thumb: photo?.url }));
    }    
    return this.familyMemberGalleryImages;
  }  

  loadUserCalendars() {
    const events = this.calendarService.getCalendarEventsSignal()();
    const userName = this.accountService.currentUser()?.username;
    var user = this.memberService.getMember(userName!).subscribe({
      next: (user) => { 
        if (events.length > 0 && user) {
          this.userCalendars.set(events.map(event => ({
            userId: user.id,
            calendarId: event.id,
            calendar: event
          })));        
       }
      }
    });      
  }    

}