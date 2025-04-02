using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ICalendarRepository
{
    void Update(Calendar calendar);
    void AddCalendarEvent(Calendar calendar);
    void DeleteCalendarEvent(Calendar calendar);
    Task<Calendar?> GetCalendarEvent(int calendarId);
    Task<Calendar?> GetCalendarEventByDate(DateTime date);
    Task<IEnumerable<UserCalendar>> GetCalendarEventsForUser(int userId);       
}
