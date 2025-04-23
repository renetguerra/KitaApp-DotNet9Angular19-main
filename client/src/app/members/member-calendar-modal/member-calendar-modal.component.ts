import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, Inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Calendar } from 'src/app/_models/calendar';
import {MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from 'src/app/_services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarStore } from 'src/app/_stores/calendar.store';

@Component({
  selector: 'app-member-calendar-modal',
  templateUrl: './member-calendar-modal.component.html',
  styleUrls: ['./member-calendar-modal.component.css'],
  imports: [CommonModule, 
    FormsModule, ReactiveFormsModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule, MatLabel, MatInputModule, MatButtonModule,
    MatCardModule, MatInputModule, MatDatepickerModule,   
    MatNativeDateModule, MatDialogModule, MatDialogContent, MatDialogActions],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ provideNativeDateAdapter(),
      {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } as MatCheckboxDefaultOptions},
      {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    ]
})
export class MemberCalendarModalComponent {  

  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private calendarService = inject(CalendarService);
  private toastr = inject(ToastrService);
  private locale = inject(MAT_DATE_LOCALE);
  private dialogRef = inject(MatDialogRef<MemberCalendarModalComponent>);
  private data = inject<Calendar>(MAT_DIALOG_DATA);

  private calendarStore = inject(CalendarStore);
    
  eventOptions = [
    { label: 'Vacation', value: 'isVacation' },
    { label: 'Holiday', value: 'isHolidays' },
    { label: 'Sick Leave', value: 'isSickLeave' },
    { label: 'Other', value: 'isOther' }
  ]; 

  readonly calendarEvents = signal<Calendar[]>([]);  
  readonly localeSignal = signal(this.locale);
  readonly dateFormatString = computed(() => {
    switch (this.localeSignal()) {
      case 'en-EN': return 'YYYY/MM/DD';
      case 'es-ES':
      case 'de-DE': return 'DD/MM/YYYY';
      default: return '';
    }
  });
  
  readonly range = this.fb.group({
    start: [this.data?.startDate ? new Date(this.data.startDate) : null, Validators.required],
    end: [this.data?.endDate ? new Date(this.data.endDate) : null, Validators.required]
  });  
  
  readonly eventForm = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],
    description: [this.data?.description ?? ''],
    startDate: [this.range.get('start')?.value ?? undefined, Validators.required],
    endDate: [this.range.get('end')?.value ?? undefined, Validators.required],
    eventType: [this.getSelectedOption(this.data), Validators.required],
    isVacation: [this.data?.isVacation],
    isHolidays: [this.data?.isHolidays],
    isSickLeave: [this.data?.isSickLeave],
    isOther: [this.data?.isOther]
  });

  readonly minDate = new Date(
    this.range.get('start')?.value?.getFullYear() ?? new Date().getFullYear(),
    this.range.get('start')?.value?.getMonth() ?? 0,
    1
  );

  readonly maxDate = new Date(
    this.range.get('end')?.value?.getFullYear() ?? new Date().getFullYear(),
    (this.range.get('end')?.value?.getMonth() ?? 0) + 1,
    0
  );  

  ngOnInit() {    
    this.calendarService.getEvents();
    this.calendarEvents.set(this.calendarService.getCalendarEventsSignal()());
  }

  getSelectedOption(data: Calendar): string | null {
    if (!data) return null;
    if (data.isVacation) return 'isVacation';
    if (data.isHolidays) return 'isHolidays';
    if (data.isSickLeave) return 'isSickLeave';
    if (data.isOther) return 'isOther';
    return null;
  }

  formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset); 
    const isoString = d.toISOString().slice(0, 16);
    return isoString;
  }

  onDateInputChange(event: Event) {   
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newDate = new Date(inputElement.value);
      this.eventForm.patchValue({ startDate: newDate });
    }    
  }  

  dateRangeValidator(control: FormControl) {
    const date: Date = control.value;
    if (!date) return null;
    if (date < this.minDate! || date > this.maxDate!) {
      return { outOfRange: true };
    }
    return null;
  }

  save() {    
    if (this.eventForm.valid) {
      const selectedType = this.eventForm.value.eventType;

      const startRaw = this.range.get('start')?.value;
      const endRaw = this.range.get('end')?.value;

      const updatedEvent: Partial<Calendar> = {
        title: this.eventForm.value.title ?? '',
        description: this.eventForm.value.description ?? '',
        startDate: startRaw ? new Date(startRaw) : undefined,
        endDate: endRaw ? new Date(endRaw) : undefined,
        isVacation: selectedType === 'isVacation',
        isHolidays: selectedType === 'isHolidays',
        isSickLeave: selectedType === 'isSickLeave',
        isOther: selectedType === 'isOther'
      };

      if (this.data?.id) {
        updatedEvent.id = this.data.id;
        this.calendarStore.calendarEvents.update((events) => {
          const index = events.findIndex((event) => event.id === this.data.id);
          if (index !== -1) {
            events[index] = { ...events[index], ...updatedEvent };
          }
          return events;
        });
      }    
            
      this.calendarService.saveCalendarEvent(updatedEvent as Calendar);      
      this.dialogRef.close(this.calendarEvents);      
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
