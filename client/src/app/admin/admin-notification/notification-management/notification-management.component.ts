import { Component, OnChanges, OnInit, WritableSignal, inject, input, signal } from '@angular/core';


import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { Pagination } from 'src/app/_models/pagination';
import { TableColumn } from 'src/app/_models/generic';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { Member } from 'src/app/_models/member';
import { NotificationService } from 'src/app/_services/notification.service';
import { Notification } from 'src/app/_models/notification';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { GenericDeleteModalComponent } from 'src/app/modals/generic-delete-modal/generic-delete-modal.component';
import { GenericCreateUpdateModalComponent } from 'src/app/modals/generic-create-update-modal/generic-create-update-modal.component';
import { CrudTableComponent } from 'src/app/table/crud-table.component';


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
    CommonModule, RouterModule, FormsModule, 
    MatTableModule, MatIconModule, MatButtonModule, MatDialogModule,
    CrudTableComponent
  ],
  templateUrl: './notification-management.component.html',
  styleUrl: './notification-management.component.css'
})
export class NotificationManagementComponent implements OnInit, OnChanges {  
  pagination: WritableSignal<Pagination | undefined> = signal(undefined);
  pageNumber: number = 1;
  pageSize: number = 15;

  // serviceParams: WritableSignal<ServiceParams | undefined> = signal(undefined);  

  // notification = signal<Notification>({} as Notification);

  // columns = [    
  //   {
  //     columnDef: 'description',
  //     header: 'Description',
  //     cell: (element: Notification) => `${element.description}`,
  //   },    
  // ];  

  // columns: TableColumn<Notification>[] = [
  //   {
  //     columnDef: 'description',
  //     header: 'Description',
  //     cell: this.getDescriptionCell.bind(this),
  //   },
  // ];
  columns = NOTIFICATION_COLUMNS;
  
  getDescriptionCell(element: Notification): string {
    return element.description;
  }

  defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 200,
  }; 

  availableNotifications = signal<Notification[]>([]);
  private notificationService = inject(NotificationService);   
 
  // dataSource: Notification[] = [];
  dataSource = signal<Notification[]>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'actions'];

  readonly arrayGenericDataInput = input<Notification[]>([]);
  arrayGenericData = signal<Notification[]>([]);

  readonly dialog = inject(MatDialog);

  data = input<Notification[]>([]);
  dataSourceToRefresh = new MatTableDataSource<Notification>();

  

  constructor() { }

  ngOnInit(): void {
    this.loadNotifications();
  }  

  ngOnChanges() {
    // this.dataSourceToRefresh.data = this.data(); 
  }

  loadNotifications() {
    this.notificationService.getAvailablesNotifications().subscribe({
      next: notifications => {
        this.availableNotifications.set(notifications);   
        // this.dataSource = [...notifications];   
        this.dataSource.set(notifications);   
        console.log('availableNotifications:', this.availableNotifications());              
      }
    })            
  }

  // resetFilters() {
  //   this.serviceParams.set(this.adminService.resetServiceParams());        
  //   this.loadServices();
  // }

  // pageChanged(event: any) {
  //   if (this.pageNumber !== event) {
  //     this.serviceParams().pageNumber = event;
  //     this.adminService.setServiceParams(this.serviceParams());
  //     this.loadServices();
  //   }
  // }

  openDialogEditNotification(notification: Notification): void {  
    console.log('onEdit called with item:', notification); // Agregar log
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
      this.loadNotifications();      
    });    
  }

  // onItemCreated(newItem: Notification) {
  //   const updated = [...this.availableNotifications(), newItem];
  //   this.availableNotifications.set(updated);
  // }

  // onItemCreated(newItem: Notification) {
  //   const exists = this.dataSource().some(n => n.id === newItem.id);
  //   if (exists) {
  //     const updated = this.dataSource().map(n =>
  //       n.id === newItem.id ? newItem : n
  //     );
  //     this.dataSource.set(updated);
  //   } else {
  //     const updated = [...this.dataSource(), newItem];
  //     this.dataSource.set(updated);
  //   }
  // }

  openDialogDeleteNotification(notification: Notification): void {
    console.log('onDelete called with item:', notification); // Agregar log
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
        this.loadNotifications();
        this.availableNotifications.set(this.availableNotifications().filter(n => n.id !== notification.id));
      }); 
  }   

  public refresh(notifications: Notification[]) {    
    this.availableNotifications.set(notifications);
  }
}

