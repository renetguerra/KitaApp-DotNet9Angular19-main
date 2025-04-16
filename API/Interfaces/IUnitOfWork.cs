namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository {get;}
    IMessageRepository MessageRepository {get;}
    ICalendarRepository CalendarRepository { get; }
    INotificationRepository NotificationRepository { get; }
    IMenuRepository MenuRepository { get; }
    IUserPhotoRepository PhotoRepository {get;}
    IGalleryRepository GalleryRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
