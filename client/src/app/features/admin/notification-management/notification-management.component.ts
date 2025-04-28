import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableColumn } from 'src/app/core/_models/generic';
import { NotificationService } from 'src/app/core/_services/notification.service';
import { Notification } from 'src/app/core/_models/notification';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HasRoleDirective } from 'src/app/shared/_directives/has-role.directive';
import { TabsModule } from "ngx-bootstrap/tabs";
import { Params } from 'src/app/core/_models/params';
import { AdminNotificationStore } from 'src/app/core/_stores/adminNotifications.store';
import { GenericCreateUpdateModalComponent } from '../../modals/generic-create-update-modal/generic-create-update-modal.component';
import { GenericDeleteModalComponent } from '../../modals/generic-delete-modal/generic-delete-modal.component';
import { CrudTableComponent } from '../../table/crud-table.component';


const NOTIFICATION_COLUMNS: TableColumn<Notification>[] = [
  {
    columnDef: 'description',
    header: 'Description',
    cell: (row: Notification) => row.description,
  }
];

@Component({
  selector: 'app-notification-management',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, TabsModule,
    HasRoleDirective,
    MatTableModule, MatIconModule, MatButtonModule, MatDialogModule,
    CrudTableComponent
  ],
  templateUrl: './notification-management.component.html',
  styleUrl: './notification-management.component.css'
})
export class NotificationManagementComponent {  
  
  private notificationService = inject(NotificationService);   

  readonly dialog = inject(MatDialog);
  readonly adminNotificationStore = inject(AdminNotificationStore);

  params = new Params();
  pagination = this.adminNotificationStore.pagination;
  
  columns = NOTIFICATION_COLUMNS;
  
  getDescriptionCell = (element: Notification): string => element.description;

  defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 200,
  };   
   
  dataSource = this.adminNotificationStore.notifications;  

  ngOnInit(): void {
    this.adminNotificationStore.loadNotifications();
  } 

  openDialogEditNotification(notification: Notification): void {    
    const config = {
        class: 'modal-dialog-centered modal-lg',
        data: {         
            item: { ...notification },    
            columnDefs: this.columns.filter(c => c.header !== 'Actions'),
            url: 'notifications/',
        }
    }
    const dialogRef = this.dialog.open( GenericCreateUpdateModalComponent, config );
    dialogRef.afterClosed().subscribe(result => {          
      this.dataSource();
    });    
  } 

  openDialogDeleteNotification(notification: Notification): void {    
    const config = {
        class: 'modal-dialog-centered modal-lg',
        data: {            
            item: { ...notification },    
            columnDefs: this.columns.filter(c => c.header !== 'actions'),
            url: 'notifications/',
        }
      }
      const dialogRef = this.dialog.open( GenericDeleteModalComponent, config );
      dialogRef.afterClosed().subscribe(result => {        
        this.adminNotificationStore.removeNotification(result.id);        
        this.dataSource();        
      }); 
  }   

  public refresh(notifications: Notification[]) {          
    this.dataSource();  
  }
}

