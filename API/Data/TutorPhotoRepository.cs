using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class TutorPhotoRepository(DataContext context) : ITutorPhotoRepository
{
    public async Task<TutorPhoto?> GetPhotoById(int id)
    {
        return await context.TutorPhotos
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.TutorPhotos
            .IgnoreQueryFilters()
            .Where(p => !p.IsApproved)
            .Select(p => new PhotoForApprovalDto
            {
                Id = p.Id,
                Username = p.Tutor.Email,
                Url = p.Url,
                IsApproved = p.IsApproved
            }).ToListAsync();
    }   

    public void RemovePhoto(TutorPhoto photo)
    {
        context.TutorPhotos.Remove(photo);
    }
}
