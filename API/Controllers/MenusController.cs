using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MenusController(IUnitOfWork unitOfWork, DataContext context,
    IMapper mapper) : BaseApiController
    {
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var menus = await unitOfWork.MenuRepository.GetMenusAsync();
            
            return Ok(menus);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuDto>> GetMenuById(int id)
        {
            var menu = await unitOfWork.MenuRepository.GetMenuByIdAsync(id);

            return Ok(menu);
        }

        [Authorize(Policy = "RequireAdminRole")]        
        [HttpPost]
        public async Task<ActionResult> AddMenu([FromBody] Menu menu)
        {
            unitOfWork.MenuRepository.Add(menu);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to add the menu");
        }

        [Authorize(Policy = "RequireAdminRole")]        
        [HttpPut]
        public async Task<ActionResult> EditMenu([FromBody] Menu menu)
        {
            unitOfWork.MenuRepository.Update(menu);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update the user");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete]
        public async Task<ActionResult> DeleteMenuById(int id)
        {            
            unitOfWork.MenuRepository.Delete(id);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update the user");            
        }              
    }
}
