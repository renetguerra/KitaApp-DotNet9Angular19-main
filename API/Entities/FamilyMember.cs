using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class FamilyMember 
    {        
        public int Id { get; set; }
        public required string FullName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public required string Phone { get; set; }
        public string? Relationship { get; set; }
        public bool isParent { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;        
        public virtual ICollection<FamilyMemberPhoto> FamilyMemberPhotos { get; set; } = [];        
    }
}