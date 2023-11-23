using Microsoft.AspNetCore.Mvc;
using PrivateNotebookAPI.DbModels;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;
using PrivateNotebookAPI.Crypto;
using Microsoft.EntityFrameworkCore;
using PrivateNotebookAPI.JWT;
using System.Security.Claims;

namespace PrivateNotebookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthDbContext _authDbContext;
        private readonly IJWTAuthenticationManager _jwtAuthenticationManager;

        public AuthController(IAuthDbContext authDbContext, IJWTAuthenticationManager jwtAuthenticationManager)
        {
            _authDbContext = authDbContext;
            _jwtAuthenticationManager = jwtAuthenticationManager;
        }


        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<Guid>> Login([FromBody] Login login)
        {
            var user = await _authDbContext.Users.FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user is null) return NotFound("Wrong email or password");
            if (user.PasswordHash != Hash.GetHashString(login.Password)) return BadRequest("Wrong email or password");

            var token = await _jwtAuthenticationManager.CreateJWT(user);

            return Ok(token);
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<Guid>> Register([FromBody] Register register)
        {
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == register.Email);
            if (user is not null) return BadRequest("This Email is already registered");

            Guid id = Guid.NewGuid();
            _authDbContext.Users.Add(new User()
            {
                Id = id,
                Email = register.Email,
                PasswordHash = Hash.GetHashString(register.Password),
            });
            await _authDbContext.SaveChangesAsync();
            user = _authDbContext.Users.FirstOrDefault(u => u.Email == register.Email);
            if (user is null) return BadRequest("User wasn't registered");

            string path = $@"UserFiles\{id}";
            Directory.CreateDirectory(path);


            var token = await _jwtAuthenticationManager.CreateJWT(user);
            return Ok(token);
        }

        
        [HttpPatch]
        [Route("change-rsa-key")]
        public async Task<ActionResult> ChangeRSAKey([FromBody] ChangeRSAKey changeRSAKey)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);

            if (user is null) return NotFound("User was not found");
            user.RSAOpenKey = changeRSAKey.RSAKey;
            user.RSAModule = changeRSAKey.Module;
            await _authDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
