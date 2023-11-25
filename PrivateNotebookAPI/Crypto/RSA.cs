using System.Numerics;

namespace PrivateNotebookAPI.Crypto
{
    public class RSA
    {

        public static string Encrypt(string openKey, string module, BigInteger content)
        {
            string cipherText = EncryptBytes(openKey, module, content);
            byte[] cipherBytes = new byte[cipherText.Length];
            for(int i = 0; i < cipherText.Length; i++)
            {
                cipherBytes[i] = (byte)cipherText[i];
            } 

            return Convert.ToBase64String(cipherBytes);
        }

        private static string EncryptBytes(string openKey, string module, BigInteger content)
        {
            BigInteger RSAOpenKey = BigInteger.Parse(openKey);
            BigInteger RSAModule = BigInteger.Parse(module);
            BigInteger cipherBigint = BigInteger.ModPow(content, RSAOpenKey, RSAModule);
            return cipherBigint.ToString();
        }
    }
}
