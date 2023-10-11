namespace PrivateNotebookAPI.Models
{
    public class GetFileVm
    {
        public string SessionKey { get; set; }
        public string IV { get; set; }
        public string Content { get; set; }
    }
}
