using System.Numerics;
using System.Text;

namespace PrivateNotebookAPI.Crypto
{
    public class Serpent
    {
        private static readonly int KeyLength = 128; // 128, 192, 256
        private static readonly int KeyLengthBytes = KeyLength/8;

        public static string Encrypt(BigInteger sessionKey, string content)
        {
            var a =  sessionKey.ToByteArray();
            return "serpent.encrypt.not-implemented";
            throw new NotImplementedException();
        }

        public static BigInteger CreateSessionKey()
        {    
            byte[] key = new byte[KeyLengthBytes];
            var rand = new Random(12);
            rand.NextBytes(key);
            key[15] = 0x7F;
            BigInteger _key = new BigInteger(key);
            return _key;
        }
    }
}
