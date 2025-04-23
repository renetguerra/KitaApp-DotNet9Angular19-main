import { inject, signal, computed, Injectable, effect, DestroyRef } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/member';
import { MemberStore } from './member.store';
import { Message } from '../_models/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageStore {
  private messageService = inject(MessageService);
  private memberStore = inject(MemberStore);

  messageContent = signal('');
  member = this.memberStore.member;
  members = this.memberStore.members;
  pagination = this.memberStore.pagination;

  private _thread = signal<Message[]>([]);
  readonly thread = this._thread.asReadonly();

constructor() {
    const destroyRef = inject(DestroyRef);
    this.messageService.messageThread$
      .pipe(        
        takeUntilDestroyed(destroyRef))
      .subscribe(messages => {        
          this._thread.set(messages);        
      });
  }

  
  sendMessageToOne(username: string) {
    this.messageService.sendMessage(username, this.messageContent());    
  }

  sendMessageToAll() {    
    const messages = this.members().map((member: Member) => {        
        this.messageService.sendMessage(member.username, this.messageContent());
    });
    return Promise.all(messages);
  }

  getThread(username: string) {
    this.messageService.getMessageThread(username).subscribe({
      next: messages => this._thread.set(messages)
    });
  }

  sendMessage(username: string, content: string) {    
    return this.messageService.sendMessage(username, content);
  }
}
