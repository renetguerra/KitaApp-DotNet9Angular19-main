using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("FamilyMemberPhotos")]
    public class FamilyMemberPhoto : Photo
    {
        public int Id { get; set; }
        public int FamilyMemberId { get; set; }
        public virtual FamilyMember FamilyMember { get; set; } = null!;
    }
}