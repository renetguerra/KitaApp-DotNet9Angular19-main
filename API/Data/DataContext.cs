using System.Reflection.Emit;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<User, AppRole, int,
    IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
{
    public DbSet<UserPhoto> UserPhotos { get; set; }
    public DbSet<Gallery> Galleries { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
    public DbSet<FamilyMemberPhoto> FamilyMemberPhotos { get; set; }
    public DbSet<Tutor> Tutors { get; set; }
    public DbSet<TutorPhoto> TutorPhotos { get; set; }    
    public DbSet<Message> Messages { get; set; }
    public DbSet<Calendar> Calendars { get; set; }    
    public DbSet<UserCalendar> UserCalendars { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<UserNotification> UserNotifications { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<MenuPhoto> MenuPhotos { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }    

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
        .IsRequired();       

        builder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        builder.Entity<User>()
            .HasMany(sc => sc.UserCalendars)
            .WithOne(s => s.User)
            .HasForeignKey(usc => usc.UserId)
        .IsRequired();

        builder.Entity<Calendar>()
            .HasMany(sc => sc.UserCalendars)
            .WithOne(s => s.Calendar)
            .HasForeignKey(sc => sc.CalendarId)
            .IsRequired();

        builder.Entity<UserCalendar>()
            .HasKey(sc => new { sc.UserId, sc.CalendarId });

        builder.Entity<Notification>()
            .HasMany(un => un.UserNotifications)
            .WithOne(u => u.Notification)
            .HasForeignKey(un => un.NotificationId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();

        builder.Entity<UserNotification>()
            .HasKey(un => new { un.UserId, un.NotificationId });

        builder.Entity<Menu>()
            .HasIndex(m => new { m.DayOfWeek, m.TypeFoodId })
            .IsUnique();

        builder.Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);               

        
    }
}
