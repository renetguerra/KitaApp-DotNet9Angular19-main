import { Injectable, computed, inject, signal } from "@angular/core";
import { MenuService } from "../_services/menu.service";
import { Menu } from "../_models/menu";


@Injectable({ providedIn: 'root' })
export class MenuStore {
  private readonly menuService = inject(MenuService);

  private readonly _menus = signal<Menu[]>([]);
  readonly menus = this._menus.asReadonly();

  readonly weekDays = [
    { name: 'Monday', label: 'MON', value: 1 },
    { name: 'Tuesday', label: 'TUE', value: 2 },
    { name: 'Wednesday', label: 'WED', value: 3 },
    { name: 'Thursday', label: 'THU', value: 4 },
    { name: 'Friday', label: 'FRI', value: 5 }
  ];

  readonly getMenusByDay = (day: string) => 
    computed(() => this._menus().filter(m => m.dayOfWeek === day));

  loadMenus() {
    this.menuService.getAvailablesMenus().subscribe({
      next: menus => this._menus.set(menus),
      error: err => console.error('Error loading menus', err)
    });
  }

  getImagePath(imageName: string, typeFoodId: number): string {
    const mapping: Record<number, string> = { 1: 'breakfast', 2: 'lunch', 3: 'snack' };
    return `./assets/menu/${mapping[typeFoodId] || 'default'}/${imageName}`;
  }
}