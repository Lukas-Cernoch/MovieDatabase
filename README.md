# 🎬 MovieDatabase API

RESTful webové API vytvořené v **ASP.NET Core** pro správu filmů a režisérů. Projekt využívá moderní architekturu, relační databázi PostgreSQL a obsahuje komplexní integrační testy pokrývající celý životní cyklus entit. Vznikl jako .NET protějšek dřívějšího Java/Spring Boot projektu [Java-Book-Database](https://github.com/Lukas-Cernoch/Java-Book-Database), pro srovnání stejného konceptu ve dvou různých ekosystémech.

## 🛠️ Použité technologie a knihovny

- **Platforma:** .NET (C#)
- **Webový framework:** ASP.NET Core Web API
- **ORM a databáze:** Entity Framework Core, PostgreSQL (běžící v Dockeru)
- **Mapování:** AutoMapper (oddělení databázových entit od DTO)
- **Validace:** FluentValidation
- **Dokumentace API:** Swashbuckle (Swagger/OpenAPI)
- **Testování:** xUnit, WebApplicationFactory (integrační testy)
- **Částečná aktualizace:** JSON Patch (standard RFC 6902) s využitím Newtonsoft.Json

## 🗃️ Datový model

### Director (Režisér)
- `Id` (Guid) — primární klíč
- `Name` (string) — jméno režiséra (povinné, max. 100 znaků)
- `DateOfBirth` (DateOnly) — datum narození (povinné, nesmí být v budoucnosti)
- `Nationality` (string) — národnost (povinná)

### Movie (Film)
- `ImdbId` (string) — primární klíč (např. `"tt0816692"`)
- `Title` (string) — název filmu (povinné)
- `ReleaseYear` (int) — rok vydání (platný rozsah 1888 až současnost + 5 let)
- `Genre` (string) — žánr filmu
- `RuntimeMinutes` (int) — délka filmu v minutách (musí být striktně větší než 0)
- `DirectorId` (Guid) — cizí klíč na `Director` (nastaveno kaskádové mazání)

## 📮 Přehled API endpointů

### Directors

| Metoda | Cesta | Popis |
|---|---|---|
| `GET` | `/directors` | seznam všech registrovaných režisérů |
| `GET` | `/directors/{id}` | detail konkrétního režiséra podle Guid |
| `POST` | `/directors` | vytvoření nového režiséra |
| `PUT` | `/directors/{id}` | kompletní aktualizace (výměna celého objektu) |
| `PATCH` | `/directors/{id}` | částečná aktualizace pomocí pole JSON Patch operací |
| `DELETE` | `/directors/{id}` | smazání režiséra a kaskádové smazání jeho filmů |

### Movies

| Metoda | Cesta | Popis |
|---|---|---|
| `GET` | `/movies` | seznam filmů |
| `GET` | `/movies/{imdbId}` | detail filmu |
| `POST` | `/movies` | vytvoření filmu (vyžaduje existující `DirectorId`) |
| `PUT` | `/movies/{imdbId}` | create-or-update — vytvoří film, pokud neexistuje, jinak ho kompletně přepíše |
| `PATCH` | `/movies/{imdbId}` | částečná úprava pomocí JSON Patch instrukcí |
| `DELETE` | `/movies/{imdbId}` | smazání záznamu o filmu |

## ✅ Zpracování a validace (FluentValidation)

Validace vstupních dat je řešena odděleně od logiky kontrolerů pomocí **FluentValidation**. Každý příchozí DTO objekt při požadavcích `POST`, `PUT` a `PATCH` je automaticky ověřen na shodu se stanovenými pravidly definovanými ve validačních třídách. Pokud data nevyhovují (např. chybí povinné pole, délka filmu je menší než 0), API požadavek automaticky zamítne se stavovým kódem `400 Bad Request` a vrátí detailní zprávu o tom, která pole selhala.

## 🚀 Spuštění projektu

### Požadavky
- .NET SDK
- Docker a Docker Compose
- EF Core nástroje: `dotnet tool install --global dotnet-ef`

### Postup
1. Spusťte databázový server PostgreSQL (např. pomocí připraveného kontejneru v Dockeru):
   ```bash
   docker-compose up -d
   ```
2. Aplikujte databázové schéma:
   ```bash
   dotnet ef database update
   ```
3. Spusťte webový server pomocí Visual Studia nebo příkazové řádky:
   ```bash
   dotnet run
   ```
4. Otevřete prohlížeč na adrese `http://localhost:<VÁŠ_PORT>/swagger` pro zobrazení interaktivní dokumentace API.

## 🧪 Testování

Systém obsahuje plnohodnotné integrační testy využívající **xUnit** a **WebApplicationFactory**. Tyto testy spouští kompletní HTTP infrastrukturu aplikace v paměti a ověřují skutečné fungování databázových operací, mapování, validací a návratových HTTP kódů.

Testy lze hromadně spustit z Test Exploreru ve Visual Studiu, nebo přes terminál:
```bash
dotnet test
```

## 📬 Postman kolekce

Pro usnadnění prozkoumávání API a manuálního testování projekt zahrnuje soubor `postman_collection.json`. Jedná se o Postman kolekci ve formátu verze 2.1.0, obsahující přednastavené šablony nejběžnějších požadavků jako `POST`, `GET`, `PATCH` nebo `DELETE`, které využívají formát těla typu `raw` JSON. Soubor lze přímo naimportovat do aplikace Postman.

## 👤 Autor

**Lukáš Černoch**
[GitHub](https://github.com/Lukas-Cernoch)
