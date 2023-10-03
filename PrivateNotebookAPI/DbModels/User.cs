using System.Numerics;

namespace PrivateNotebookAPI.DbModels
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public BigInteger RSAOpenKey { get; set; }
        public string PasswordHash { get; set; }
    }
}
