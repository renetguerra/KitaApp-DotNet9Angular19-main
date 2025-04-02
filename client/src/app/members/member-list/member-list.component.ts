import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
    imports: [CommonModule, RouterModule, FormsModule, MemberCardComponent, NgxPaginationModule]
})
export class MemberListComponent implements OnInit {  
  members = signal<Member[]>([]);
  pagination: WritableSignal<Pagination | undefined> = signal(undefined);
  userParams: WritableSignal<UserParams | undefined> = signal(undefined);
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }]

  private memberService = inject( MembersService );

  constructor() { 
    this.userParams.set(this.memberService.getUserParams());
  }

  ngOnInit(): void {    
    this.loadMembers();    
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams()!);
      this.memberService.getMembers(this.userParams()!).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members.set(response.result);
            this.pagination.set(response.pagination);
          }
        }
      })
    }
  }

  resetFilters() {
    this.userParams.set(this.memberService.resetUserParams());
    this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams()?.pageNumber !== event.page) {
      this.memberService.setUserParams(this.userParams()!);
      this.userParams()!.pageNumber = event;
      this.loadMembers();
    }
  }
}
