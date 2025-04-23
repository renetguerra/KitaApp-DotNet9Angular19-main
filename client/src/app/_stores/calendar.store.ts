import { Injectable, computed, inject, signal } from '@angular/core';
import { CalendarService } from '../_services/calendar.service';
import { Calendar } from '../_models/calendar';
import { MemberStore } from './member.store';

@Injectable({
  providedIn: 'root',
})
export class CalendarStore {
  private calendarService = inject(CalendarService);

  private memberStore = inject(MemberStore);

  readonly calendarEvents = this.memberStore.calendarEvents;

  private _selectedDate = signal<Date | null>(null);
  private _selectedRange = signal<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  readonly selectedDate = computed(() => this._selectedDate());
  readonly selectedRange = computed(() => this._selectedRange());

  readonly editingDate = signal<Date>(new Date());
  readonly editingDateString = signal<string>('');

  getCalendarEventByDate(date: Date): Calendar | undefined {
    return this.calendarEvents().find((ev) =>
      this.isDateInRange(date, ev.startDate, ev.endDate)
    );
  }

  setSelectedDate(date: Date | null): void {
    this._selectedDate.set(date);
  }

  setSelectedRange(start: Date | null, end: Date | null): void {
    this._selectedRange.set({ start, end });
  }

  setEditingDate(value: Date): void {
    this.editingDate.set(value);
  }

  setEditingDateString(value: string): void {
    this.editingDateString.set(value);
  }

  deleteCalendarEvent(id: number): void {
    this.calendarService.deleteCalendarEvent(id).subscribe(() => {
      this.calendarEvents.update((events) =>
        events.filter((ev) => ev.id !== id)
      );
    });
  }

  isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
    if (!start || !end) return false;
    const target = new Date(date).setHours(0, 0, 0, 0);
    const startDate = new Date(start).setHours(0, 0, 0, 0);
    const endDate = new Date(end).setHours(0, 0, 0, 0);

    return target >= startDate && target <= endDate;
  }

  isSameDate(date: Date, compareDate: Date): boolean {
    const day = this.toMidnight(date);
    const otherDay = this.toMidnight(compareDate);

    const matchedEvent = this.calendarEvents().find(
      (ev) =>
        (ev.isVacation || ev.isHolidays || ev.isSickLeave || ev.isOther) &&
        this.isDateInRange(date, ev.startDate, ev.endDate)
    );

    return day === otherDay && !!matchedEvent?.id;
  }

  private toMidnight(date: Date): number {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  private getMatchingEvent(date: Date, type: keyof Calendar) {
    return this.calendarEvents()?.find(
      (ev) => ev[type] && this.isDateInRange(date, ev.startDate, ev.endDate)
    );
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

      const event =
        this.getMatchingEvent(date, 'isVacation') ||
        this.getMatchingEvent(date, 'isHolidays') ||
        this.getMatchingEvent(date, 'isSickLeave') ||
        this.getMatchingEvent(date, 'isOther');

      if (event) {
        let tooltip: string = event.title;
        tooltip += event.description ? ` - ${event.description}` : '';
        if (cell.getAttribute('title') !== tooltip) {
          cell.setAttribute('title', tooltip);
        }
      }
    });
  }

  getDateClassHolidays = (date: Date) =>
    this.getMatchingEvent(date, 'isHolidays') ? ' holidays-date-class ' : '';
  getDateClassVacations = (date: Date) =>
    this.getMatchingEvent(date, 'isVacation') ? ' vacation-date-class ' : '';
  getDateClassSickLeave = (date: Date) =>
    this.getMatchingEvent(date, 'isSickLeave') ? ' sickLeave-date-class ' : '';

  getDateRangeClass = (date: Date) => {
    if (!this.calendarEvents() || this.calendarEvents().length === 0) return '';

    const event = this.calendarEvents().find((ev) =>
      this.isDateInRange(date, ev.startDate, ev.endDate)
    );

    if (!event) return '';

    const isSameStart = this.isSameDate(date, event.startDate);
    const isSameEnd = this.isSameDate(date, event.endDate);
    const isSingleDay = event.startDate === event.endDate;

    if (isSingleDay) return 'range-single';
    if (isSameStart) return 'range-start';
    if (isSameEnd) return 'range-end';
    return 'range-middle';
  };

  getCustomDateClass = (date: Date): string => {
    let classes = ' ';
    classes += this.getDateClassHolidays(date);
    classes += this.getDateClassVacations(date);
    classes += this.getDateClassSickLeave(date);

    classes += this.getDateRangeClass(date);

    return classes;
  }; 

  formatDateForInput(date: Date): string {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16);
  }
}
