using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("UserPhotos")]
    public class UserPhoto : Photo
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;        
    }
}