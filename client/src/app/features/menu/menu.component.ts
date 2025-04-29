import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Menu } from 'src/app/core/_models/menu';
import { User } from 'src/app/core/_models/user';
import { AccountService } from 'src/app/core/_services/account.service';
import { MenuStore } from 'src/app/core/_stores/menu.store';
import { GenericCreateUpdateModalComponent } from 'src/app/shared/components/modals/generic-create-update-modal/generic-create-update-modal.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [MatCardModule, MatButtonModule, CdkAccordionModule, MatIconModule, MatDividerModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
    
  private accountService = inject(AccountService);  
  readonly dialog = inject(MatDialog);

  private readonly menuStore = inject(MenuStore);

  user = signal<User>(this.accountService.currentUser()!);
  
  availablesMenus = signal<Menu[]>([]);

  weekDays = this.menuStore.weekDays;
  menus = this.menuStore.menus;

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

  ngOnInit(): void {
    this.menuStore.loadMenus();
  }

  getMenusByDay(day: string) {
    return this.menuStore.getMenusByDay(day)();
  } 

  getImageByTitleAndType(imageName: string, typeFoodId: number) {
    return this.menuStore.getImagePath(imageName, typeFoodId);
  }

  openDialogEditMenu(menu: Menu) {        
      const config = {
          class: 'modal-dialog-centered modal-lg',
          data: {         
              item: { ...menu },    
              columnDefs: this.columns.filter(c => c.header !== 'Actions'),
              url: 'menus/',
          }
      }
      const dialogRef = this.dialog.open(GenericCreateUpdateModalComponent, config );
      dialogRef.afterClosed().subscribe(result => {
        this.menuStore.loadMenus();      
      });    
  }  

}
