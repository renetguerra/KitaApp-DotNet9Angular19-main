import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css'],
    imports: [MatSlideToggleModule]
})
export class UserManagementComponent implements OnInit {  
  users = signal<User[]>([]);
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]
   
  canSendMessages = signal<{ [username: string]: boolean }>({});

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => {
        this.users.set(users);        

        const messagePermissions: { [username: string]: boolean } = {};
        users.forEach(user => {
          messagePermissions[user.username] = user.canSendMessages;
        });
        this.canSendMessages.set(messagePermissions);
      }
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  private arrayEqual(arr1: any, arr2: any) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())
  }

  allowSendMessages(user: User) {    
    const currentState = this.canSendMessages()[user.username];
    this.canSendMessages.update(state => ({
      ...state,
      [user.username]: !currentState
    }));

    // this.adminService.updateCanSendMessages(user.username, !currentState).subscribe();

    this.adminService.updateCanSendMessages(user.username, !currentState).subscribe({
      next: () => {
        this.getUsersWithRoles();
      }
    })
  }
}