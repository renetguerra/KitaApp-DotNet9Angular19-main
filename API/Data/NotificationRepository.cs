using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API;

public class NotificationRepository(DataContext context, IMapper mapper) : INotificationRepository
{           
    public async Task<IEnumerable<NotificationDto>> GetNotifications()
    {
        return await context.Notifications
                        .ProjectTo<NotificationDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
    }

    public async Task<Notification> GetNotification(int notificationId)
    {
        return await context.Notifications.FindAsync(notificationId);
    }    

    public async Task<IEnumerable<UserNotificationDto>> GetNotificationsForUser(int userId)
    {
        return await context.UserNotifications
            .Include(sc => sc.Notification)
            .Where(x => x.UserId == userId)
            .ProjectTo<UserNotificationDto>(mapper.ConfigurationProvider)
            .ToListAsync();        
    }

    public async Task<IEnumerable<UserNotificationDto>> GetUserNotificationsByNotificationId(int notificationId)
    {
        return await context.UserNotifications
            .Include(sc => sc.Notification)
            .Where(x => x.NotificationId == notificationId)
            .ProjectTo<UserNotificationDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public void Add(Notification notification)
    {
        context.Notifications.Add(notification);
    }

    public void Update(Notification notification)
    {
        context.Notifications.Attach(notification);
        context.Entry(notification).State = EntityState.Modified;
    }

    public void Delete(int id)
    {
        var notification = context.Notifications.Find(id);

        context.Notifications.Attach(notification);
        context.Entry(notification).State = EntityState.Modified;
    }

    public void Remove(Notification notification)
    {
        context.Notifications.Remove(notification);
    }

    public void UpdateUserNotification(UserNotification userNotification)
    {
        context.Entry(userNotification).State = EntityState.Modified;
    }

    public void DeleteUserNotification(UserNotification userNotification)
    {
        context.UserNotifications.Remove(userNotification);
    }

      
}
