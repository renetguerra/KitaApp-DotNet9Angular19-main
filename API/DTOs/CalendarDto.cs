using API.Entities;

namespace API.DTOs
{
    public class CalendarDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime _startDate;
        public DateTime StartDate { get => _startDate; set => _startDate = DateTime.SpecifyKind(value, DateTimeKind.Utc); }
        public DateTime _endDate;
        public DateTime EndDate { get => _endDate; set => _endDate = DateTime.SpecifyKind(value, DateTimeKind.Utc); }

        //public DateTime StartDate { get; set; }        
        //public DateTime EndDate { get; set; }
        public bool IsVacation { get; set; }
        public bool IsHolidays { get; set; }
        public bool IsSickLeave { get; set; }
        public bool IsOther { get; set; }        
    }
}
