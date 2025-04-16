import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild, inject, input, signal, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, RouterLink, Router } from "@angular/router";
import { BsModalService, ModalModule, BsModalRef } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { HasRoleDirective } from "src/app/_directives/has-role.directive";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { GenericCreateUpdateModalComponent } from "src/app/modals/generic-create-update-modal/generic-create-update-modal.component";
import { CrudTableComponent } from "src/app/table/crud-table.component";
import { NotificationManagementComponent } from "./notification-management/notification-management.component";
import { NotificationService } from "src/app/_services/notification.service";
import { Notification } from "src/app/_models/notification";
import { MatTable } from "@angular/material/table";
import { GenericDataSource } from "src/app/_models/generic";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-admin-notification',
  standalone: true,
  templateUrl: './admin-notification.component.html',
  styleUrl: './admin-notification.component.css',
  providers: [BsModalService],
  imports: [
    CommonModule, 
    RouterModule,  
    FormsModule, 
    NgxPaginationModule, 
    TabsModule, 
    HasRoleDirective, 
    ModalModule, 
    MatButtonModule, MatDialogModule, MatIconModule,
    NotificationManagementComponent
  ]
})
export class AdminNotificationComponent implements OnInit {
  user?: User;  

  public accountService = inject(AccountService);
  private modalService = inject( BsModalService );

  readonly dialog = inject(MatDialog);

  tableMat = viewChild<MatTable<any>>('table');
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(NotificationManagementComponent) tableComponent!: NotificationManagementComponent;
  

  columns = [    
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Notification) => `${element.description}`,
    },    
  ];  

  defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 200,
  };

    dataSource = ELEMENT_DATA; //GenericItem<T>[] = []; 
    

      availableNotifications = signal<Notification[]>([]);
      private notificationService = inject(NotificationService); 

      readonly arrayGenericDataInput = input<any[]>([]);
      arrayGenericData = signal<any[]>([]);

      dataSourceToRefresh = new GenericDataSource(this.availableNotifications()); 
      
  constructor(private router: Router) {
    this.user = this.accountService.currentUser() ??
      (typeof window !== 'undefined' && localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user') || '{}') : null;
  }

  ngOnInit() {
    this.loadNotifications();    
  }

  loadNotifications() {
    this.notificationService.getAvailablesNotifications().subscribe({
      next: notifications => {
        this.availableNotifications.set(notifications);     
        this.arrayGenericData.set(this.arrayGenericDataInput());    
               
      }
    })            
  }

  openDialogAdd(): void {
      const config = {
        class: 'modal-dialog-centered modal-lg',
        data: {            
            item: { id: 0, description: '' }, // isActive: true
            columnDefs: this.columns.filter(c => c.header !== 'Actions'),
            url: 'notifications/',
        }
      }
      const dialogRef = this.dialog.open(GenericCreateUpdateModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {                    
          this.notificationService.getAvailablesNotifications().subscribe({
            next: notifications => {
              this.availableNotifications.set(notifications);                   
                     
              const current = this.availableNotifications();
              const exists = current.some(n => n.description === result.description);
              if (!exists) {                
                this.availableNotifications().push(result);
              }
              this.tableComponent?.refresh(this.availableNotifications());
            }
          })          
        }             
      });     
    }    
}
