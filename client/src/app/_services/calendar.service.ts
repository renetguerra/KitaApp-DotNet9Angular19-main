import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Calendar } from '../_models/calendar';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  baseUrl = environment.apiUrl;
  private calendarEvents = signal<Calendar[]>([]);  
  private calendarEvent = signal<Calendar>(
    { 
      id: 0, 
      title: '', 
      description: '', 
      startDate: new Date(), 
      endDate: new Date(), 
      isVacation: false, 
      isHolidays: false, 
      isSickLeave: false, 
      isOther: false 
    }
  );

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get<Calendar[]>(this.baseUrl + 'calendars/calendar-events').subscribe((events) => {
      this.calendarEvents.set(events); 
    });
  }      

  getEvent(date: Date) {
    const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const formattedDate = dateUTC.toISOString().split('T')[0];
    return this.http.get<Calendar>(this.baseUrl + 'calendars/calendar-event/' + formattedDate);
  }  
  
  getCalendarEventsSignal = () => this.calendarEvents;

  getCalendarEventSignal() {
    return this.calendarEvent; 
  }

  saveCalendarEvent(calendarEvent: Calendar) {

    const startDateUTC = new Date(
        Date.UTC(calendarEvent.startDate.getFullYear(), calendarEvent.startDate.getMonth(), calendarEvent.startDate.getDate())
      );

    const endDateUTC = new Date(
      Date.UTC(calendarEvent.endDate.getFullYear(), calendarEvent.endDate.getMonth(), calendarEvent.endDate.getDate())
    );    

    this.http.post<Calendar>(this.baseUrl + 'calendars', {
      ...calendarEvent,
      startDate: startDateUTC.toISOString(),
      endDate: endDateUTC.toISOString()
    }).subscribe({
      next: (newEvent) => {
        this.calendarEvents.update((events) => [...events, newEvent]);
      },
      error: (err) => console.error('Error al añadir evento:', err)
    });
  }

  updateEvents(newEvents: Calendar[]) {
    this.calendarEvents.set(newEvents); 
  }

  deleteCalendarEvent(id: number) {
    return this.http.delete(this.baseUrl + 'calendars/' + id);
  }
  
}
