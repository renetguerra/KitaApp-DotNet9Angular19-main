using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class UserRole : IdentityUserRole<int>
{
    // navigation properties in EF need to be initialised to null so
    // use the null forgiving operator for these
    public User User { get; set; } = null!;
    public AppRole Role { get; set; } = null!;
}
