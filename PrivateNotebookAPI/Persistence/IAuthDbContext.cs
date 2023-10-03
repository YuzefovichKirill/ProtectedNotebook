using Microsoft.EntityFrameworkCore;
using PrivateNotebookAPI.DbModels;

namespace PrivateNotebookAPI.Persistence
{
    public interface IAuthDbContext
    {
        public DbSet<User> Users { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
