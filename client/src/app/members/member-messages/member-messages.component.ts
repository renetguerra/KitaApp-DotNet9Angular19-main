import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from 'src/app/_services/message.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
    imports: [CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  // @Input() username?: string;
  username = input<string | null>(null);
  messageContent = '';

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (!this.username()) return;
    this.messageService.sendMessage(this.username()!, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
  }

}
