using System.Globalization;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Text.Json;
using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API;

public class CalendarsController(IUnitOfWork unitOfWork, DataContext context,
    IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<CalendarDto>> SaveEventCalendar([FromBody] CalendarDto calendarEvent)
    {
        var username = User.GetUsername();

        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

        if (user == null || user.UserName == null)
            return BadRequest("Cannot send message at this time");

        var currentCalendar = await unitOfWork.CalendarRepository.GetCalendarEventByDate(calendarEvent.StartDate);
        if (currentCalendar != null)
        {
            mapper.Map(calendarEvent, currentCalendar);            
        }
        else
        {
            var newCalendar = new Entities.Calendar
            {
                Title = calendarEvent.Title,
                Description = calendarEvent.Description,
                StartDate = calendarEvent.StartDate,
                EndDate = calendarEvent.EndDate,
                IsVacation = calendarEvent.IsVacation,
                IsHolidays = calendarEvent.IsHolidays,
                IsSickLeave = calendarEvent.IsSickLeave,
                IsOther = calendarEvent.IsOther
            };

            unitOfWork.CalendarRepository.AddCalendarEvent(newCalendar);

            if (!await unitOfWork.Complete())
                return BadRequest("Failed to save calendar");

            currentCalendar = newCalendar;

            var studentCalendar = new UserCalendar
            {
                UserId = user.Id,
                CalendarId = currentCalendar.Id
            };
            context.UserCalendars.Add(studentCalendar);
        }        
        
        if (await unitOfWork.Complete()) return Ok(mapper.Map<CalendarDto>(currentCalendar));

        return BadRequest("Failed to save calendar");
    }

    [HttpGet("calendar-events")]
    public async Task<ActionResult<List<CalendarDto>>> GetCalendarEventsForUser()
    {
        var calendarEvents = new List<CalendarDto>();
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        var studentCalendars = await unitOfWork.CalendarRepository.GetCalendarEventsForUser(user.Id);


        foreach (var studentCalendar in studentCalendars)
        {
            var eventCalendar = mapper.Map<CalendarDto>(studentCalendar.Calendar);
            calendarEvents.Add(eventCalendar);
        }              

        return Ok(calendarEvents);        
    }

    [HttpGet("calendar-event/{date}")]
    public async Task<ActionResult<CalendarDto>> GetCalendarEventsByDate(string date)
    {
        if (!DateTime.TryParse(date, out DateTime parsedDate))
        {
            return BadRequest("Invalid date format. Use YYYY-MM-DD.");
        }

        var calendarEvent = await unitOfWork.CalendarRepository.GetCalendarEventByDate(parsedDate);            

        return Ok(mapper.Map<CalendarDto>(calendarEvent));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCalendarEvent(int id)
    {        
        var calendarEvent = await unitOfWork.CalendarRepository.GetCalendarEvent(id);

        if (calendarEvent == null) return BadRequest("Cannot delete this calendar event");        

        if (calendarEvent != null)
        {
            unitOfWork.CalendarRepository.DeleteCalendarEvent(calendarEvent);
        }

        if (await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem deleting the calendar event");
    }
}
