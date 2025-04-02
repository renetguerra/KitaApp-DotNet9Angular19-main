using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API;

public class CalendarRepository(DataContext context, IMapper mapper) : ICalendarRepository
{    
    public void AddCalendarEvent(Calendar calendar)
    {
        context.Calendars.Add(calendar);
    }

    public void Update(Calendar calendar)
    {
        context.Entry(calendar).State = EntityState.Modified;
    }

    public void DeleteCalendarEvent(Calendar calendar)
    {
        context.Calendars.Remove(calendar);
    }    

    public async Task<Calendar?> GetCalendarEvent(int calendarId)
    {
        return await context.Calendars.FindAsync(calendarId);
    }

    public async Task<Calendar?> GetCalendarEventByDate(DateTime date)
    {
        return await context.Calendars.FirstOrDefaultAsync(c => c.StartDate == date);
    }    

    public async Task<IEnumerable<UserCalendar>> GetCalendarEventsForUser(int userId)
    {
        return await context.UserCalendars
            .Include(sc => sc.Calendar)
            .Where(x => x.UserId == userId).ToListAsync();        
    }    
}
