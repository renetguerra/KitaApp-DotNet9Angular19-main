using API.Entities;

namespace API.Interfaces;

public interface IGalleryRepository
{    
    Task<Gallery?> GetPhotoById(int id);
    Task<IEnumerable<Gallery?>> GetPhotos();
    void AddPhoto(Gallery photo);
    void RemovePhoto(Gallery photo);
}
