import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewChild,
  ViewEncapsulation,
  AfterViewChecked,
  inject,
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
import { Calendar } from 'src/app/core/_models/calendar';
import { UserCalendar } from 'src/app/core/_models/userCalendar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MemberCalendarModalComponent } from '../member-calendar-modal/member-calendar-modal.component';
import { CalendarService } from 'src/app/core/_services/calendar.service';
import { CalendarContextMenuDirective } from 'src/app/shared/_directives/calendar-context-menu.directive';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { CalendarStore } from 'src/app/core/_stores/calendar.store';

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
export class MemberCalendarComponent implements AfterViewChecked {

  private calendarService = inject(CalendarService);
  calendarStore = inject(CalendarStore);
  dialog = inject(MatDialog);
  
  userCalendars = input<UserCalendar[]>();
  calendarMat = viewChild<MatCalendar<Date>>('calendar');
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;   

  calendarEvents = this.calendarStore.calendarEvents;

  selected = model<Date | null>(null);
  readonly editingDate = signal<Date>(new Date());  
  readonly editingDateString = this.calendarStore.editingDateString;

  titleAddEdit = signal<string>('');
  titleIconAddEdit = signal<string>('');
  showDeleteAction = signal<boolean>(false);

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

  selectedStart: Date | null = null;
  selectedEnd: Date | null = null;
  
  isRangeSelection = false;
      
  constructor() {     
     effect(() => {                  
      this.calendarStore.getCustomDateClass(this.selected()!);                   
      this.updateCalendar();           
      this.calendarMat()?.monthSelected.subscribe(() => {
        this.calendarStore.addTooltips();
      });         
    });    
  } 

  ngOnInit() {
    this.calendarService.getEvents();         
  }
  
  ngAfterViewChecked() {        
    this.calendarStore.addTooltips();       
    this.calendarStore.getCustomDateClass(this.selected()!);
  }   

  updateCalendar() {       
    this.calendarMat()?.updateTodaysDate();
    this.calendarMat()?.ngAfterViewChecked();
  }  

  customDateClass = (date: Date): string => {    
    let customDateClass = ' ';
    customDateClass = this.calendarStore.getCustomDateClass(date);
    return customDateClass;
  };  

  openModal() {
    const date: Date = new Date(this.editingDateString());
    const event = this.calendarStore.getCalendarEventByDate(date);

    const data = event ?? {...this.defaultCalendar, startDate: date, endDate: date};

    const dialogRef = this.dialog.open(MemberCalendarModalComponent, {
      width: '400px',
      data,
      position: { right: '15%' },
    });             
  }  

  onDateSelected(selected: Date | null): void {    
    this.calendarStore.setSelectedDate(selected);
  }    
    
  getCalendarEventByActiveDate(): Calendar | undefined {
    const activeDate = new Date(this.calendarMat()!.activeDate);    
    this.editingDateString.set(this.calendarStore.formatDateForInput(activeDate));

    return this.calendarEvents().find(ev => this.calendarStore.isDateInRange(activeDate, ev.startDate, ev.endDate));    
  }

  onContextMenu() {            
    const event = this.getCalendarEventByActiveDate();
    this.titleAddEdit.set(event && event.id > 0 ? 'Edit' : 'Add');
    this.titleIconAddEdit.set(event && event.id > 0 ? 'edit' : 'add');
    this.showDeleteAction.set(!!event && event.id > 0);
  } 
 
  deleteCalendarEvent() {
    const event = this.getCalendarEventByActiveDate();
    if (event && event.id > 0) {
      this.calendarStore.deleteCalendarEvent(event.id);
      this.updateCalendar();
    }
  }
}


