import { Component, signal } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
    imports: [ButtonsModule, FormsModule, RouterLink, PaginationModule, TitleCasePipe, TimeagoModule]
})
export class MessagesComponent {  
  messages = signal<Message[]>([]);  
  pagination = signal<Pagination | undefined>(undefined);
  container = "Unread";
  // container = signal<string>('Unread');
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages.set(response.result!);
        this.pagination.set(response.pagination);
        this.loading = false;
      }
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: _ => this.messages()?.splice(this.messages().findIndex(m => m.id === id), 1)
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
