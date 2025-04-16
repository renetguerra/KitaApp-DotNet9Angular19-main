import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Menu } from '../_models/menu';
import { MenuService } from '../_services/menu.service';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenericCreateUpdateModalComponent } from '../modals/generic-create-update-modal/generic-create-update-modal.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [MatCardModule, MatButtonModule, CdkAccordionModule, MatIconModule, MatDividerModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
    
  private accountService = inject(AccountService);
  user = signal<User>(this.accountService.currentUser()!);
  
  availablesMenus = signal<Menu[]>([]);

  weekDays = [
    { name: 'Monday', label: 'MON', value: 1 },
    { name: 'Tuesday', label: 'TUE', value: 2 },
    { name: 'Wednesday', label: 'WED', value: 3 },
    { name: 'Thursday', label: 'THU', value: 4 },
    { name: 'Friday', label: 'FRI', value: 5 }
  ];

  private menuService = inject(MenuService);

  readonly dialog = inject(MatDialog);

  columns = [    
      {
        columnDef: 'title',
        header: 'Title',
        cell: (element: Menu) => `${element.title}`,
      }, 
      {
        columnDef: 'description',
        header: 'Description',
        cell: (element: Menu) => `${element.description}`,
      },    
    ];  

  constructor() {}

  ngOnInit(): void {
    this.getAvailablesMenus();
  }

  getAvailablesMenus() {    
    this.menuService.getAvailablesMenus().subscribe({
      next: menus => {
        this.availablesMenus.set(menus);        
      }
    })
  }

  getMenusByDay(day: string): Menu[] {
    return this.availablesMenus().filter(m => m.dayOfWeek === day);
  }  

  getImageByTitleAndType(imageName: string, typeFoodId: number): string {    
    const typeFoodMapping: Record<number, string> = {
      1: 'breakfast', 
      2: 'lunch', 
      3: 'snack' 
    };
      
    const typeFood = typeFoodMapping[typeFoodId] || 'default';        
      
    const imagePath = `./assets/menu/${typeFood}/${imageName}`;    
    
    return imagePath;
  }

  openDialogEditNotification(menu: Menu) {        
      const config = {
          class: 'modal-dialog-centered modal-lg',
          data: {         
              item: { ...menu },    
              columnDefs: this.columns.filter(c => c.header !== 'Actions'),
              url: 'menus/',
          }
      }
      const dialogRef = this.dialog.open( GenericCreateUpdateModalComponent, config );
      dialogRef.afterClosed().subscribe(result => {
        this.getAvailablesMenus();      
      });    
  }  

}
