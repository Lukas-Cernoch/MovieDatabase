using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc.Testing;
using MovieDatabase.Domain.Dto;
using Newtonsoft.Json;
using Xunit;

namespace MovieDatabase.Tests
{
    public class MovieControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public MovieControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        private async Task<DirectorDto> CreateTestDirector(HttpClient client, string name = null)
        {
            var dto = new DirectorDto
            {
                Name = name ?? "Movie Test Director",
                DateOfBirth = new DateOnly(1975, 1, 1),
                Nationality = "CZ"
            };

            var resp = await client.PostAsJsonAsync("/directors", dto);
            resp.EnsureSuccessStatusCode();
            return await resp.Content.ReadFromJsonAsync<DirectorDto>()!;
        }

        [Fact]
        public async Task MovieCrud_Workflow_AllOperationsSucceed()
        {
            var client = _factory.CreateClient();

            // create director
            var director = await CreateTestDirector(client);

            // create movie
            var imdbId = "tt" + Guid.NewGuid().ToString("N").Substring(0, 7);
            var movie = new MovieDto
            {
                ImdbId = imdbId,
                Title = "Integration Test Movie",
                ReleaseYear = 2020,
                Genre = "Drama",
                RuntimeMinutes = 120,
                DirectorId = director.Id
            };

            var postResp = await client.PostAsJsonAsync("/movies", movie);
            Assert.Equal(HttpStatusCode.Created, postResp.StatusCode);

            var created = await postResp.Content.ReadFromJsonAsync<MovieDto>();

            // GET by id
            var getResp = await client.GetAsync($"/movies/{imdbId}");
            Assert.Equal(HttpStatusCode.OK, getResp.StatusCode);

            // GET all (page)
            var listResp = await client.GetAsync("/movies?page=1&pageSize=10");
            Assert.Equal(HttpStatusCode.OK, listResp.StatusCode);
            var list = await listResp.Content.ReadFromJsonAsync<List<MovieDto>>();
            Assert.Contains(list!, m => m.ImdbId == imdbId);

            // PUT (update)
            movie.Title = "Integration Test Movie Updated";
            var putResp = await client.PutAsJsonAsync($"/movies/{imdbId}", movie);
            Assert.True(putResp.StatusCode == HttpStatusCode.NoContent || putResp.StatusCode == HttpStatusCode.Created);

            // PATCH (partial update)
            var patch = new JsonPatchDocument<MovieDto>();
            patch.Replace(m => m.Genre, "Thriller");
            var patchContent = new StringContent(JsonConvert.SerializeObject(patch), Encoding.UTF8, "application/json-patch+json");
            var patchResp = await client.PatchAsync($"/movies/{imdbId}", patchContent);
            Assert.Equal(HttpStatusCode.NoContent, patchResp.StatusCode);

            // DELETE
            var delResp = await client.DeleteAsync($"/movies/{imdbId}");
            Assert.Equal(HttpStatusCode.NoContent, delResp.StatusCode);

            // ensure not found
            var getAfterDel = await client.GetAsync($"/movies/{imdbId}");
            Assert.Equal(HttpStatusCode.NotFound, getAfterDel.StatusCode);
        }
    }
}
