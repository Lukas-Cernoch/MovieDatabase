using System.Net;
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
    public class DirectorControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public DirectorControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetAllDirectors_ReturnsOk()
        {
            var client = _factory.CreateClient();

            var response = await client.GetAsync("/directors");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task PostDirector_ReturnsCreated()
        {
            var client = _factory.CreateClient();

            var dto = new DirectorDto
            {
                Name = "Integration Director",
                DateOfBirth = new DateOnly(1970, 1, 1),
                Nationality = "CZ"
            };

            var response = await client.PostAsJsonAsync("/directors", dto);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        [Fact]
        public async Task GetDirectorById_ReturnsOk()
        {
            var client = _factory.CreateClient();

            // create
            var dto = new DirectorDto
            {
                Name = "Director For Get",
                DateOfBirth = new DateOnly(1980, 2, 2),
                Nationality = "CZ"
            };

            var createResp = await client.PostAsJsonAsync("/directors", dto);
            createResp.EnsureSuccessStatusCode();
            var created = await createResp.Content.ReadFromJsonAsync<DirectorDto>();

            // get by id
            var getResp = await client.GetAsync($"/directors/{created!.Id}");
            Assert.Equal(HttpStatusCode.OK, getResp.StatusCode);
        }

        [Fact]
        public async Task DeleteDirector_ReturnsNoContent()
        {
            var client = _factory.CreateClient();

            var dto = new DirectorDto
            {
                Name = "Director For Delete",
                DateOfBirth = new DateOnly(1990, 3, 3),
                Nationality = "CZ"
            };

            var createResp = await client.PostAsJsonAsync("/directors", dto);
            createResp.EnsureSuccessStatusCode();
            var created = await createResp.Content.ReadFromJsonAsync<DirectorDto>();

            var delResp = await client.DeleteAsync($"/directors/{created!.Id}");
            Assert.Equal(HttpStatusCode.NoContent, delResp.StatusCode);
        }
    }
}
