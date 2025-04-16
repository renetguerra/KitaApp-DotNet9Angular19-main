using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string Description { get; set; }
        //public DateTime? DateRead { get; set; }
        //public DateTime? NotificationSent { get; set; } = DateTime.UtcNow;
        //public bool IsDone { get; set; }

        [JsonIgnore]
        public virtual ICollection<UserNotification> UserNotifications { get; set; } = [];
    }
}
