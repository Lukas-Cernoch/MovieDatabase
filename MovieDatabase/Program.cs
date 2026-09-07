using Microsoft.EntityFrameworkCore;
using MovieDatabase.Data;
using FluentValidation;
using FluentValidation.AspNetCore;

// Změna: Z CreateSlimBuilder na standardní CreateBuilder
var builder = WebApplication.CreateBuilder(args);

// --- 1. REGISTRACE SLUŽEB ---

// Přidání podpory pro klasické Kontrolery (MovieController, DirectorController)
builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddFluentValidationAutoValidation(); // Zapne automatické vracení HTTP 400 při chybě
builder.Services.AddValidatorsFromAssemblyContaining<Program>(); // Najde všechny validátory v projektu

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
public partial class Program { }