using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class FamilyMemberPhotoRepository(DataContext context) : IFamilyMemberPhotoRepository
{
    public async Task<FamilyMemberPhoto?> GetPhotoById(int id)
    {
        return await context.FamilyMemberPhotos
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.FamilyMemberPhotos
            .IgnoreQueryFilters()
            .Where(p => !p.IsApproved)
            .Select(p => new PhotoForApprovalDto
            {
                Id = p.Id,
                Username = p.FamilyMember.Email,
                Url = p.Url,
                IsApproved = p.IsApproved
            }).ToListAsync();
    }   

    public void RemovePhoto(FamilyMemberPhoto photo)
    {
        context.FamilyMemberPhotos.Remove(photo);
    }
}
