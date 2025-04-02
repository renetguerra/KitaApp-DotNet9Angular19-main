using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Photo
{
    // navigation properties in EF need to be initialised to null so
    // use the null forgiving operator for these    
    public required string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }
    public bool IsApproved { get; set; } = false;    
}