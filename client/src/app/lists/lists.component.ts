import { Component, signal } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css'],
    imports: [ButtonsModule, FormsModule, MemberCardComponent, PaginationModule]
})
export class ListsComponent {  
  members = signal<Member[] | undefined>([]);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination = signal<Pagination | undefined>(undefined);

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members.set(response.result);
        this.pagination.set(response.pagination);
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
