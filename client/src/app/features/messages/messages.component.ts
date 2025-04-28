import { Component, inject } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MessageService } from 'src/app/core/_services/message.service';
import { MessageStore } from 'src/app/core/_stores/message.store';
import { MessageParams } from 'src/app/core/_models/messageParams';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
    imports: [ButtonsModule, FormsModule, RouterLink, PaginationModule, TitleCasePipe, TimeagoModule]
})
export class MessagesComponent {  

  private messageService = inject(MessageService);
    
  messageStore = inject(MessageStore);

  messageParams = new MessageParams();

  messages = this.messageStore.messages;  
  
  pagination = this.messageStore.pagination;
  container = this.messageParams.container();
  
  loading = this.messageStore.loading;

  ngOnInit(): void {
    this.messageStore.loadMessages();
  }    

  pageChanged(event: any) {
    this.messageStore.pageChanged(event.page);
  }

  onChangeContainer(value: 'Unread' | 'Inbox' | 'Outbox') {
    this.messageStore.setContainer(value);
  }
}
