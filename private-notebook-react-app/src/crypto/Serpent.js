
export class Serpent {

  constructor(){
    this.X0 = 0
    this.X1 = 0
    this.X2 = 0
    this.X3 = 0
    this.PHI = 0x9E3779B9
    this.ROUNDS = 32
    this.w = new Uint32Array((ROUNDS + 1) * 4)
    this.keyLengthBytes = 16    
  }
  
  // sessionKey: bytes[], encrContent: base64 string
  Decrypt(sessionKey, encrContent) {
    var content = base64ToArrayBuffer(encrContent)
    var decrContent = new Uint8Array(content.length)
    makeKey(sessionKey)

    DecryptBlock(content, 0, decrContent, 0)
  }

  base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  makeSubkeys(key){
    var kPad = new Uint32Array(16)
    var off = 0;
    var length = 0;

    for (off = 0; (off + 4) < key.Length; off += 4)
    {
        kPad[length++] = ToInt(key, off);
    }
    if (off % 4 == 0)
    {
        kPad[length++] = ToInt(key, off);
        if (length < 8)
        {
            kPad[length] = 1;
        }
    }

    var amount = this.w.length
    for(var i = 8; i < 16; i++){
      kPad[i] = RotateLeft(kPad[i - 8] ^ kPad[i - 5] ^ kPad[i - 3] ^ kPad[i - 1] ^ this.PHI ^ (i - 8), 11)
      w[i-8] = kPad[i]
    }
    for (var i = 8; i < amount; i++)
    {
        w[i] = RotateLeft(w[i - 8] ^ w[i - 5] ^ w[i - 3] ^ w[i - 1] ^ this.PHI ^ i, 11);
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

  DecryptBlock(input, inOff, output, outOff) {
    X0 = ToInt(input, inOff)
    X1 = ToInt(input, inOff+4)
    X2 = ToInt(input, inOff+8)
    X3 = ToInt(input, inOff+12)

    ToBytes((uint)(w[128] ^ X0), output, outOff);
    ToBytes((uint)(w[129] ^ X1), output, outOff + 4);
    ToBytes((uint)(w[130] ^ X2), output, outOff + 8);
    ToBytes((uint)(w[131] ^ X3), output, outOff + 12);
  }


  RotateLeft(i, distance) {
    return (i << distance) | (i >>> (32 - distance))
  }

  ToInt(bs, off) {
    return bs[off] | bs[off+1]<< 8 | bs[off+2]<<16 | bs[off+3]<<24
  }

  ToBytes(n, bs, off) {
    bs[off] = n % 256
    bs[off+1] = (n >> 8) % 256
    bs[off+2] = (n >> 16) % 256
    bs[off+3] = (n >> 24) % 256
  }

  Sb0(a, b, c, d)
  {
    let t1 = a ^ d;
    let t3 = c ^ t1;
    let t4 = b ^ t3;
    X3 = (a & d) ^ t4;
    let t7 = a ^ (b & t1);
    X2 = t4 ^ (c | t7);
    let t12 = X3 & (t3 ^ t7);
    X1 = (~t3) ^ t12;
    X0 = t12 ^ (~t7);
  }

  Sb1(a, b, c, d)
  {
    var t2 = b ^ (~a);
    var t5 = c ^ (a | t2);
    X2 = d ^ t5;
    var t7 = b ^ (d | t2);
    var t8 = t2 ^ X2;
    X3 = t8 ^ (t5 & t7);
    var t11 = t5 ^ t7;
    X1 = X3 ^ t11;
    X0 = t5 ^ (t8 & t11);
  }

  Sb2(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = b ^ d;
    var t3 = c & t1;
    X0 = t2 ^ t3;
    var t5 = c ^ t1;
    var t6 = c ^ X0;
    var t7 = b & t6;
    X3 = t5 ^ t7;
    X2 = a ^ ((d | t7) & (X0 | t5));
    X1 = (t2 ^ X3) ^ (X2 ^ (d | t1));
  }

  Sb3(a, b, c, d)
  {
    var t1 = a ^ b;
    var t2 = a & c;
    var t3 = a | d;
    var t4 = c ^ d;
    var t5 = t1 & t3;
    var t6 = t2 | t5;
    X2 = t4 ^ t6;
    var t8 = b ^ t3;
    var t9 = t6 ^ t8;
    var t10 = t4 & t9;
    X0 = t1 ^ t10;
    var t12 = X2 & X0;
    X1 = t9 ^ t12;
    X3 = (b | d) ^ (t4 ^ t12);
  }

  Sb4(a, b, c, d)
  {
    var t1 = a ^ d;
    var t2 = d & t1;
    var t3 = c ^ t2;
    var t4 = b | t3;
    X3 = t1 ^ t4;
    var t6 = ~b;
    var t7 = t1 | t6;
    X0 = t3 ^ t7;
    var t9 = a & X0;
    var t10 = t1 ^ t6;
    var t11 = t4 & t10;
    X2 = t9 ^ t11;
    X1 = (a ^ t3) ^ (t10 & X2);
  }

  Sb5(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = a ^ b;
    var t3 = a ^ d;
    var t4 = c ^ t1;
    var t5 = t2 | t3;
    X0 = t4 ^ t5;
    var t7 = d & X0;
    var t8 = t2 ^ X0;
    X1 = t7 ^ t8;
    var t10 = t1 | X0;
    var t11 = t2 | t7;
    var t12 = t3 ^ t10;
    X2 = t11 ^ t12;
    X3 = (b ^ t7) ^ (X1 & t12);
  }

  Sb6(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = a ^ d;
    var t3 = b ^ t2;
    var t4 = t1 | t2;
    var t5 = c ^ t4;
    X1 = b ^ t5;
    var t7 = t2 | X1;
    var t8 = d ^ t7;
    var t9 = t5 & t8;
    X2 = t3 ^ t9;
    var t11 = t5 ^ t8;
    X0 = X2 ^ t11;
    X3 = (~t5) ^ (t3 & t11);
  }

  Sb7(a, b, c, d)
  {
    var t1 = b ^ c;
    var t2 = c & t1;
    var t3 = d ^ t2;
    var t4 = a ^ t3;
    var t5 = d | t1;
    var t6 = t4 & t5;
    X1 = b ^ t6;
    var t8 = t3 | X1;
    var t9 = a & t4;
    X3 = t1 ^ t9;
    var t11 = t4 ^ t8;
    var t12 = X3 & t11;
    X2 = t3 ^ t12;
    X0 = (~t11) ^ (X3 & X2);
  }
}
