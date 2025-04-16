namespace API.Entities
{
    public class Menu
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int TypeFoodId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public DateTime? Date { get; set; }
        public bool IsActive { get; set; }
        public string? ImageName { get; set; }
        public virtual ICollection<MenuPhoto> MenuPhotos { get; set; } = [];
    }
}
