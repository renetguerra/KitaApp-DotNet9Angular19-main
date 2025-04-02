using API.Entities;

namespace API.Interfaces;

public interface IUserPhotoRepository
{
    Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos();
    Task<UserPhoto?> GetPhotoById(int id);
    void RemovePhoto(UserPhoto photo);
}
