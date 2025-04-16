using API.Entities;

namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public int Age { get; set; }
    public string? PhotoUrl { get; set; }
    public string? KnownAs { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public string? Gender { get; set; }
    public string? Introduction { get; set; }
    public string? Interests { get; set; }    
    public string? City { get; set; }
    public string? Country { get; set; }
    public bool CanSendMessages { get; set; }
    public List<AddressDto>? Addresses { get; set; }
    public List<FamilyMemberDto>? FamilyMembers { get; set; }
    public List<PhotoDto>? UserPhotos { get; set; }
    public List<UserCalendarDto>? UserCalendars { get; set; }
    public List<UserNotificationDto>? UserNotifications { get; set; }
}
