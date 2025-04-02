namespace API.Helpers;

public class UserParams : PaginationParams
{
    public string? Gender { get; set; }
    public string? CurrentUsername { get; set; }
    public int MinAge { get; set; } = 0;
    public int MaxAge { get; set; } = 5;
    public string OrderBy { get; set; } = "lastActive";
    
}
