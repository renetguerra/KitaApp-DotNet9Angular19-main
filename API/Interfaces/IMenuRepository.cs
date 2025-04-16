using API.Entities;

namespace API.Interfaces
{
    public interface IMenuRepository
    {
        Task<IEnumerable<Menu>> GetMenusAsync();
        Task<Menu> GetMenuByIdAsync(int id);
        Task<Menu> GetMenuByTitleAsync(string title);
        Task<ICollection<Menu>> GetMenuByTypeFoodAsync(int typeFoodId);
        void Add(Menu menu);
        void Update(Menu menu);
        void Delete(int id);
        void Remove(Menu menu);
    }
}
