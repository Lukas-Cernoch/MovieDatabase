# Movie Database — specifikace projektu (.NET / ASP.NET Core)

Cvičný backendový projekt v ASP.NET Core, obdoba dřívějšího Java/Spring Boot projektu
`Java-Book-Database`, tentokrát na téma filmů a režisérů. Cílem je porovnat stejný koncept
ve dvou různých ekosystémech a procvičit si práci s AI agentem (GitHub Copilot Agent Mode)
ve Visual Studiu.

## Tech stack

| Vrstva | Technologie |
|---|---|
| Framework | ASP.NET Core Web API (.NET 8/9) |
| Jazyk | C# |
| ORM | Entity Framework Core |
| Databáze | PostgreSQL, spouštěná přes Docker Compose |
| Mapování DTO ↔ Entity | AutoMapper |
| Validace | FluentValidation nebo Data Annotations |
| Testy | xUnit + `WebApplicationFactory` (integrační testy) |
| Dokumentace API | Swagger / OpenAPI (`Swashbuckle.AspNetCore`) |
| Testování API | Postman |

## Struktura projektu

```
MovieDatabase/
├── Controllers/          # MovieController, DirectorController
├── Domain/
│   ├── Entities/          # MovieEntity, DirectorEntity
│   └── Dto/               # MovieDto, DirectorDto
├── Mappers/               # AutoMapper profily
├── Repositories/          # nebo přímo přes DbContext
├── Services/              # MovieService, DirectorService
├── Data/
│   └── AppDbContext.cs
├── Tests/                 # integrační testy
├── docker-compose.yml
└── Program.cs
```

## Datový model

### Director (obdoba Author)
- `Id` (Guid nebo int, PK)
- `Name` (string)
- `DateOfBirth` (DateOnly)
- `Nationality` (string)

### Movie (obdoba Book)
- `ImdbId` (string, PK — obdoba ISBN, aby šlo cvičit identifikátor jiný než auto-increment)
- `Title` (string)
- `ReleaseYear` (int)
- `Genre` (string)
- `RuntimeMinutes` (int)
- `DirectorId` (FK na Director)

## Endpointy

### Movies (`/movies`)

| Metoda | Cesta | Popis |
|---|---|---|
| GET | `/movies` | seznam, stránkovaně (`?page=1&pageSize=10`) |
| GET | `/movies/{imdbId}` | detail podle ImdbId |
| PUT | `/movies/{imdbId}` | vytvoření nebo úplná aktualizace (create-or-update) |
| PATCH | `/movies/{imdbId}` | částečná aktualizace přes `JsonPatchDocument<MovieDto>` |
| DELETE | `/movies/{imdbId}` | smazání |

### Directors (`/directors`)

| Metoda | Cesta | Popis |
|---|---|---|
| GET | `/directors` | seznam všech režisérů |
| GET | `/directors/{id}` | detail podle Id |
| POST | `/directors` | vytvoření nového režiséra |
| PUT | `/directors/{id}` | úplná aktualizace |
| PATCH | `/directors/{id}` | částečná aktualizace |
| DELETE | `/directors/{id}` | smazání |

## Požadavky navíc oproti Java verzi

- [ ] Swagger UI s automaticky generovanou dokumentací
- [ ] PATCH implementovaný přes JSON Patch (RFC 6902), ne ručně
- [ ] Volitelně: zkusit "minimal API" styl místo klasických kontrolerů u jednoho z endpointů
- [ ] Integrační testy pokrývající CRUD operace nad oběma entitami
- [ ] `docker-compose.yml` pro lokální PostgreSQL databázi
- [ ] Postman kolekce s ukázkovými requesty (export do repa jako `postman_collection.json`)
- [ ] `.gitignore` pro .NET (Visual Studio) — vyloučit `bin/`, `obj/`, `.vs/`
- [ ] Žádné natvrdo napsané citlivé údaje v kódu (connection string s heslem jen pro lokální Docker DB je v pořádku, stejně jako u Java verze)

## Doporučený postup s AI agentem (GitHub Copilot Agent Mode)

1. Zapnout Agent Mode ve Visual Studiu a přihlásit se GitHub účtem s Copilot přístupem.
2. Vložit tento soubor (`SPEC.md`) do kořene nového repozitáře — agent z něj čerpá kontext.
3. Zadávat úkoly po menších krocích, ne "udělej celý projekt najednou":
   1. scaffold projektu a `AppDbContext`
   2. entity a DTO
   3. `MovieController` a `DirectorController` s CRUD operacemi
   4. PATCH přes `JsonPatchDocument`
   5. integrační testy
   6. Swagger
4. Po každém kroku zkontrolovat diff, než se pokračuje dál.
5. Nechat agenta spustit `dotnet test` a iterativně opravit případné chyby.
6. U nejasných částí kódu se agenta doptat na vysvětlení — cílem je kódu rozumět, ne ho jen převzít.
