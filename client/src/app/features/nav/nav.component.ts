import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AccountService } from 'src/app/core/_services/account.service';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { NotificationStore } from 'src/app/core/_stores/notification.store';
import { HasRoleDirective } from 'src/app/shared/_directives/has-role.directive';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    imports: [RouterLink, RouterLinkActive, HasRoleDirective, BsDropdownModule, CollapseModule, FormsModule, 
      MatBadgeModule, MatButtonModule, MatIconModule
    ]
})
export class NavComponent implements OnInit {
  model: any = {}

  isCollapsed = true;

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private _bottomSheet = inject(MatBottomSheet);
  private accountService = inject(AccountService);  
  private notificationService = inject(NotificationService);  

  private notificationStore = inject(NotificationStore);

  user = this.notificationStore.user;

  assignedNotifications = this.notificationStore.assignedNotifications;
  assignedNotificationsCount = this.notificationStore.assignedNotificationsCount;

  constructor() { }

  ngOnInit(): void {
    if (this.user()) 
      this.notificationStore.loadAssignedNotifications();
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {                
        this.notificationStore.loadAssignedNotifications();
        this.router.navigateByUrl('/members/' + this.model.username);
        this.model = {}
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');    
    this.notificationStore.clear();
  }  

  toggleBadgeVisibility() {          
    this.notificationStore.openNotificationSheet();
  }

}
