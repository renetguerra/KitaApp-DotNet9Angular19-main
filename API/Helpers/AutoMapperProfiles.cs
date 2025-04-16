using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<User, MemberDto>()            
            .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOfBirth.CalculateAge()))
            .ForMember(d => d.PhotoUrl, o => 
                o.MapFrom(s => s.UserPhotos.FirstOrDefault(x => x.IsMain)!.Url));

        CreateMap<FamilyMember, FamilyMemberDto>()            
            .ForMember(d => d.PhotoUrl, o =>
                o.MapFrom(s => s.FamilyMemberPhotos.FirstOrDefault(x => x.IsMain)!.Url));

        CreateMap<Tutor, TutorDto>()
            .ForMember(d => d.PhotoUrl, o =>
                o.MapFrom(s => s.TutorPhotos.FirstOrDefault(x => x.IsMain)!.Url));

        CreateMap<Address, AddressDto>();

        CreateMap<Photo, PhotoDto>();
        CreateMap<UserPhoto, PhotoDto>();
        CreateMap<FamilyMemberPhoto, PhotoDto>();
        //CreateMap<TutorPhoto, PhotoDto>();

        CreateMap<Calendar, CalendarDto>();
        CreateMap<CalendarDto, Calendar>();
        CreateMap<UserCalendar, UserCalendarDto>();

        CreateMap<Notification, NotificationDto>();
        CreateMap<NotificationDto, Notification>();
        CreateMap<UserNotification, UserNotificationDto>();

        CreateMap<Menu, MenuDto>();
        CreateMap<MenuDto, Menu>();

        CreateMap<MemberUpdateDto, User>();
        CreateMap<RegisterDto, User>();
        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<Message, MessageDto>()
            .ForMember(d => d.SenderPhotoUrl, 
                o => o.MapFrom(s => s.Sender.UserPhotos.FirstOrDefault(x => x.IsMain)!.Url))
            .ForMember(d => d.RecipientPhotoUrl, 
                o => o.MapFrom(s => s.Recipient.UserPhotos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue 
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
    }       
}
