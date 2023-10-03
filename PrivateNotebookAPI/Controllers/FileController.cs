using System.IO;
using Microsoft.AspNetCore.Mvc;
using PrivateNotebookAPI.Crypto;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;

namespace PrivateNotebookAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private IAuthDbContext _authDbContext;

        public FileController(IAuthDbContext authDbContext) =>
            _authDbContext = authDbContext;

        [HttpPost]
        [Route("textbook/{id}")]
        public async Task<ActionResult> CreateFile(Guid id, [FromBody] CreateFile createFile)
        {
            string path = @$"UserFiles\{id}\{createFile.FileName}.txt";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (System.IO.File.Exists(path)) return BadRequest("File with such name already exists");
            // create file
            using (StreamWriter sw = System.IO.File.CreateText(path))
            {
                sw.Write(createFile.Content);
            }
            return NoContent();
        }

        [HttpGet]
        [Route("textbook/{id}")]
        public async Task<ActionResult<GetFileVm>> GetFile(Guid id, [FromBody] GetFile getFile)
        {
            string path = @$"UserFiles\{id}\{getFile.FileName}.txt";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists(@$"\{id}\{getFile.FileName}.txt")) return NotFound("File with such name does not exist");
            // read file and send content encr by session key
            string content = System.IO.File.ReadAllText(path);
            string sessionKey = Serpent.CreateSessionKey();
            string encrSessionKey = RSA.Encrypt(user.RSAOpenKey, sessionKey);
            string encrContent = Serpent.Encrypt(sessionKey, content);
            return new GetFileVm() { SessionKey = encrSessionKey, Content = encrContent};
        }

        [HttpPatch]
        [Route("textbook/{id}")]
        public async Task<ActionResult> PatchFile(Guid id, [FromBody] PatchFile patchFile)
        {
            string path = @$"UserFiles\{id}\{patchFile.FileName}.txt";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists($"/{id}/{patchFile.FileName}.txt")) return NotFound("File with such name does not exist");
            // change file content
            System.IO.File.WriteAllText(path, patchFile.Content);
            return NoContent();
        }

        [HttpDelete]
        [Route("textbook/{id}")]
        public async Task<ActionResult> DeleteFile(Guid id, [FromBody] DeleteFile deleteFile)
        {
            string path = @$"UserFiles\{id}\{deleteFile.FileName}.txt";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // delete file
            System.IO.File.Delete(path);
            return NoContent();
        }
    }
}
