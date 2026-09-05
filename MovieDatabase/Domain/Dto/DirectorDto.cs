using System;
using System.Collections.Generic;

namespace MovieDatabase.Domain.Dto
{
    public class DirectorDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string Nationality { get; set; } = string.Empty;
    }
}
