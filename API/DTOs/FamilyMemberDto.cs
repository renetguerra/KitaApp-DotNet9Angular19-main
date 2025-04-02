using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class FamilyMemberDto
    {
        public int Id { get; set; }
        public required string FullName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public required string Phone { get; set; }
        public string? Relationship { get; set; }
        public bool isParent { get; set; }        
        public string? PhotoUrl { get; set; }
        public List<PhotoDto>? FamilyMemberPhotos { get; set; }
    }
}