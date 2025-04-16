using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Gallery")]
    public class Gallery : Photo
    {
        public int Id { get; set; }        
    }
}