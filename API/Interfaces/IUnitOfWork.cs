﻿namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository {get;}
    IMessageRepository MessageRepository {get;}
    ICalendarRepository CalendarRepository { get; }    
    IUserPhotoRepository PhotoRepository {get;}
    Task<bool> Complete();
    bool HasChanges();
}
