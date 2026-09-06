using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieDatabase.Data;
using MovieDatabase.Domain.Dto;
using MovieDatabase.Domain.Entities;

namespace MovieDatabase.Controllers
{
    [ApiController]
    [Route("movies")]
    public class MovieController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public MovieController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET /movies?page=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            var skip = (page - 1) * pageSize;

            var movies = await _context.Movies
                .AsNoTracking()
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<MovieDto>>(movies);
            return Ok(dtos);
        }

        [HttpGet("{imdbId}")]
        public async Task<ActionResult<MovieDto>> GetByImdbId(string imdbId)
        {
            var movie = await _context.Movies.FindAsync(imdbId);
            if (movie == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<MovieDto>(movie));
        }

        [HttpPost]
        public async Task<ActionResult<MovieDto>> Create(MovieDto movieDto)
        {
            if (string.IsNullOrWhiteSpace(movieDto.ImdbId))
            {
                return BadRequest("ImdbId is required.");
            }

            var exists = await _context.Movies.AnyAsync(m => m.ImdbId == movieDto.ImdbId);
            if (exists)
            {
                return Conflict("Movie with given ImdbId already exists.");
            }

            var entity = _mapper.Map<MovieEntity>(movieDto);
            _context.Movies.Add(entity);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<MovieDto>(entity);
            return CreatedAtAction(nameof(GetByImdbId), new { imdbId = entity.ImdbId }, createdDto);
        }

        [HttpDelete("{imdbId}")]
        public async Task<IActionResult> Delete(string imdbId)
        {
            var movie = await _context.Movies.FindAsync(imdbId);
            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
