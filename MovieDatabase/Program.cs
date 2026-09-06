using Microsoft.EntityFrameworkCore;
using MovieDatabase.Data;

// Změna: Z CreateSlimBuilder na standardní CreateBuilder
var builder = WebApplication.CreateBuilder(args);

// --- 1. REGISTRACE SLUŽEB ---

// Přidání podpory pro klasické Kontrolery (MovieController, DirectorController)
builder.Services.AddControllers();

// Přidání Swaggeru (Swashbuckle) pro dokumentaci API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registrace AutoMapperu
builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<MovieDatabase.Mappers.MappingProfile>();
});

// Registrace databáze PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// --- 2. NASTAVENÍ HTTP PIPELINE ---

// Aktivace Swaggeru pouze ve vývojovém prostředí
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Spárování URL adres s našimi kontrolery
app.MapControllers();

app.Run();