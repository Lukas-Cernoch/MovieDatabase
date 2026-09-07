using FluentValidation;
using MovieDatabase.Domain.Dto;
using System;

namespace MovieDatabase.Validators
{
    public class MovieDtoValidator : AbstractValidator<MovieDto>
    {
        public MovieDtoValidator()
        {
            RuleFor(x => x.ImdbId)
                .NotEmpty().WithMessage("ImdbId je povinné.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Název filmu je povinný.");

            RuleFor(x => x.ReleaseYear)
                .InclusiveBetween(1888, DateTime.Now.Year + 5).WithMessage("Neplatný rok vydání.");

            RuleFor(x => x.RuntimeMinutes)
                .GreaterThan(0).WithMessage("Délka filmu musí být větší než 0.");
        }
    }
}