using System.Numerics;

namespace PrivateNotebookAPI.Crypto
{
    public class Serpent
    {
        private const int ROUNDS = 32;
        private const int PHI = unchecked((int)0x9E3779B9);
        private static int X0, X1, X2, X3;
        private static int[] w = new int[(ROUNDS + 1) * 4];
        private static readonly int KeyLength = 128;
        private static readonly int KeyLengthBytes = 16;
        
        public static (string, string) Encrypt(BigInteger sessionKey, string content)
        {
            var len = content.Length;
            while (len % 16 != 0) len++;
            var ivBigInt = CreateSessionKey();
            char[] contentArr = content.ToCharArray();
            byte[] iv = ivBigInt.ToByteArray();
            byte[] encryptedIV = ivBigInt.ToByteArray();
            byte[] prevEncryptedIV = ivBigInt.ToByteArray();
            byte[] pt = new byte[len];
            byte[] key = sessionKey.ToByteArray();
            byte[] ct = new byte[len];

            for (int i = 0; i < contentArr.Length; i++)
                pt[i] = (byte)contentArr[i];
            
            MakeSubkeys(key);
            int iterationsNum = len / 16;
            for (int i = 0; i < iterationsNum; i++)
            {
                EncryptBlock(prevEncryptedIV, 0, encryptedIV, 0);
                var xor = XorBytes(encryptedIV, pt.Skip(i * 16).Take(16).ToArray());
                Array.Copy(xor, 0, ct, 16*i, 16);
                Array.Copy(encryptedIV, prevEncryptedIV, 16);
            }

            return (Convert.ToBase64String(iv), Convert.ToBase64String(ct));
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

        public static void MakeSubkeys(byte[] key)
        {
            int[] kPad = new int[16];
            int off = 0;
            int length = 0;
            for (off = 0; (off + 4) < key.Length; off += 4)
            {
                kPad[length++] = (int)ToInt(key, off);
            }
            if (off % 4 == 0)
            {
                kPad[length++] = (int)ToInt(key, off);
                if (length < 8)
                {
                    kPad[length] = 1;
                }
            }
            else
            {
                throw new ArgumentException("key must be a multiple of 4 bytes");
            }


            int amount = w.Length;
            for (int i = 8; i < 16; i++)
            {
                kPad[i] = RotateLeft(kPad[i - 8] ^ kPad[i - 5] ^ kPad[i - 3] ^ kPad[i - 1] ^ PHI ^ (i - 8), 11);
            }
            Array.Copy(kPad, 8, w, 0, 8);
            for (int i = 8; i < amount; i++)
            {
                w[i] = RotateLeft(w[i - 8] ^ w[i - 5] ^ w[i - 3] ^ w[i - 1] ^ PHI ^ i, 11);
            }

            Sb3(w[0], w[1], w[2], w[3]);
            w[0] = X0; w[1] = X1; w[2] = X2; w[3] = X3;
            Sb2(w[4], w[5], w[6], w[7]);
            w[4] = X0; w[5] = X1; w[6] = X2; w[7] = X3;
            Sb1(w[8], w[9], w[10], w[11]);
            w[8] = X0; w[9] = X1; w[10] = X2; w[11] = X3;
            Sb0(w[12], w[13], w[14], w[15]);
            w[12] = X0; w[13] = X1; w[14] = X2; w[15] = X3;
            Sb7(w[16], w[17], w[18], w[19]);
            w[16] = X0; w[17] = X1; w[18] = X2; w[19] = X3;
            Sb6(w[20], w[21], w[22], w[23]);
            w[20] = X0; w[21] = X1; w[22] = X2; w[23] = X3;
            Sb5(w[24], w[25], w[26], w[27]);
            w[24] = X0; w[25] = X1; w[26] = X2; w[27] = X3;
            Sb4(w[28], w[29], w[30], w[31]);
            w[28] = X0; w[29] = X1; w[30] = X2; w[31] = X3;
            Sb3(w[32], w[33], w[34], w[35]);
            w[32] = X0; w[33] = X1; w[34] = X2; w[35] = X3;
            Sb2(w[36], w[37], w[38], w[39]);
            w[36] = X0; w[37] = X1; w[38] = X2; w[39] = X3;
            Sb1(w[40], w[41], w[42], w[43]);
            w[40] = X0; w[41] = X1; w[42] = X2; w[43] = X3;
            Sb0(w[44], w[45], w[46], w[47]);
            w[44] = X0; w[45] = X1; w[46] = X2; w[47] = X3;
            Sb7(w[48], w[49], w[50], w[51]);
            w[48] = X0; w[49] = X1; w[50] = X2; w[51] = X3;
            Sb6(w[52], w[53], w[54], w[55]);
            w[52] = X0; w[53] = X1; w[54] = X2; w[55] = X3;
            Sb5(w[56], w[57], w[58], w[59]);
            w[56] = X0; w[57] = X1; w[58] = X2; w[59] = X3;
            Sb4(w[60], w[61], w[62], w[63]);
            w[60] = X0; w[61] = X1; w[62] = X2; w[63] = X3;
            Sb3(w[64], w[65], w[66], w[67]);
            w[64] = X0; w[65] = X1; w[66] = X2; w[67] = X3;
            Sb2(w[68], w[69], w[70], w[71]);
            w[68] = X0; w[69] = X1; w[70] = X2; w[71] = X3;
            Sb1(w[72], w[73], w[74], w[75]);
            w[72] = X0; w[73] = X1; w[74] = X2; w[75] = X3;
            Sb0(w[76], w[77], w[78], w[79]);
            w[76] = X0; w[77] = X1; w[78] = X2; w[79] = X3;
            Sb7(w[80], w[81], w[82], w[83]);
            w[80] = X0; w[81] = X1; w[82] = X2; w[83] = X3;
            Sb6(w[84], w[85], w[86], w[87]);
            w[84] = X0; w[85] = X1; w[86] = X2; w[87] = X3;
            Sb5(w[88], w[89], w[90], w[91]);
            w[88] = X0; w[89] = X1; w[90] = X2; w[91] = X3;
            Sb4(w[92], w[93], w[94], w[95]);
            w[92] = X0; w[93] = X1; w[94] = X2; w[95] = X3;
            Sb3(w[96], w[97], w[98], w[99]);
            w[96] = X0; w[97] = X1; w[98] = X2; w[99] = X3;
            Sb2(w[100], w[101], w[102], w[103]);
            w[100] = X0; w[101] = X1; w[102] = X2; w[103] = X3;
            Sb1(w[104], w[105], w[106], w[107]);
            w[104] = X0; w[105] = X1; w[106] = X2; w[107] = X3;
            Sb0(w[108], w[109], w[110], w[111]);
            w[108] = X0; w[109] = X1; w[110] = X2; w[111] = X3;
            Sb7(w[112], w[113], w[114], w[115]);
            w[112] = X0; w[113] = X1; w[114] = X2; w[115] = X3;
            Sb6(w[116], w[117], w[118], w[119]);
            w[116] = X0; w[117] = X1; w[118] = X2; w[119] = X3;
            Sb5(w[120], w[121], w[122], w[123]);
            w[120] = X0; w[121] = X1; w[122] = X2; w[123] = X3;
            Sb4(w[124], w[125], w[126], w[127]);
            w[124] = X0; w[125] = X1; w[126] = X2; w[127] = X3;
            Sb3(w[128], w[129], w[130], w[131]);
            w[128] = X0; w[129] = X1; w[130] = X2; w[131] = X3;
        }

        public static void EncryptBlock(byte[] input, int inOff, byte[] output, int outOff)
        {
            X0 = (int)ToInt(input, inOff);
            X1 = (int)ToInt(input, inOff + 4);
            X2 = (int)ToInt(input, inOff + 8);
            X3 = (int)ToInt(input, inOff + 12);

            Sb0(w[0] ^ X0, w[1] ^ X1, w[2] ^ X2, w[3] ^ X3); LT();
            Sb1(w[4] ^ X0, w[5] ^ X1, w[6] ^ X2, w[7] ^ X3); LT();
            Sb2(w[8] ^ X0, w[9] ^ X1, w[10] ^ X2, w[11] ^ X3); LT();
            Sb3(w[12] ^ X0, w[13] ^ X1, w[14] ^ X2, w[15] ^ X3); LT();
            Sb4(w[16] ^ X0, w[17] ^ X1, w[18] ^ X2, w[19] ^ X3); LT();
            Sb5(w[20] ^ X0, w[21] ^ X1, w[22] ^ X2, w[23] ^ X3); LT();
            Sb6(w[24] ^ X0, w[25] ^ X1, w[26] ^ X2, w[27] ^ X3); LT();
            Sb7(w[28] ^ X0, w[29] ^ X1, w[30] ^ X2, w[31] ^ X3); LT();
            Sb0(w[32] ^ X0, w[33] ^ X1, w[34] ^ X2, w[35] ^ X3); LT();
            Sb1(w[36] ^ X0, w[37] ^ X1, w[38] ^ X2, w[39] ^ X3); LT();
            Sb2(w[40] ^ X0, w[41] ^ X1, w[42] ^ X2, w[43] ^ X3); LT();
            Sb3(w[44] ^ X0, w[45] ^ X1, w[46] ^ X2, w[47] ^ X3); LT();
            Sb4(w[48] ^ X0, w[49] ^ X1, w[50] ^ X2, w[51] ^ X3); LT();
            Sb5(w[52] ^ X0, w[53] ^ X1, w[54] ^ X2, w[55] ^ X3); LT();
            Sb6(w[56] ^ X0, w[57] ^ X1, w[58] ^ X2, w[59] ^ X3); LT();
            Sb7(w[60] ^ X0, w[61] ^ X1, w[62] ^ X2, w[63] ^ X3); LT();
            Sb0(w[64] ^ X0, w[65] ^ X1, w[66] ^ X2, w[67] ^ X3); LT();
            Sb1(w[68] ^ X0, w[69] ^ X1, w[70] ^ X2, w[71] ^ X3); LT();
            Sb2(w[72] ^ X0, w[73] ^ X1, w[74] ^ X2, w[75] ^ X3); LT();
            Sb3(w[76] ^ X0, w[77] ^ X1, w[78] ^ X2, w[79] ^ X3); LT();
            Sb4(w[80] ^ X0, w[81] ^ X1, w[82] ^ X2, w[83] ^ X3); LT();
            Sb5(w[84] ^ X0, w[85] ^ X1, w[86] ^ X2, w[87] ^ X3); LT();
            Sb6(w[88] ^ X0, w[89] ^ X1, w[90] ^ X2, w[91] ^ X3); LT();
            Sb7(w[92] ^ X0, w[93] ^ X1, w[94] ^ X2, w[95] ^ X3); LT();
            Sb0(w[96] ^ X0, w[97] ^ X1, w[98] ^ X2, w[99] ^ X3); LT();
            Sb1(w[100] ^ X0, w[101] ^ X1, w[102] ^ X2, w[103] ^ X3); LT();
            Sb2(w[104] ^ X0, w[105] ^ X1, w[106] ^ X2, w[107] ^ X3); LT();
            Sb3(w[108] ^ X0, w[109] ^ X1, w[110] ^ X2, w[111] ^ X3); LT();
            Sb4(w[112] ^ X0, w[113] ^ X1, w[114] ^ X2, w[115] ^ X3); LT();
            Sb5(w[116] ^ X0, w[117] ^ X1, w[118] ^ X2, w[119] ^ X3); LT();
            Sb6(w[120] ^ X0, w[121] ^ X1, w[122] ^ X2, w[123] ^ X3); LT();
            Sb7(w[124] ^ X0, w[125] ^ X1, w[126] ^ X2, w[127] ^ X3);

            ToBytes((uint)(w[128] ^ X0), output, outOff);
            ToBytes((uint)(w[129] ^ X1), output, outOff + 4);
            ToBytes((uint)(w[130] ^ X2), output, outOff + 8);
            ToBytes((uint)(w[131] ^ X3), output, outOff + 12);
        }

        public static int RotateLeft(int i, int distance)
        {
            return (int)BitOperations.RotateLeft((uint)i, distance);
        }

        public static void LT()
        {
            int x0 = RotateLeft(X0, 13);
            int x2 = RotateLeft(X2, 3);
            int x1 = X1 ^ x0 ^ x2;
            int x3 = X3 ^ x2 ^ x0 << 3;

            X1 = RotateLeft(x1, 1);
            X3 = RotateLeft(x3, 7);
            X0 = RotateLeft(x0 ^ X1 ^ X3, 5);
            X2 = RotateLeft(x2 ^ X3 ^ (X1 << 7), 22);
        }

        public static uint ToInt(byte[] bs, int off)
        {
            return bs[off]
                | (uint)bs[off + 1] << 8
                | (uint)bs[off + 2] << 16
                | (uint)bs[off + 3] << 24;
        }

        public static void ToBytes(uint n, byte[] bs, int off)
        {
            bs[off] = (byte)n;
            bs[off + 1] = (byte)(n >> 8);
            bs[off + 2] = (byte)(n >> 16);
            bs[off + 3] = (byte)(n >> 24);
            }

        public static byte[] XorBytes(byte[] a, byte[] b)
        {
            if (a.Length != b.Length) throw new ArgumentException("Different bytes length");

            byte[] c = new byte[a.Length];

            for (int i = 0; i < a.Length; i++)
            {
                c[i] = (byte)(a[i] ^ b[i]);
            }

            return c;
        }


        public static void Sb0(int a, int b, int c, int d)
        {
            int t1 = a ^ d;
            int t3 = c ^ t1;
            int t4 = b ^ t3;
            X3 = (a & d) ^ t4;
            int t7 = a ^ (b & t1);
            X2 = t4 ^ (c | t7);
            int t12 = X3 & (t3 ^ t7);
            X1 = (~t3) ^ t12;
            X0 = t12 ^ (~t7);
        }

        public static void Sb1(int a, int b, int c, int d)
        {
            int t2 = b ^ (~a);
            int t5 = c ^ (a | t2);
            X2 = d ^ t5;
            int t7 = b ^ (d | t2);
            int t8 = t2 ^ X2;
            X3 = t8 ^ (t5 & t7);
            int t11 = t5 ^ t7;
            X1 = X3 ^ t11;
            X0 = t5 ^ (t8 & t11);
        }

        public static void Sb2(int a, int b, int c, int d)
        {
            int t1 = ~a;
            int t2 = b ^ d;
            int t3 = c & t1;
            X0 = t2 ^ t3;
            int t5 = c ^ t1;
            int t6 = c ^ X0;
            int t7 = b & t6;
            X3 = t5 ^ t7;
            X2 = a ^ ((d | t7) & (X0 | t5));
            X1 = (t2 ^ X3) ^ (X2 ^ (d | t1));
        }

        public static void Sb3(int a, int b, int c, int d)
        {
            int t1 = a ^ b;
            int t2 = a & c;
            int t3 = a | d;
            int t4 = c ^ d;
            int t5 = t1 & t3;
            int t6 = t2 | t5;
            X2 = t4 ^ t6;
            int t8 = b ^ t3;
            int t9 = t6 ^ t8;
            int t10 = t4 & t9;
            X0 = t1 ^ t10;
            int t12 = X2 & X0;
            X1 = t9 ^ t12;
            X3 = (b | d) ^ (t4 ^ t12);
        }

        public static void Sb4(int a, int b, int c, int d)
        {
            int t1 = a ^ d;
            int t2 = d & t1;
            int t3 = c ^ t2;
            int t4 = b | t3;
            X3 = t1 ^ t4;
            int t6 = ~b;
            int t7 = t1 | t6;
            X0 = t3 ^ t7;
            int t9 = a & X0;
            int t10 = t1 ^ t6;
            int t11 = t4 & t10;
            X2 = t9 ^ t11;
            X1 = (a ^ t3) ^ (t10 & X2);
        }

        public static void Sb5(int a, int b, int c, int d)
        {
            int t1 = ~a;
            int t2 = a ^ b;
            int t3 = a ^ d;
            int t4 = c ^ t1;
            int t5 = t2 | t3;
            X0 = t4 ^ t5;
            int t7 = d & X0;
            int t8 = t2 ^ X0;
            X1 = t7 ^ t8;
            int t10 = t1 | X0;
            int t11 = t2 | t7;
            int t12 = t3 ^ t10;
            X2 = t11 ^ t12;
            X3 = (b ^ t7) ^ (X1 & t12);
        }

        public static void Sb6(int a, int b, int c, int d)
        {
            int t1 = ~a;
            int t2 = a ^ d;
            int t3 = b ^ t2;
            int t4 = t1 | t2;
            int t5 = c ^ t4;
            X1 = b ^ t5;
            int t7 = t2 | X1;
            int t8 = d ^ t7;
            int t9 = t5 & t8;
            X2 = t3 ^ t9;
            int t11 = t5 ^ t8;
            X0 = X2 ^ t11;
            X3 = (~t5) ^ (t3 & t11);
        }

        public static void Sb7(int a, int b, int c, int d)
        {
            int t1 = b ^ c;
            int t2 = c & t1;
            int t3 = d ^ t2;
            int t4 = a ^ t3;
            int t5 = d | t1;
            int t6 = t4 & t5;
            X1 = b ^ t6;
            int t8 = t3 | X1;
            int t9 = a & t4;
            X3 = t1 ^ t9;
            int t11 = t4 ^ t8;
            int t12 = X3 & t11;
            X2 = t3 ^ t12;
            X0 = (~t11) ^ (X3 & X2);
        }

        public static void DecryptBlock(byte[] input, int inOff, byte[] output, int outOff)
        {
            X0 = w[128] ^ (int)ToInt(input, inOff);
            X1 = w[129] ^ (int)ToInt(input, inOff + 4);
            X2 = w[130] ^ (int)ToInt(input, inOff + 8);
            X3 = w[131] ^ (int)ToInt(input, inOff + 12);

            Ib7(X0, X1, X2, X3);
            X0 ^= w[124]; X1 ^= w[125]; X2 ^= w[126]; X3 ^= w[127];
            InverseLT(); Ib6(X0, X1, X2, X3);
            X0 ^= w[120]; X1 ^= w[121]; X2 ^= w[122]; X3 ^= w[123];
            InverseLT(); Ib5(X0, X1, X2, X3);
            X0 ^= w[116]; X1 ^= w[117]; X2 ^= w[118]; X3 ^= w[119];
            InverseLT(); Ib4(X0, X1, X2, X3);
            X0 ^= w[112]; X1 ^= w[113]; X2 ^= w[114]; X3 ^= w[115];
            InverseLT(); Ib3(X0, X1, X2, X3);
            X0 ^= w[108]; X1 ^= w[109]; X2 ^= w[110]; X3 ^= w[111];
            InverseLT(); Ib2(X0, X1, X2, X3);
            X0 ^= w[104]; X1 ^= w[105]; X2 ^= w[106]; X3 ^= w[107];
            InverseLT(); Ib1(X0, X1, X2, X3);
            X0 ^= w[100]; X1 ^= w[101]; X2 ^= w[102]; X3 ^= w[103];
            InverseLT(); Ib0(X0, X1, X2, X3);
            X0 ^= w[96]; X1 ^= w[97]; X2 ^= w[98]; X3 ^= w[99];
            InverseLT(); Ib7(X0, X1, X2, X3);
            X0 ^= w[92]; X1 ^= w[93]; X2 ^= w[94]; X3 ^= w[95];
            InverseLT(); Ib6(X0, X1, X2, X3);
            X0 ^= w[88]; X1 ^= w[89]; X2 ^= w[90]; X3 ^= w[91];
            InverseLT(); Ib5(X0, X1, X2, X3);
            X0 ^= w[84]; X1 ^= w[85]; X2 ^= w[86]; X3 ^= w[87];
            InverseLT(); Ib4(X0, X1, X2, X3);
            X0 ^= w[80]; X1 ^= w[81]; X2 ^= w[82]; X3 ^= w[83];
            InverseLT(); Ib3(X0, X1, X2, X3);
            X0 ^= w[76]; X1 ^= w[77]; X2 ^= w[78]; X3 ^= w[79];
            InverseLT(); Ib2(X0, X1, X2, X3);
            X0 ^= w[72]; X1 ^= w[73]; X2 ^= w[74]; X3 ^= w[75];
            InverseLT(); Ib1(X0, X1, X2, X3);
            X0 ^= w[68]; X1 ^= w[69]; X2 ^= w[70]; X3 ^= w[71];
            InverseLT(); Ib0(X0, X1, X2, X3);
            X0 ^= w[64]; X1 ^= w[65]; X2 ^= w[66]; X3 ^= w[67];
            InverseLT(); Ib7(X0, X1, X2, X3);
            X0 ^= w[60]; X1 ^= w[61]; X2 ^= w[62]; X3 ^= w[63];
            InverseLT(); Ib6(X0, X1, X2, X3);
            X0 ^= w[56]; X1 ^= w[57]; X2 ^= w[58]; X3 ^= w[59];
            InverseLT(); Ib5(X0, X1, X2, X3);
            X0 ^= w[52]; X1 ^= w[53]; X2 ^= w[54]; X3 ^= w[55];
            InverseLT(); Ib4(X0, X1, X2, X3);
            X0 ^= w[48]; X1 ^= w[49]; X2 ^= w[50]; X3 ^= w[51];
            InverseLT(); Ib3(X0, X1, X2, X3);
            X0 ^= w[44]; X1 ^= w[45]; X2 ^= w[46]; X3 ^= w[47];
            InverseLT(); Ib2(X0, X1, X2, X3);
            X0 ^= w[40]; X1 ^= w[41]; X2 ^= w[42]; X3 ^= w[43];
            InverseLT(); Ib1(X0, X1, X2, X3);
            X0 ^= w[36]; X1 ^= w[37]; X2 ^= w[38]; X3 ^= w[39];
            InverseLT(); Ib0(X0, X1, X2, X3);
            X0 ^= w[32]; X1 ^= w[33]; X2 ^= w[34]; X3 ^= w[35];
            InverseLT(); Ib7(X0, X1, X2, X3);
            X0 ^= w[28]; X1 ^= w[29]; X2 ^= w[30]; X3 ^= w[31];
            InverseLT(); Ib6(X0, X1, X2, X3);
            X0 ^= w[24]; X1 ^= w[25]; X2 ^= w[26]; X3 ^= w[27];
            InverseLT(); Ib5(X0, X1, X2, X3);
            X0 ^= w[20]; X1 ^= w[21]; X2 ^= w[22]; X3 ^= w[23];
            InverseLT(); Ib4(X0, X1, X2, X3);
            X0 ^= w[16]; X1 ^= w[17]; X2 ^= w[18]; X3 ^= w[19];
            InverseLT(); Ib3(X0, X1, X2, X3);
            X0 ^= w[12]; X1 ^= w[13]; X2 ^= w[14]; X3 ^= w[15];
            InverseLT(); Ib2(X0, X1, X2, X3);
            X0 ^= w[8]; X1 ^= w[9]; X2 ^= w[10]; X3 ^= w[11];
            InverseLT(); Ib1(X0, X1, X2, X3);
            X0 ^= w[4]; X1 ^= w[5]; X2 ^= w[6]; X3 ^= w[7];
            InverseLT(); Ib0(X0, X1, X2, X3);

            ToBytes((uint)(X0 ^ w[0]), output, outOff);
            ToBytes((uint)(X1 ^ w[1]), output, outOff + 4);
            ToBytes((uint)(X2 ^ w[2]), output, outOff + 8);
            ToBytes((uint)(X3 ^ w[3]), output, outOff + 12);
        }

        public static void InverseLT()
        {
            int x2 = RotateRight(X2, 22) ^ X3 ^ (X1 << 7);
            int x0 = RotateRight(X0, 5) ^ X1 ^ X3;
            int x3 = RotateRight(X3, 7);
            int x1 = RotateRight(X1, 1);
            X3 = x3 ^ x2 ^ x0 << 3;
            X1 = x1 ^ x0 ^ x2;
            X2 = RotateRight(x2, 3);
            X0 = RotateRight(x0, 13);
        }

        public static void Ib0(int a, int b, int c, int d)
        {
            int t1 = ~a;
            int t2 = a ^ b;
            int t4 = d ^ (t1 | t2);
            int t5 = c ^ t4;
            X2 = t2 ^ t5;
            int t8 = t1 ^ (d & t2);
            X1 = t4 ^ (X2 & t8);
            X3 = (a & t4) ^ (t5 | X1);
            X0 = X3 ^ (t5 ^ t8);
        }

        public static void Ib1(int a, int b, int c, int d)
        {
            int t1 = b ^ d;
            int t3 = a ^ (b & t1);
            int t4 = t1 ^ t3;
            X3 = c ^ t4;
            int t7 = b ^ (t1 & t3);
            int t8 = X3 | t7;
            X1 = t3 ^ t8;
            int t10 = ~X1;
            int t11 = X3 ^ t7;
            X0 = t10 ^ t11;
            X2 = t4 ^ (t10 | t11);
        }

        public static void Ib2(int a, int b, int c, int d)
        {
            int t1 = b ^ d;
            int t2 = ~t1;
            int t3 = a ^ c;
            int t4 = c ^ t1;
            int t5 = b & t4;
            X0 = t3 ^ t5;
            int t7 = a | t2;
            int t8 = d ^ t7;
            int t9 = t3 | t8;
            X3 = t1 ^ t9;
            int t11 = ~t4;
            int t12 = X0 | X3;
            X1 = t11 ^ t12;
            X2 = (d & t11) ^ (t3 ^ t12);
        }

        public static void Ib3(int a, int b, int c, int d)
        {
            int t1 = a | b;
            int t2 = b ^ c;
            int t3 = b & t2;
            int t4 = a ^ t3;
            int t5 = c ^ t4;
            int t6 = d | t4;
            X0 = t2 ^ t6;
            int t8 = t2 | t6;
            int t9 = d ^ t8;
            X2 = t5 ^ t9;
            int t11 = t1 ^ t9;
            int t12 = X0 & t11;
            X3 = t4 ^ t12;
            X1 = X3 ^ (X0 ^ t11);
        }

        public static void Ib4(int a, int b, int c, int d)
        {
            int t1 = c | d;
            int t2 = a & t1;
            int t3 = b ^ t2;
            int t4 = a & t3;
            int t5 = c ^ t4;
            X1 = d ^ t5;
            int t7 = ~a;
            int t8 = t5 & X1;
            X3 = t3 ^ t8;
            int t10 = X1 | t7;
            int t11 = d ^ t10;
            X0 = X3 ^ t11;
            X2 = (t3 & t11) ^ (X1 ^ t7);
        }

        public static void Ib5(int a, int b, int c, int d)
        {
            int t1 = ~c;
            int t2 = b & t1;
            int t3 = d ^ t2;
            int t4 = a & t3;
            int t5 = b ^ t1;
            X3 = t4 ^ t5;
            int t7 = b | X3;
            int t8 = a & t7;
            X1 = t3 ^ t8;
            int t10 = a | d;
            int t11 = t1 ^ t7;
            X0 = t10 ^ t11;
            X2 = (b & t10) ^ (t4 | (a ^ c));
        }

        public static void Ib6(int a, int b, int c, int d)
        {
            int t1 = ~a;
            int t2 = a ^ b;
            int t3 = c ^ t2;
            int t4 = c | t1;
            int t5 = d ^ t4;
            X1 = t3 ^ t5;
            int t7 = t3 & t5;
            int t8 = t2 ^ t7;
            int t9 = b | t8;
            X3 = t5 ^ t9;
            int t11 = b | X3;
            X0 = t8 ^ t11;
            X2 = (d & t1) ^ (t3 ^ t11);
        }

        public static void Ib7(int a, int b, int c, int d)
        {
            int t3 = c | (a & b);
            int t4 = d & (a | b);
            X3 = t3 ^ t4;
            int t6 = ~d;
            int t7 = b ^ t4;
            int t9 = t7 | (X3 ^ t6);
            X1 = a ^ t9;
            X0 = (c ^ t7) ^ (d | X1);
            X2 = (t3 ^ X1) ^ (X0 ^ (a & X3));
        }

        public static int RotateRight(int i, int distance)
        {
            return (int)BitOperations.RotateRight((uint)i, distance);
        }
    }
}
