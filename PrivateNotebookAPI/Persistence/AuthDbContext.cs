using Microsoft.EntityFrameworkCore;
using PrivateNotebookAPI.DbModels;

namespace PrivateNotebookAPI.Persistence
{
    public class AuthDbContext : DbContext, IAuthDbContext
    {
        public DbSet<User> Users { get; set; }

        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
    }
}

