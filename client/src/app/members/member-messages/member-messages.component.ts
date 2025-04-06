import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, Input, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from 'src/app/_services/message.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AccountService } from 'src/app/_services/account.service';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';
import { User } from 'src/app/_models/user';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
    imports: [CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
    
  username = input<string | null>(null);
  messageContent = '';

  private accountService = inject(AccountService);  
  user = computed(() => this.accountService.currentUser());  
  student = signal<Member | null>(null);

  members = signal<Member[]>([]);
  pagination: WritableSignal<Pagination | undefined> = signal(undefined);
  userParams: WritableSignal<UserParams | undefined> = signal(undefined);

  private memberService = inject( MembersService );
  
  constructor(public messageService: MessageService) { }

  ngOnInit(): void {    
    this.memberService.getMember(this.username()!).subscribe({
      next: member => {
        this.student.set(member);    
        console.log('Student:', this.student());

      }
    });    
  }

  sendMessage() {
    if (!this.username()) return;
    if (this.user()?.roles.includes('Admin') && this.username() === this.user()?.username) {            
      this.memberService.getMembersWithoutCacheAndPagination().subscribe({
        next: response => {
          if (response) {
            this.members.set(response); 
            this.members().forEach(member => {
              if (member) {          
                this.messageService.sendMessage(member.username, this.messageContent).then(() => {
                  this.messageForm?.reset();
                })
              }
            });            
          }
        }
      })         
    }    
    else {
      this.messageService.sendMessage(this.username()!, this.messageContent).then(() => {
        this.messageForm?.reset();
      });
    }              
  }  

}
