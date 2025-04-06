﻿using System.Reflection;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers.Enums;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class MessageHub(IUnitOfWork unitOfWork, 
    IMapper mapper, IHubContext<PresenceHub> presenceHub) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();        
        var otherUser = httpContext?.Request.Query["user"];

        if (Context.User.GetUsername() == otherUser.Value)
        {
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(Context.User.GetUsername());
            if (user?.UserRoles?.Any(r => r.Role.Name == "Member") == true)
            {
                otherUser = user.TutorId switch
                {
                    (int)TutorEnum.Karol => "carol",
                    (int)TutorEnum.Mandy => "mandy",
                    _ => "christine"
                };
            }            
        }                   

        if (Context.User == null || string.IsNullOrEmpty(otherUser))
            throw new Exception("Cannot join group");
        var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var group = await AddToGroup(groupName);

        await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

        var messages = await unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUsername(), otherUser!);

        if (unitOfWork.HasChanges()) await unitOfWork.Complete();

        await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var username = Context.User?.GetUsername() ?? throw new Exception("Could not get user");

        var (sender, recipient) = await GetSenderAndRecipient(username, createMessageDto.RecipientUsername);

        if (recipient == null || sender == null || sender.UserName == null || recipient.UserName == null)
            throw new HubException("Cannot send message at this time");

        await CreateMessageAndNotify(sender, recipient, createMessageDto);
    }

    private async Task<(User sender, User recipient)> GetSenderAndRecipient(string username, string recipientUsername)
    {
        User sender, recipient;

        if (username == recipientUsername.ToLower())
        {
            sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            recipientUsername = sender.TutorId switch
            {
                (int)TutorEnum.Karol => "carol",
                (int)TutorEnum.Mandy => "mandy",
                _ => "christine"
            };
            recipient = await unitOfWork.UserRepository.GetUserByUsernameAsync(recipientUsername);
        }
        else
        {
            sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            recipient = await unitOfWork.UserRepository.GetUserByUsernameAsync(recipientUsername);
        }

        return (sender, recipient);
    }

    private async Task CreateMessageAndNotify(User sender, User recipient, CreateMessageDto createMessageDto)
    {
        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };

        var groupName = GetGroupName(sender.UserName, recipient.UserName);
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);

        if (group != null && group.Connections.Any(x => x.Username == recipient.UserName))
        {
            message.DateRead = DateTime.UtcNow;
        }
        else
        {
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
            if (connections?.Count > 0)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                    new { username = sender.UserName, knownAs = sender.KnownAs });
            }
        }

        unitOfWork.MessageRepository.AddMessage(message);

        if (await unitOfWork.Complete())
        {
            await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
        }
    }

    private async Task<Group> AddToGroup(string groupName)
    {
        var username = Context.User?.GetUsername() ?? throw new Exception("Cannot get username");
        var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);
        var connection = new Connection{ConnectionId = Context.ConnectionId, Username = username};

        if (group == null)
        {
            group = new Group{Name = groupName};
            unitOfWork.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        if (await unitOfWork.Complete()) return group;

        throw new HubException("Failed to join group");
    }

    private async Task<Group> RemoveFromMessageGroup() 
    {
        var group = await unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        if (connection != null && group != null)
        {
            unitOfWork.MessageRepository.RemoveConnection(connection);
            if (await unitOfWork.Complete()) return group;
        }

        throw new Exception("Failed to remove from group");
    }

    private string GetGroupName(string caller, string? other) 
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }
}
