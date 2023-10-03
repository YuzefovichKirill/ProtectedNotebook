using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using PrivateNotebookAPI.DbModels;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;
using System.Numerics;
using PrivateNotebookAPI.Crypto;

namespace PrivateNotebookAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthDbContext _authDbContext;

        public AuthController(IAuthDbContext authDbContext) =>
            _authDbContext = authDbContext;

        [HttpPost]
        [Route("auth/login")]
        public async Task<ActionResult<Guid>> Login([FromBody] Login login)
        {
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == login.Email);
            if (user is null) return NotFound("Wrong email or password");
            if (user.PasswordHash != Hash.GetHashString(login.Password)) return BadRequest("Wrong email or password");

            return Ok(user.Id);
        }

        [HttpPost]
        [Route("auth/register")]
        public async Task<ActionResult<Guid>> Register([FromBody] Register register)
        {
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == register.Email);
            if (user is not null) return BadRequest("This Email is already registered");

            Guid id = Guid.NewGuid();
            var passwordHash = _authDbContext.Users.Add(new User()
            {
                Id = id,
                Email = register.Email,
                PasswordHash = Hash.GetHashString(register.Password),
            });
            string path = $@"UserFiles\{id}";
            Directory.CreateDirectory(path);
            await _authDbContext.SaveChangesAsync();

            return Ok(id);
        }

        [HttpPatch]
        [Route("change-rsa-key/{id}")]
        public async Task<ActionResult> ChangeRSAKey(Guid id, [FromBody] BigInteger RSAKey)
        {
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            user.RSAOpenKey = RSAKey;
            await _authDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
