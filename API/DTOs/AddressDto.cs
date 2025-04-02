namespace API.DTOs
{
    public class AddressDto
    {
        public int Id { get; set; }
        public required string Street { get; set; }
        public required string StreetNumber { get; set; }
        public required string PostalCode { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public bool IsPrimaryResidence { get; set; }
    }
}