using AutoMapper;
using MovieDatabase.Domain.Dto;
using MovieDatabase.Domain.Entities;

namespace MovieDatabase.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<DirectorEntity, DirectorDto>().ReverseMap();

            CreateMap<MovieEntity, MovieDto>().ReverseMap();
        }
    }
}
