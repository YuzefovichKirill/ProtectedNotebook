using Microsoft.AspNetCore.Mvc;
using PrivateNotebookAPI.Crypto;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;
using System.Numerics;
using System.Text;

namespace PrivateNotebookAPI.Controllers
{
    [Route("api/[controller]s")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private IAuthDbContext _authDbContext;

        public FileController(IAuthDbContext authDbContext) =>
            _authDbContext = authDbContext;

        [HttpPost]
        [Route("{id}")]
        public async Task<ActionResult> CreateFile(Guid id, [FromBody] CreateFile createFile)
        {
            string path = @$"UserFiles\{id}\{createFile.Filename}";
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

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<GetFileVm>> GetFile(Guid id, [FromBody] GetFile getFile)
        {
            string path = @$"UserFiles\{id}\{getFile.Filename}";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // read file and send content encr by session key
            string content = System.IO.File.ReadAllText(path);
            BigInteger sessionKey = Serpent.CreateSessionKey();

            string encrSessionKey = RSA.Encrypt(user.RSAOpenKey, user.RSAModule, sessionKey);
            string encrContent = Serpent.Encrypt(sessionKey, content);
            return new GetFileVm() { SessionKey = encrSessionKey, Content = encrContent };
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<GetFileListVm>> GetFileList(Guid id)
        {
            string path = @$"UserFiles\{id}";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.Directory.Exists(path)) return NotFound("File with such name does not exist");
            var files = Directory.GetFiles(path);
            List<string> filenames = new List<string>();
            foreach (var file in files)
                   filenames.Add(Path.GetFileName(file));
            return new GetFileListVm() { Filenames =  filenames };
        }

        [HttpPatch]
        [Route("{id}")]
        public async Task<ActionResult> PatchFile(Guid id, [FromBody] PatchFile patchFile)
        {
            string path = @$"UserFiles\{id}\{patchFile.Filename}";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // change file content
            System.IO.File.WriteAllText(path, patchFile.Content);
            return NoContent();
        }

        [HttpDelete]
        [Route("{id}&{filename}")]
        public async Task<ActionResult> DeleteFile(Guid id, string filename)
        {
            string path = @$"UserFiles\{id}\{filename}";
            var user = _authDbContext.Users.FirstOrDefault(u => u.Id == id);
            if (user is null) return NotFound("User was not found");
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // delete file
            System.IO.File.Delete(path);
            return NoContent();
        }
    }
}
