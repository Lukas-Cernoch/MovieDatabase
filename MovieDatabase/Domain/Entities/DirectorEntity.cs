using System;
using System.Collections.Generic;

namespace MovieDatabase.Domain.Entities
{
    public class DirectorEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string Nationality { get; set; } = string.Empty;

        public ICollection<MovieEntity> Movies { get; set; } = new List<MovieEntity>();
    }
}
