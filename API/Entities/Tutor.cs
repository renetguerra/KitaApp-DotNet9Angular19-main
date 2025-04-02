using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Tutor
    {
        public int Id { get; set; }        
        public required string FullName { get; set; }        
        public DateOnly DateOfBirth { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public string? Phone { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public string? Description { get; set; }
        public virtual List<User> Users { get; set; } = [];        
        public virtual ICollection<TutorPhoto> TutorPhotos { get; set; } = [];        
    }
}