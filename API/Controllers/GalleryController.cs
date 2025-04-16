using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GalleryController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController
    {
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetGalleries()
        {
            var photos = await unitOfWork.GalleryRepository.GetPhotos();

            return Ok(photos);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {            
            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var gallery = new Gallery
            {                
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            unitOfWork.GalleryRepository.AddPhoto(gallery);

            if (await unitOfWork.Complete())
                return Ok(mapper.Map<PhotoDto>(gallery));

            return BadRequest("Problem adding photo");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("delete-photo/{photoId:int}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {            
            var photo = await unitOfWork.GalleryRepository.GetPhotoById(photoId);

            if (photo == null || photo.IsMain) return BadRequest("This photo cannot be deleted");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            var gallery = await unitOfWork.GalleryRepository.GetPhotos();
            var galleryPhoto = gallery.FirstOrDefault(x => x.Id == photoId);
            if (galleryPhoto == null) return BadRequest("This photo is not in the gallery");            
            unitOfWork.GalleryRepository.RemovePhoto(galleryPhoto);

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Problem deleting photo");
        }
    }
}
