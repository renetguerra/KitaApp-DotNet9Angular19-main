using API.Entities;

namespace API.Interfaces
{
    public interface IFamilyMemberPhotoRepository
    {
        Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos();
        Task<FamilyMemberPhoto?> GetPhotoById(int id);
        void RemovePhoto(FamilyMemberPhoto photo);
    }
}