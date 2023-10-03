using System.Security.Cryptography;
using System.Text;

namespace PrivateNotebookAPI.Crypto
{
    public class Hash
    {
        public static byte[] GetHash(string inputString) =>
            SHA512.HashData(Encoding.UTF8.GetBytes(inputString));

        public static string GetHashString(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }
    }
}
