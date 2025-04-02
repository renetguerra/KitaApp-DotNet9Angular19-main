using System.Security.Policy;

namespace API.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public required string Street { get; set; }
        public required string StreetNumber { get; set; }
        public required string PostalCode { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public bool IsPrimaryResidence { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}