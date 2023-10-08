using System.Numerics;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace PrivateNotebookAPI.Crypto
{
    public class RSA
    {

        //public static int e = 65537;
        /*public static string Encrypt(string openKey, string module, string content)
        {
            BigInteger RSAOpenKey = BigInteger.Parse(openKey);
            BigInteger RSAModule = BigInteger.Parse(module);
            BigInteger textBytes = new BigInteger(Encoding.UTF8.GetBytes(content));
            return Convert.ToBase64String(BigInteger.ModPow(textBytes, RSAOpenKey, RSAModule).ToByteArray());
        }*/

        public static string Encrypt(string openKey, string module, BigInteger content)
        {
            //byte[] plainText = Encoding.UTF8.GetBytes(content);
            //string cipherText = EncryptBytes(openKey, module, plainText);
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

            /*if (bytes.Length < 1 || bytes.Length >= RSAModule.ToByteArray().Length)
            {
                throw new Exception("Bytes given are longer than length of key element n (" + bytes.Length + " bytes).");
            }*/

            //bytes = bytes.Reverse().ToArray();
            //var textInBigint = new BigInteger(bytes);
            BigInteger cipherBigint = BigInteger.ModPow(content, RSAOpenKey, RSAModule);
            return cipherBigint.ToString();
        }
    }
}
