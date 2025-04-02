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
    
  eventForm: FormGroup = new FormGroup({});
  range: FormGroup;  

  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  readonly dateFormatString = computed(() => {
    if (this._locale() === 'en-EN') {
      return 'YYYY/MM/DD';
    } else if (this._locale() === 'es-ES' || this._locale() === 'de-DE') {
      return 'DD/MM/YYYY';
    }
    return '';
  });

  eventOptions = [
    { label: 'Vacation', value: 'isVacation' },
    { label: 'Holiday', value: 'isHolidays' },
    { label: 'Sick Leave', value: 'isSickLeave' },
    { label: 'Other', value: 'isOther' }
  ]; 

  minDate: Date | null = null;
  maxDate: Date | null = null;
  
  calendarEvents = signal<Calendar[]>([]);  

  private calendarService = inject(CalendarService);
  private toastr = inject(ToastrService); 

  constructor(
    private fb: FormBuilder, private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MemberCalendarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Calendar
  ) {    
        
    this.range = this.fb.group({
      start: [data?.startDate ? new Date(data.startDate) : null, Validators.required],
      end: [data?.endDate ? new Date(data.endDate) : null, Validators.required],
    });

    this.minDate = new Date(this.range.get('start')?.value.getFullYear(), this.range.get('start')?.value.getMonth(), 1);
    
    this.maxDate = new Date(
      this.range.get('end')?.value.getFullYear(),
      this.range.get('end')?.value.getMonth() + 1, 
      0 
    );   

    const selectedOption = this.getSelectedOption(data!);

    this.eventForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],      
      startDate: [this.range.get('start')?.value || null, Validators.required],
      endDate: [this.range.get('end')?.value || null, Validators.required],      
      eventType: [selectedOption, Validators.required],
      isVacation: [data?.isVacation],
      isHolidays: [data?.isHolidays],
      isSickLeave: [data?.isSickLeave],
      isOther: [data?.isOther]
    });        
  }

  ngOnInit() {    
    this.calendarService.getEvents();
    this.calendarEvents.set(this.calendarService.getCalendarEventsSignal()());
  }

  getSelectedOption(data: Calendar): string | null {
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

      const updatedEvent: Partial<Calendar> = {
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        startDate: new Date(this.range.get('start')?.value),
        endDate: new Date(this.range.get('end')?.value),
        isVacation: selectedType === 'isVacation',
        isHolidays: selectedType === 'isHolidays',
        isSickLeave: selectedType === 'isSickLeave',
        isOther: selectedType === 'isOther'
      };

      if (this.data?.id) {
        updatedEvent.id = this.data.id;
      }    
            
      this.calendarService.saveCalendarEvent(updatedEvent as Calendar);      
      this.dialogRef.close(this.calendarEvents);      
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
