namespace MovieDatabase.Domain.Entities
{
    public class MovieEntity
    {
        public string ImdbId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int ReleaseYear { get; set; }
        public string Genre { get; set; } = string.Empty;
        public int RuntimeMinutes { get; set; }

        public Guid DirectorId { get; set; }
        public DirectorEntity? Director { get; set; }
    }
}
