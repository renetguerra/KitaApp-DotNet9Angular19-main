using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class TutorDto
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
        public string? PhotoUrl { get; set; }
        public virtual List<UserDto> Users { get; set; } = [];
        public virtual ICollection<PhotoDto> TutorPhotos { get; set; } = [];        
    }
}
