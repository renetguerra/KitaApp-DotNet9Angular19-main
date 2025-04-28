import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from 'src/app/core/_services/message.service';
import { AccountService } from 'src/app/core/_services/account.service';
import { MessageStore } from 'src/app/core/_stores/message.store';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
    imports: [CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessagesComponent{
  @ViewChild('messageForm') messageForm?: NgForm;
  
  private accountService = inject(AccountService);  
  messageService = inject(MessageService);  
  
  messageStore = inject(MessageStore);

  user = computed(() => this.accountService.currentUser());  
    
  username = input<string | null>(null);
  messageContent = this.messageStore.messageContent;
  member = this.messageStore.member;
  members = this.messageStore.members  

  sendMessage() {
    if (!this.username()) return;

    const currentUser = this.user();
    const isAdmin = currentUser?.roles.includes('Admin');
    const isSelf = this.username() === currentUser?.username; 
    
    const resetForm = () => {
      this.messageForm?.reset();
      this.messageStore.messageContent.set('');
    };

    if (isAdmin && isSelf) {            
      this.messageStore.sendMessageToAll().then(resetForm);       
    }    
    else {      
      this.messageStore.sendMessage(this.username()!, this.messageContent()).then(resetForm);
    }              
  }  

}
