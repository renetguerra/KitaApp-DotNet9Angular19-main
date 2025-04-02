using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppRole : IdentityRole<int>
{
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
}
