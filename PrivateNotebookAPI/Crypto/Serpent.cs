using System.Text;

namespace PrivateNotebookAPI.Crypto
{
    public class Serpent
    {
        private static readonly int KeyLength = 128; // 128, 192, 256
        private static readonly int KeyLengthBytes = KeyLength/8;

        public static string Encrypt(string sessionKey, string content)
        {
            throw new NotImplementedException();
        }

        public static string CreateSessionKey()
        {
            StringBuilder sb = new();
            Random random = new();
            for (int i = 0; i < KeyLengthBytes; i++)
                sb.Append((char)random.Next(0, 256));
            return sb.ToString();

            /*Byte[] key = new Byte[KeyLengthBits];
            var rand = new Random();
            rand.NextBytes(key);
            return key.ToString();*/
        }
    }
}
