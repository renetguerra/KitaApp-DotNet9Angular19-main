using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class GalleryRepository(DataContext context) : IGalleryRepository
{
    public async Task<Gallery?> GetPhotoById(int id)
    {
        return await context.Galleries
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
    }     

    public void RemovePhoto(Gallery photo)
    {
        context.Galleries.Remove(photo);
    }

    public async Task<IEnumerable<Gallery?>> GetPhotos()
    {
        return await context.Galleries.ToListAsync();
    }

    public void AddPhoto(Gallery photo)
    {
        context.Galleries.Add(photo);
    }
}
