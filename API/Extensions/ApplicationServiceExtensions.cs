using System.ComponentModel;
using System.Text.Json.Serialization;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            //options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            //options.JsonSerializerOptions.WriteIndented = true;
        });
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();        
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<ICalendarRepository, CalendarRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IMenuRepository, MenuRepository>();
        services.AddScoped<IUserPhotoRepository, UserPhotoRepository>();
        services.AddScoped<IGalleryRepository, GalleryRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<LogUserActivity>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();

        return services;
    }
}
