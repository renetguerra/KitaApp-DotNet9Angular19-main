using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API;

public interface IUserRepository
{
    void Update(User user);
    Task<IEnumerable<User>> GetUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
    Task<MemberDto?> GetMemberAsync(string username, bool isCurrentUser);
    Task<User?> GetUserByPhotoId(int photoId); 
}
