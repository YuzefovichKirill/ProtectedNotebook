using PrivateNotebookAPI.DbModels;

namespace PrivateNotebookAPI.JWT
{
    public interface IJWTAuthenticationManager
    {
        public Task<string?> CreateJWT(User user);
    }
}
