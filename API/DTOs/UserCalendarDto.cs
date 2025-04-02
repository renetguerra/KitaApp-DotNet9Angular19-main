using API.Entities;

namespace API.DTOs
{
    public class UserCalendarDto
    {
        //public int UserId { get; set; }
        //public int CalendarId { get; set; }
        //public User User { get; set; } = null!;
        public Calendar Calendar { get; set; } = null!;
    }
}