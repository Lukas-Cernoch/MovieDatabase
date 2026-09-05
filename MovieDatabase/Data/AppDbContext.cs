using Microsoft.EntityFrameworkCore;
using MovieDatabase.Domain.Entities;

namespace MovieDatabase.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MovieEntity> Movies { get; set; } = null!;
        public DbSet<DirectorEntity> Directors { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelbuilder)
        { 
            base.OnModelCreating(modelbuilder);

            modelbuilder.Entity<MovieEntity>()
                .HasKey(m => m.ImdbId);

            modelbuilder.Entity<MovieEntity>()
                .HasOne(m => m.Director)
                .WithMany(d => d.Movies)
                .HasForeignKey(m => m.DirectorId);
        }
    }
}
