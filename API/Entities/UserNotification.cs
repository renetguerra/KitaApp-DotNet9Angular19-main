namespace API.Entities
{
    public class UserNotification
    {
        public int UserId { get; set; }
        public int NotificationId { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime? NotificationSent { get; set; } = DateTime.UtcNow;
        public bool IsDone { get; set; }
        public User User { get; set; } = null!;
        public Notification Notification { get; set; } = null!;
    }
}
