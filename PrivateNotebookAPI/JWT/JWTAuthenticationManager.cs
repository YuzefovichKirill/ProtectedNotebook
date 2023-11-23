using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PrivateNotebookAPI.Crypto;
using PrivateNotebookAPI.DbModels;
using PrivateNotebookAPI.Models;
using PrivateNotebookAPI.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PrivateNotebookAPI.JWT
{
    public class JWTAuthenticationManager : IJWTAuthenticationManager
    {
        private readonly string _tokenKey;

        public JWTAuthenticationManager(string tokenKey)
        {
            _tokenKey = tokenKey;
        }

        public async Task<string?> CreateJWT(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_tokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
