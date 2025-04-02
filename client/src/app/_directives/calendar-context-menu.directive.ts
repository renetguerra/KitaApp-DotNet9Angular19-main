import {
  Directive,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  HostListener,
  input,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Directive({
  selector: '[appCalendarContextMenu]',
  standalone: true,
})
export class CalendarContextMenuDirective {    
  @Input('appCalendarContextMenu') menuTrigger!: MatMenuTrigger | null;
    
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.listen('document', 'contextmenu', (event: MouseEvent) => {
      event.preventDefault(); 
    });
  }
  

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if (!event) {
      console.error('El evento llegó como undefined');
      return;
    }

    event.preventDefault();    
        
    this.menuTrigger?.openMenu();

    const menuElement = document.querySelector('.mat-mdc-menu-panel') as HTMLElement;
    if (menuElement) {
      menuElement.style.display = 'block';
      menuElement.style.position = 'fixed'; 
      menuElement.style.left = `${event.clientX}px`; 
      menuElement.style.top = `${event.clientY}px`; 
    } else {
      console.error('El menú no se encontró en el DOM.');
    }          
  }

  @HostListener('click', ['$event'])
  onLeftClick(event: MouseEvent) {
    const menuElement = document.querySelector('.mat-mdc-menu-panel') as HTMLElement;
      if (this.menuTrigger) {
        event.preventDefault(); 
        menuElement.style.display = 'none';        
      }    
  }  
}
