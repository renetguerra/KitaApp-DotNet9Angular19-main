using API.Entities;

namespace API.Interfaces
{
    public interface ITutorPhotoRepository
    {
        Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos();
        Task<TutorPhoto?> GetPhotoById(int id);
        void RemovePhoto(TutorPhoto photo);
    }
}