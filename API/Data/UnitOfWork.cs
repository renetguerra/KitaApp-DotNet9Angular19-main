using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, IUserRepository userRepository, 
    ILikesRepository likesRepository, IMessageRepository messageRepository, ICalendarRepository calendarRepository,
    IUserPhotoRepository photoRepository) : IUnitOfWork
{
    public IUserRepository UserRepository => userRepository;

    public IMessageRepository MessageRepository => messageRepository;
    public ICalendarRepository CalendarRepository => calendarRepository;

    public ILikesRepository LikesRepository => likesRepository;
    public IUserPhotoRepository PhotoRepository => photoRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
