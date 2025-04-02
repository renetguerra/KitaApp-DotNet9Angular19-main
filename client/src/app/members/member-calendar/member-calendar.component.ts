import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  model,
  ViewChild,
  ViewEncapsulation,
  AfterViewChecked,
  inject,
  computed,  
  ChangeDetectorRef,
  effect,
  input,
  signal,
  viewChild,  
} from '@angular/core';
import {
  MatCalendar,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Calendar } from 'src/app/_models/calendar';
import { UserCalendar } from 'src/app/_models/userCalendar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MemberCalendarModalComponent } from '../member-calendar-modal/member-calendar-modal.component';
import { CalendarService } from 'src/app/_services/calendar.service';
import { CalendarContextMenuDirective } from 'src/app/_directives/calendar-context-menu.directive';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-member-calendar',
  templateUrl: './member-calendar.component.html',
  styleUrl: './member-calendar.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatCardModule,
    MatDatepickerModule,
    MatMenuModule,
    MatMenuTrigger,
    MatNativeDateModule,
    MatCalendar,    
    MatIconModule,
    CalendarContextMenuDirective
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberCalendarComponent implements AfterViewInit, AfterViewChecked {
  userCalendars = input<UserCalendar[]>();

  selected = model<Date | null>(null);
  
  // @ViewChild('calendar') calendarMat!: MatCalendar<Date>;  
  calendarMat = viewChild<MatCalendar<Date>>('calendar');
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  // menuTrigger = viewChild(MatMenuTrigger);
  
  selectedStart: Date | null = null;
  selectedEnd: Date | null = null;

  editingDate: Date = new Date();
  editingDateString: string = '';
  isRangeSelection = false;
  selectedRange: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  titleAddEdit = signal<string>('');
  titleIconAddEdit = signal<string>('');
  showDeleteAction = signal<boolean>(false);

  customEvents: { [key: string]: { title: string; description: string } } = {};  
 
  defaultCalendar: Calendar = {
    id: 0,
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    isVacation: false,
    isHolidays: false,
    isSickLeave: false,
    isOther: false,
  };

  private calendarService = inject(CalendarService);  
  
  calendarEvent = computed(() => this.calendarService.getCalendarEventSignal()());
  calendarEvents = this.calendarService.getCalendarEventsSignal();
    
  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef) {     
     effect(() => {            
      this.customDateClass(this.selected()!);
      if (this.calendarMat()?.activeDate) {             
        this.updateCalendar();      
      }      
    });
  } 

  ngOnInit() {
    this.calendarService.getEvents();   
      
  }

  ngAfterViewInit() {
    this.addTooltips();
    this.customDateClass(this.selected()!);
    this.addNavigationListeners();          
  }

  ngAfterViewChecked() {    
    this.addTooltips();
    this.customDateClass(this.selected()!);
  }
    
  addNavigationListeners() {
    setTimeout(() => {
      const prevButton = document.querySelector('.mat-calendar-previous-button');
      const nextButton = document.querySelector('.mat-calendar-next-button');

      if (prevButton) {
        prevButton.addEventListener('click', () => this.onPreviousMonth());
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => this.onNextMonth());
      }
    }, 0);
  }

  onPreviousMonth() {    
    this.getCurrentMonth();
    this.updateCalendar();
  }

  onNextMonth() {    
    this.getCurrentMonth();
    this.updateCalendar();
  }

  getCurrentMonth() {
    const activeDate = this.calendarMat()!.activeDate;
    this.selected.set(new Date(activeDate.getFullYear(), activeDate.getMonth(), 1));
    this.editingDate = this.selected() ?? new Date();
    this.editingDateString = this.formatDateForInput(this.editingDate);    
  }

  updateCalendar() {       
    this.calendarMat()?.updateTodaysDate();
  }

  addTooltips() {
    const calendarElement = document.querySelector('.mat-calendar');

    if (!calendarElement) return;

    const calendarCells = calendarElement.querySelectorAll(
      '.mat-calendar-body-cell'
    );

    calendarCells.forEach((cell) => {      
      const dateStr = cell.getAttribute('aria-label'); 
      if (!dateStr) return;

      const date = new Date(dateStr);              
      
      const event = this.calendarEvents()?.find(
        (sc) =>
          (sc?.isVacation || sc?.isHolidays || sc?.isSickLeave || sc?.isOther ) &&
          this.isDateInRange(date, sc?.startDate, sc?.endDate)
      );
      
      if (event) {
        let tooltip: string ='';
        tooltip = event.title;
        tooltip += event.description ? ` - ${event.description}` : '';        
        cell.setAttribute('title', tooltip);                          
      }
    });
  }    

  openModal(data?: Calendar) {
    const date: Date = new Date(this.editingDateString);

    this.calendarService.getEvent(date).subscribe((event) => {
      this.dialog.open(MemberCalendarModalComponent, {
        width: '400px',
        data: event !== null ? event : {...this.defaultCalendar, startDate: date, endDate: date},
        position: { right: '15%' },
      });         
    });    
  }
  
  onDateSelectedRange(date: Date | null) {
    if (!this.selectedStart || (this.selectedStart && this.selectedEnd)) {
      this.selectedStart = date;
      this.selectedEnd = null;
    } else {
      this.selectedEnd = date! < this.selectedStart ? this.selectedStart : date;
      this.selectedStart =
        date! < this.selectedStart ? date : this.selectedStart;
    }
  }

  onDateSelected(selected: Date | null) {
    this.selected.set(selected ?? new Date());
    this.editingDate = selected ?? new Date();
    if (this.editingDate) {
      this.editingDateString = this.formatDateForInput(this.editingDate);
    }
  }  

  formatDateForInput(date: Date): string {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16);
  }

  dateClassHolidays = (date: Date) => {

    if (this.calendarEvents().length === 0) {
      this.calendarEvents.set(this.userCalendars()?.map((sc) => sc.calendar) || []);
    };

    if (this.calendarEvents().length === 0 || date === null) return '';   
       
    const eventHolidays = this.calendarEvents()?.find(
      (sc) =>
        sc?.isHolidays &&
        this.isDateInRange(date, sc?.startDate, sc?.endDate)
    );
    
    const styleHolidays = eventHolidays?.isHolidays ? ' holidays-date-class' : '';   

    return styleHolidays;
  };

  dateClassVacations = (date: Date) => {
    if (this.calendarEvents()?.length === 0 || date === null) return '';
    
    return this.calendarEvents()?.some(
      (sc) =>
        sc?.isVacation &&
        this.isDateInRange(date, sc?.startDate, sc?.endDate)
    )
      ? ` vacation-date-class`
      : '';
  };

  dateClassSickLeave = (date: Date) => {
    if (this.calendarEvents()?.length === 0 || date === null) return '';

    return this.calendarEvents()?.some(
      (sc) =>
        sc?.isSickLeave &&
        this.isDateInRange(date, sc?.startDate, sc?.endDate)
    )
      ? ' sickLeave-date-class'
      : '';
  };

  private isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
    if (!start || !end) return false;
    const target = new Date(date).setHours(0, 0, 0, 0);
    const startDate = new Date(start).setHours(0, 0, 0, 0);
    const endDate = new Date(end).setHours(0, 0, 0, 0);

    return target >= startDate && target <= endDate;
  }

  isSameDate(date: Date, date1:Date, event: Calendar): boolean {
    const d = date.setHours(0, 0, 0, 0);
    const d1 = new Date(date1).setHours(0, 0, 0, 0);

    const eventCalendar = this.calendarEvents().find(ev => 
      (ev.isVacation || ev.isHolidays || ev.isSickLeave || ev.isOther ) &&
      this.isDateInRange(date, ev?.startDate, ev?.endDate)
    );    
          
    return (d === d1 && eventCalendar!.id > 0);;
  }

  dateRangeClass = (date: Date) => {
    if (!this.calendarEvents() || this.calendarEvents().length === 0) return ''; 

    const event = this.calendarEvents().find(ev => this.isDateInRange(date, ev.startDate, ev.endDate));

    if (!event) return '';

    if (event.startDate !== event.endDate && this.isSameDate(date, event.startDate, event)) {
      return ' range-start';
    } else if (event.startDate !== event.endDate && this.isSameDate(date, event.endDate, event)) {
      return ' range-end';
    } else if (event.startDate === event.endDate) {
      return ' range-single';
    } else {
      return ' range-middle'; 
    }

  };

  customDateClass = (date: Date) => {
    let classes = ' ';
    classes += this.dateClassHolidays(date);
    classes += this.dateClassVacations(date);
    classes += this.dateClassSickLeave(date);

    classes += this.dateRangeClass(date);

    return classes;
  };

  getCalendarEventByActiveDate(): Calendar | undefined {
    const activeDate = new Date(this.calendarMat()!.activeDate);    
    this.editingDateString = this.formatDateForInput(activeDate);

    const event = this.calendarEvents().find(ev => this.isDateInRange(activeDate, ev.startDate, ev.endDate));
    return event;
  }

  onDateSelectedToAction() {            
    const event = this.getCalendarEventByActiveDate();

    if (event && event.id > 0) {
      this.titleAddEdit.set('Edit');
      this.titleIconAddEdit.set('edit');
      this.showDeleteAction.set(true);
    } else {
      this.titleAddEdit.set('Add');
      this.titleIconAddEdit.set('add');
      this.showDeleteAction.set(false);
    }    
  } 

  deleteCalendarEvent() {
    const event = this.getCalendarEventByActiveDate();
    if (event && event.id > 0) {
      this.calendarService.deleteCalendarEvent(event.id).subscribe({      
        next: _ => this.calendarEvents.set(this.calendarEvents().filter(ev => ev.id !== event.id))                          
      });    
      this.updateCalendar();                             
    }    
  }
}


