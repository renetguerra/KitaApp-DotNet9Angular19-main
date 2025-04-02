namespace API.Entities;

public class UserLike
{
    // navigation properties in EF need to be initialised to null so
    // use the null forgiving operator for these
    public virtual User SourceUser { get; set; } = null!;
    public int SourceUserId { get; set; }
    public virtual User TargetUser { get; set; } = null!;
    public int TargetUserId { get; set; }
}
