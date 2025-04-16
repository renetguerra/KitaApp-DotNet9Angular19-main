import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HasRoleDirective } from '../_directives/has-role.directive';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { NotificationService } from '../_services/notification.service';
import { UserNotification } from '../_models/userNotification';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NotificationSheetComponent } from '../sheet/notification-sheet/notification-sheet.component';

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
  private accountService = inject(AccountService);  
  user = computed(() => this.accountService.currentUser());

  private notificationService = inject(NotificationService);  

  assignedNotifications = signal<UserNotification[]>([]);
  // assignedNotifications = computed(() => this.notificationService.getAssignedNotifications(this.user()?.username!));
  assignedNotificationsCount = signal<number>(0); // = computed(() => this.assignedNotifications.length);
  private _bottomSheet = inject(MatBottomSheet);

  constructor() { }

  ngOnInit(): void {
    if (this.user()) 
      this.getAssignedNotifications();
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {                
        this.router.navigateByUrl('/members/' + this.model.username);
        this.model = {}
        this.getAssignedNotifications();
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  getAssignedNotifications() {        
    this.notificationService.getAssignedNotifications(this.user()?.username!).subscribe({
      next: notifications => {
        if (notifications.length > 0) {
          this.assignedNotifications.set(notifications);
          this.assignedNotificationsCount.set(notifications.length);                  
        }        
      }
    })
  }

  toggleBadgeVisibility() {
    const config = {            
      disableClose: true,
      data: {
        username: this.user()?.username!,
        assignedNotifications: this.assignedNotifications()              
      }
    }
    this._bottomSheet.open(NotificationSheetComponent, config);
  }

}
