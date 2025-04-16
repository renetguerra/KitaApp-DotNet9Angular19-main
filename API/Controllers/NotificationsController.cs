using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class NotificationsController(UserManager<User> userManager, IUnitOfWork unitOfWork, DataContext context,
    IMapper mapper) : BaseApiController
    {        
        [HttpGet("availables-notifications")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAvailablesNotifications()
        {
            
            var notifications = await unitOfWork.NotificationRepository.GetNotifications();
            var notificationsDto = mapper.Map<IEnumerable<NotificationDto>>(notifications);

            return Ok(notificationsDto);
        }

        [HttpGet("generic-list")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {

            var notifications = await unitOfWork.NotificationRepository.GetNotifications();
            var notificationsDto = mapper.Map<IEnumerable<NotificationDto>>(notifications);

            return Ok(notificationsDto);
        }

        [HttpGet("user-notifications/{username}")]
        public async Task<ActionResult<IEnumerable<UserNotificationDto>>> GetAssignedNotifications(string username)
        {            
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var userNotifications = await unitOfWork.NotificationRepository.GetNotificationsForUser(user.Id);

            if (User.Identity.Name == username)
            {
                if (userNotifications.Count() > 0)
                {
                    foreach (var userNotification in userNotifications)
                    {
                        var notification = new UserNotification
                        {
                            UserId = user.Id,
                            NotificationId = userNotification.Notification.Id,
                            NotificationSent = userNotification.NotificationSent,
                            IsDone = userNotification.IsDone,
                            DateRead = DateTime.UtcNow
                        };                        
                        unitOfWork.NotificationRepository.UpdateUserNotification(notification);
                    }
                    if (await unitOfWork.Complete()) return Ok(userNotifications);
                }
            }

            return Ok(userNotifications);            
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost]
        public async Task<ActionResult> CreateNotifications(Notification notification)
        {
            unitOfWork.NotificationRepository.Add(notification);

            if (await unitOfWork.Complete()) return Ok(mapper.Map<NotificationDto>(notification));

            return BadRequest("Failed to save calendar");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut]
        public async Task<ActionResult> UpdateNotification([FromBody] Notification notification)
        {                       
            unitOfWork.NotificationRepository.Update(notification);

            if (await unitOfWork.Complete()) return Ok(mapper.Map<NotificationDto>(notification));

            return BadRequest("Failed to save calendar");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete]
        public async Task<ActionResult> RemoveNotifications([FromBody] Notification notification)
        {
            var userNotifications = await unitOfWork.NotificationRepository.GetUserNotificationsByNotificationId(notification.Id);

            if (userNotifications.Count() == 0)
                unitOfWork.NotificationRepository.Remove(notification);
            else
                return BadRequest(new { message = "This notification is using and is impossible to be removed" });

            if (await unitOfWork.Complete()) return Ok(mapper.Map<NotificationDto>(notification));

            return BadRequest("Failed to save calendar");
        }

        [HttpDelete("{id}/{username}")]
        public async Task<ActionResult> DeleteUserNotification(int id, string username)
        {            
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var userNotifications = await unitOfWork.NotificationRepository.GetNotificationsForUser(user.Id);

            var userNotificationDto = userNotifications.FirstOrDefault(un => un.Notification.Id == id);

            var userNotification = new UserNotification
            {
                UserId = user.Id,
                NotificationId = id,
                NotificationSent = userNotificationDto.NotificationSent,
                IsDone = true,
                DateRead = userNotificationDto.DateRead
            };

            if (userNotification == null) return BadRequest("Cannot delete this calendar event");

            if (userNotification != null)
            {
                unitOfWork.NotificationRepository.DeleteUserNotification(userNotification);
            }

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Problem deleting the notification");
        }
    }
}
