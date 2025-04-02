namespace API.Entities
{
    public class Calendar
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsVacation { get; set; }
        public bool IsHolidays { get; set; }
        public bool IsSickLeave { get; set; }
        public bool IsOther { get; set; }        
        public virtual ICollection<UserCalendar> UserCalendars { get; set; } = [];
    }
}
