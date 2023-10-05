using System.Numerics;

namespace PrivateNotebookAPI.DbModels
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string? RSAOpenKey { get; set; }
        public string? RSAModule { get; set; }
        public string PasswordHash { get; set; }
    }
}
