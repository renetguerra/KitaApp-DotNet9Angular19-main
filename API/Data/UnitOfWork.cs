using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, IUserRepository userRepository, 
    IMessageRepository messageRepository, ICalendarRepository calendarRepository,
    INotificationRepository notificationRepository, IMenuRepository menuRepository,
    IUserPhotoRepository photoRepository, IGalleryRepository galleryRepository) : IUnitOfWork
{
    public IUserRepository UserRepository => userRepository;

    public IMessageRepository MessageRepository => messageRepository;
    public ICalendarRepository CalendarRepository => calendarRepository;
    public INotificationRepository NotificationRepository => notificationRepository;

    public IMenuRepository MenuRepository => menuRepository;

    public IUserPhotoRepository PhotoRepository => photoRepository;
    public IGalleryRepository GalleryRepository => galleryRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
