using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{    
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public required string KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Introduction { get; set; }
    public string? Interests { get; set; }
    public bool CanSendMessages { get; set; }
    public int? TutorId { get; set; }
    public virtual Tutor? Tutor { get; set; }        
    public virtual List<Address> Addresses { get; set; } = [];            
    public virtual List<Message> MessagesSent { get; set; } = [];
    public virtual List<Message> MessagesReceived { get; set; } = [];
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
    public virtual ICollection<UserPhoto> UserPhotos { get; set; } = [];
    public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = [];    
    public virtual ICollection<UserCalendar> UserCalendars { get; set; } = [];
    public virtual ICollection<UserNotification> UserNotifications { get; set; } = [];
}
