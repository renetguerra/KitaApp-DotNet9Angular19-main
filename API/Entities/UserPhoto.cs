using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("StudentPhotos")]
    public class UserPhoto : Photo
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public virtual User User { get; set; } = null!;        
    }
}