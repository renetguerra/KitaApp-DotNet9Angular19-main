using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{    
    public class MenuRepository : IMenuRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MenuRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void Add(Menu menu)
        {
            _context.Menus.Add(menu);
        }

        public void Delete(int id)
        {
            var menu = _context.Menus.Find(id);

            _context.Menus.Attach(menu);
            _context.Entry(menu).State = EntityState.Modified;
        }
        
        public async Task<ICollection<Menu>> GetMenuByTypeFoodAsync(int typeFoodId)
        {
            return await _context.Menus.Where(s => s.TypeFoodId == typeFoodId).ToListAsync();
        }

        public async Task<Menu> GetMenuByIdAsync(int id)
        {
            return await _context.Menus.FindAsync(id);
        }

        public async Task<Menu> GetMenuByTitleAsync(string title)
        {
            return await _context.Menus.FirstOrDefaultAsync(c => c.Title == title);
        }

        public async Task<IEnumerable<Menu>> GetMenusAsync()
        {
            return await _context.Menus.ToListAsync();
        }

        public void Remove(Menu menu)
        {
            _context.Menus.Remove(menu);
        }

        public void Update(Menu menu)
        {
            _context.Menus.Attach(menu);
            _context.Entry(menu).State = EntityState.Modified;
        }
    }
}
