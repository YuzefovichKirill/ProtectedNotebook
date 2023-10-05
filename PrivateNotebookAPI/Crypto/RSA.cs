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

        public static string Encrypt(string openKey, string module, string content)
        {
            byte[] plainText = Encoding.UTF8.GetBytes(content);
            byte[] cipherText = EncryptBytes(openKey, module, plainText);
            return Convert.ToBase64String(cipherText);
        }

        private static byte[] EncryptBytes(string openKey, string module, byte[] bytes)
        {
            BigInteger RSAOpenKey = BigInteger.Parse(openKey);
            BigInteger RSAModule = BigInteger.Parse(module);

            if (1 > bytes.Length || bytes.Length >= RSAModule.ToByteArray().Length)
            {
                throw new Exception("Bytes given are longer than length of key element n (" + bytes.Length + " bytes).");
            }

            //Padding the array to unsign.
            /*byte[] bytes_padded = new byte[bytes.Length + 2];
            Array.Copy(bytes, bytes_padded, bytes.Length);
            bytes_padded[bytes_padded.Length - 1] = 0x00;*/

            //Setting high byte right before the data, to prevent data loss.
            /*bytes_padded[bytes_padded.Length - 2] = 0xFF;*/

            //Computing as a BigInteger the encryption operation.
            /*var padded_bigint = new BigInteger(bytes_padded);*/
            var textInBigint = new BigInteger(bytes);
            BigInteger cipherBigint = BigInteger.ModPow(textInBigint, RSAOpenKey, RSAModule);

            //Returning the byte array of encrypted bytes.
            return cipherBigint.ToByteArray();
        }
    }
}
