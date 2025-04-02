using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("TutorPhotos")]
    public class TutorPhoto : Photo
    {
        public int Id { get; set; }
        public int TutorId { get; set; }
        public virtual Tutor Tutor { get; set; } = null!;
    }
}