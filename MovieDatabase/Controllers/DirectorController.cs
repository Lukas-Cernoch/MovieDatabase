using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieDatabase.Data;
using System.Runtime.InteropServices;
using MovieDatabase.Domain.Entities;
using MovieDatabase.Domain.Dto;

namespace MovieDatabase.Controllers
{
    [ApiController]
    [Route("directors")]
    public class DirectorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DirectorController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DirectorDto>>> GetAll()
        {
            var directors = await _context.Directors.ToListAsync();
            var dtos = _mapper.Map<List<DirectorDto>>(directors);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DirectorDto>> GetById(int id)
        {
            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<DirectorDto>(director));
        }

        [HttpPost]
        public async Task<ActionResult<DirectorDto>> Create(DirectorDto directorDto)
        {
            var entity = _mapper.Map<DirectorEntity>(directorDto);
            entity.Id = Guid.NewGuid();
            _context.Directors.Add(entity);
            await _context.SaveChangesAsync();
            var createdDto = _mapper.Map<DirectorDto>(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, createdDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound();
            }
            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
