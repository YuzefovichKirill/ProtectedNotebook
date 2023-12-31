﻿using Microsoft.AspNetCore.Mvc;
using PrivateNotebookAPI.Crypto;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;
using System.Numerics;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;
using System.Security.Cryptography;
using System.Text;

namespace PrivateNotebookAPI.Controllers
{
    [Route("api/[controller]s")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IAuthDbContext _authDbContext;
        private readonly string cipherKey;

        public FileController(IAuthDbContext authDbContext,
                              IConfiguration configuration)
        {
            _authDbContext = authDbContext;
            cipherKey = configuration.GetValue<string>("CipherKey");
        }

        [HttpPost]
        public async Task<ActionResult> CreateFile([FromBody] CreateFile createFile)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user is null) return NotFound("User was not found");

            string path = @$"UserFiles\{user.Id}\{createFile.Filename}";
            if (System.IO.File.Exists(path)) return BadRequest("File with such name already exists");
            // create file
            using FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate);
            using Aes aes = Aes.Create();
            byte[] key = Encoding.UTF8.GetBytes(cipherKey);
            aes.Key = key;
            aes.IV = key;
            using CryptoStream cryptoStream = new CryptoStream(fileStream, aes.CreateEncryptor(), CryptoStreamMode.Write);
            using StreamWriter encryptWriter = new StreamWriter(cryptoStream, Encoding.UTF8);
            encryptWriter.WriteLine(createFile.Content);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult<GetFileVm>> GetFile([FromBody] GetFile getFile)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user is null) return NotFound("User was not found");

            string path = @$"UserFiles\{user.Id}\{getFile.Filename}";
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // read file and send content encr by session key
            using FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate);
            using Aes aes = Aes.Create();
            byte[] key = Encoding.UTF8.GetBytes(cipherKey);
            aes.Key = key;
            aes.IV = key;
            using CryptoStream cryptoStream = new CryptoStream(fileStream, aes.CreateDecryptor(), CryptoStreamMode.Read);
            using StreamReader decryptReader = new StreamReader(cryptoStream, Encoding.UTF8);
            var content = decryptReader.ReadToEnd();

            BigInteger sessionKey = Serpent.CreateSessionKey();

            string encrSessionKey = Crypto.RSA.Encrypt(user.RSAOpenKey, user.RSAModule, sessionKey);
            (string iv, string encrContent) = Serpent.Encrypt(sessionKey, content);
            return new GetFileVm() { SessionKey = encrSessionKey, IV = iv, Content = encrContent };
        }

        [HttpGet]
        public async Task<ActionResult<GetFileListVm>> GetFileList()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user is null) return NotFound("User was not found");

            string path = @$"UserFiles\{user.Id}";
            if (!System.IO.Directory.Exists(path)) return NotFound("File with such name does not exist");
            var files = Directory.GetFiles(path);
            List<string> filenames = new List<string>();
            foreach (var file in files)
                   filenames.Add(Path.GetFileName(file));
            return new GetFileListVm() { Filenames =  filenames };
        }

        [HttpPatch]
        public async Task<ActionResult> PatchFile([FromBody] PatchFile patchFile)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user is null) return NotFound("User was not found");

            string path = @$"UserFiles\{user.Id}\{patchFile.Filename}";
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // change file content
            using FileStream fileStream = new FileStream(path, FileMode.Create);
            using Aes aes = Aes.Create();
            byte[] key = Encoding.UTF8.GetBytes(cipherKey);
            aes.Key = key;
            aes.IV = key;
            using CryptoStream cryptoStream = new CryptoStream(fileStream, aes.CreateEncryptor(), CryptoStreamMode.Write);
            using StreamWriter encryptWriter = new StreamWriter(cryptoStream, Encoding.UTF8);
            encryptWriter.WriteLine(patchFile.Content);

            return NoContent();
        }

        [HttpDelete]
        [Route("{filename}")]
        public async Task<ActionResult> DeleteFile(string filename)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var email = identity.FindFirst(ClaimTypes.Email).Value;
            var user = _authDbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user is null) return NotFound("User was not found");

            string path = @$"UserFiles\{user.Id}\{filename}";
            if (!System.IO.File.Exists(path)) return NotFound("File with such name does not exist");
            // delete file
            System.IO.File.Delete(path);
            return NoContent();
        }
    }
}
