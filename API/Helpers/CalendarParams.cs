using API.Helpers;

namespace API;

public class CalendarParams : PaginationParams
{
    public string? Username { get; set; }
    public string Container { get; set; } = "Unread";
}
