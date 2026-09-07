using FluentValidation;
using MovieDatabase.Domain.Dto;
using System;

namespace MovieDatabase.Validators
{
    public class DirectorDtoValidator : AbstractValidator<DirectorDto>
    {
        public DirectorDtoValidator() 
        { 
            RuleFor(d => d.Name)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100).WithMessage("First name cannot exceed 100 characters.");

            RuleFor(x => x.DateOfBirth)
                .LessThan(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Date of birth must be in the past.");

            RuleFor(x => x.Nationality)
                .NotEmpty().WithMessage("Nationality is required.");
        }

    }
}
