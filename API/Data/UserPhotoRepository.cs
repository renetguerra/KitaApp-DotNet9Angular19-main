using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserPhotoRepository(DataContext context) : IUserPhotoRepository
{
    public async Task<UserPhoto?> GetPhotoById(int id)
    {
        return await context.UserPhotos
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.UserPhotos
            .IgnoreQueryFilters()
            .Where(p => !p.IsApproved)
            .Select(p => new PhotoForApprovalDto
            {
                Id = p.Id,
                Username = p.User.UserName,
                Url = p.Url,
                IsApproved = p.IsApproved
            }).ToListAsync();
    }   

    public void RemovePhoto(UserPhoto photo)
    {
        context.UserPhotos.Remove(photo);
    }
}
