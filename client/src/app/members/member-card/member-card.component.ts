import { Component, inject, input, OnInit } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
    imports: [CommonModule, RouterModule, RouterLink, ToastrModule]
})
export class MemberCardComponent implements OnInit {
  member = input<Member | undefined>();
  
  public presenceService = inject( PresenceService );
  private toastr = inject(ToastrService);

  constructor() { 
    console.log('Member_Username:', this.member()?.username);
  }

  ngOnInit(): void {
    console.log('Member_Username:', this.member()?.username);
  } 

}
