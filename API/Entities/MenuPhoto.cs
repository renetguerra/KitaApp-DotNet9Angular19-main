namespace API.Entities
{
    public class MenuPhoto : Photo
    {
        public int Id { get; set; }
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; } = null!;
    }
}