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
    public DbSet<Address> Addresses { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
    public DbSet<FamilyMemberPhoto> FamilyMemberPhotos { get; set; }
    public DbSet<Tutor> Tutors { get; set; }
    public DbSet<TutorPhoto> TutorPhotos { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Calendar> Calendars { get; set; }    
    public DbSet<UserCalendar> UserCalendars { get; set; }
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

        builder.Entity<UserLike>()
            .HasKey(k => new { k.SourceUserId, k.TargetUserId });

        builder.Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
            .HasOne(s => s.TargetUser)
            .WithMany(l => l.LikedByUsers)
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);        

        //builder.Entity<FamilyMemberPhoto>().HasQueryFilter(f => f.IsApproved);
        //builder.Entity<UserPhoto>().HasQueryFilter(u => u.IsApproved);
        //builder.Entity<TutorPhoto>().HasQueryFilter(t => t.IsApproved);

        
    }
}
