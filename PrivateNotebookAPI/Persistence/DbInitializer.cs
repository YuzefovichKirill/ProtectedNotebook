namespace PrivateNotebookAPI.Persistence
{
    public class DbInitializer
    {
        public static void Initialize(AuthDbContext context)
        {
            //context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
        }
    }
}
