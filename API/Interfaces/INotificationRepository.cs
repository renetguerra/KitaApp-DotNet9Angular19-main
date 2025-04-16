using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface INotificationRepository
{    
    void UpdateUserNotification(UserNotification userNotification);    
    void DeleteUserNotification(UserNotification userNotification);
    Task<IEnumerable<NotificationDto>> GetNotifications();
    Task<Notification> GetNotification(int notificationId);
    //Task<Notification?> GetNotificationByDate(DateTime date);
    Task<IEnumerable<UserNotificationDto>> GetNotificationsForUser(int userId);
    Task<IEnumerable<UserNotificationDto>> GetUserNotificationsByNotificationId(int notificationId);

    void Add(Notification notification);    
    void Update(Notification notification);
    void Delete(int id);
    void Remove(Notification notification);
    //Task<IEnumerable<Notification>> GetAvailablesNotificationsForUser(int userId);

}
