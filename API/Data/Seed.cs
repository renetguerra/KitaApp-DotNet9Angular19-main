using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<User> userManager, RoleManager<AppRole> roleManager, DataContext context)
    {
        if (await userManager.Users.AnyAsync()) return;

        var studentData = await File.ReadAllTextAsync("Data/Seed/UserSeedData.json");        

        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

        var users = JsonSerializer.Deserialize<List<User>>(studentData, options);

        if (users == null) return;

        var roles = new List<AppRole>
        {
            new() {Name = "Member"},
            new() {Name = "Admin"},
            new() {Name = "Moderator"},
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        foreach (var user in users)
        {
            user.UserPhotos.First().IsApproved = true;            
            user.UserName = user.KnownAs!.ToLower();
            user.SecurityStamp = Guid.NewGuid().ToString();

            if (user.Tutor != null)
            {
                var existingTutor = await context.Tutors
                    .FirstOrDefaultAsync(t => t.Email == user.Tutor.Email);

                if (existingTutor != null)
                {
                    user.Tutor = existingTutor; 
                }
                else
                {
                    context.Tutors.Add(user.Tutor); 
                }
            }            

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        await context.SaveChangesAsync();

        var admin = new User
        {
            Name = "Admin",
            Surname = "Admin",
            UserName = "admin",
            KnownAs = "Admin",
            Gender = "",
            City = "",
            Country = "",
            Tutor = null!            
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
