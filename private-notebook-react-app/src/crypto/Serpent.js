export default class Serpent {

  constructor(){
    this.X0 = 0
    this.X1 = 0
    this.X2 = 0
    this.X3 = 0
    this.PHI = 0x9E3779B9
    this.ROUNDS = 32
    this.w = new Uint32Array((this.ROUNDS + 1) * 4)
    this.keyLengthBytes = 16    
  }
  
  // sessionKey: bytes[], encrContent: base64 string
  Decrypt(sessionKey, IV_base64, encrContent) {
    var content = this.base64ToArrayBuffer(encrContent)
    var IV = this.base64ToArrayBuffer(IV_base64)
    var decrContent = new Uint8Array()
    this.makeSubkeys(sessionKey)
    var encryptedIV = new Uint8Array(IV)
    var prevEncryptedIV = new Uint8Array(IV)
    var iterationsNum = content.length / 16
    for(let i = 0; i < iterationsNum; i++)
    {
      this.EncryptBlock(prevEncryptedIV, 0, encryptedIV, 0)
      var xor = this.XorBytes(encryptedIV, content.slice(16*i, 16*(i+1)))
      decrContent =  new Uint8Array([...decrContent, ...xor])
      prevEncryptedIV = new Uint8Array(encryptedIV)
      
    }
    let ln = 0
    for (let i = 0; i < decrContent.length; i++) {
      if (decrContent[i] === 0) break;
      else ln++;
    }
    
    return new TextDecoder().decode(decrContent.slice(0, ln))
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
    for (off = 0; (off + 4) < key.length; off += 4)
    {
        kPad[length++] = this.ToInt(key, off);
    }
    if (off % 4 == 0)
    {
        kPad[length++] = this.ToInt(key, off);
        if (length < 8)
        {
            kPad[length] = 1;
        }
    }
    var amount = this.w.length
    for(var i = 8; i < 16; i++){
      kPad[i] = this.RotateLeft(kPad[i - 8] ^ kPad[i - 5] ^ kPad[i - 3] ^ kPad[i - 1] ^ this.PHI ^ (i - 8), 11)
      this.w[i-8] = kPad[i]
    }
    for (var i = 8; i < amount; i++)
    {
      this.w[i] = this.RotateLeft(this.w[i - 8] ^ this.w[i - 5] ^ this.w[i - 3] ^ this.w[i - 1] ^ this.PHI ^ i, 11);
    }

    this.Sb3(this.w[0], this.w[1], this.w[2], this.w[3]);
    this.w[0] = this.X0; this.w[1] = this.X1; this.w[2] = this.X2; this.w[3] = this.X3;
    this.Sb2(this.w[4], this.w[5], this.w[6], this.w[7]);
    this.w[4] = this.X0; this.w[5] = this.X1; this.w[6] = this.X2; this.w[7] = this.X3;
    this.Sb1(this.w[8], this.w[9], this.w[10], this.w[11]);
    this.w[8] = this.X0; this.w[9] = this.X1; this.w[10] = this.X2; this.w[11] = this.X3;
    this.Sb0(this.w[12], this.w[13], this.w[14], this.w[15]);
    this.w[12] = this.X0; this.w[13] = this.X1; this.w[14] = this.X2; this.w[15] = this.X3;
    this.Sb7(this.w[16], this.w[17], this.w[18], this.w[19]);
    this.w[16] = this.X0; this.w[17] = this.X1; this.w[18] = this.X2; this.w[19] = this.X3;
    this.Sb6(this.w[20], this.w[21], this.w[22], this.w[23]);
    this.w[20] = this.X0; this.w[21] = this.X1; this.w[22] = this.X2; this.w[23] = this.X3;
    this.Sb5(this.w[24], this.w[25], this.w[26], this.w[27]);
    this.w[24] = this.X0; this.w[25] = this.X1; this.w[26] = this.X2; this.w[27] = this.X3;
    this.Sb4(this.w[28], this.w[29], this.w[30], this.w[31]);
    this.w[28] = this.X0; this.w[29] = this.X1; this.w[30] = this.X2; this.w[31] = this.X3;
    this.Sb3(this.w[32], this.w[33], this.w[34], this.w[35]);
    this.w[32] = this.X0; this.w[33] = this.X1; this.w[34] = this.X2; this.w[35] = this.X3;
    this.Sb2(this.w[36], this.w[37], this.w[38], this.w[39]);
    this.w[36] = this.X0; this.w[37] = this.X1; this.w[38] = this.X2; this.w[39] = this.X3;
    this.Sb1(this.w[40], this.w[41], this.w[42], this.w[43]);
    this.w[40] = this.X0; this.w[41] = this.X1; this.w[42] = this.X2; this.w[43] = this.X3;
    this.Sb0(this.w[44], this.w[45], this.w[46], this.w[47]);
    this.w[44] = this.X0; this.w[45] = this.X1; this.w[46] = this.X2; this.w[47] = this.X3;
    this.Sb7(this.w[48], this.w[49], this.w[50], this.w[51]);
    this.w[48] = this.X0; this.w[49] = this.X1; this.w[50] = this.X2; this.w[51] = this.X3;
    this.Sb6(this.w[52], this.w[53], this.w[54], this.w[55]);
    this.w[52] = this.X0; this.w[53] = this.X1; this.w[54] = this.X2; this.w[55] = this.X3;
    this.Sb5(this.w[56], this.w[57], this.w[58], this.w[59]);
    this.w[56] = this.X0; this.w[57] = this.X1; this.w[58] = this.X2; this.w[59] = this.X3;
    this.Sb4(this.w[60], this.w[61], this.w[62], this.w[63]);
    this.w[60] = this.X0; this.w[61] = this.X1; this.w[62] = this.X2; this.w[63] = this.X3;
    this.Sb3(this.w[64], this.w[65], this.w[66], this.w[67]);
    this.w[64] = this.X0; this.w[65] = this.X1; this.w[66] = this.X2; this.w[67] = this.X3;
    this.Sb2(this.w[68], this.w[69], this.w[70], this.w[71]);
    this.w[68] = this.X0; this.w[69] = this.X1; this.w[70] = this.X2; this.w[71] = this.X3;
    this.Sb1(this.w[72], this.w[73], this.w[74], this.w[75]);
    this.w[72] = this.X0; this.w[73] = this.X1; this.w[74] = this.X2; this.w[75] = this.X3;
    this.Sb0(this.w[76], this.w[77], this.w[78], this.w[79]);
    this.w[76] = this.X0; this.w[77] = this.X1; this.w[78] = this.X2; this.w[79] = this.X3;
    this.Sb7(this.w[80], this.w[81], this.w[82], this.w[83]);
    this.w[80] = this.X0; this.w[81] = this.X1; this.w[82] = this.X2; this.w[83] = this.X3;
    this.Sb6(this.w[84], this.w[85], this.w[86], this.w[87]);
    this.w[84] = this.X0; this.w[85] = this.X1; this.w[86] = this.X2; this.w[87] = this.X3;
    this.Sb5(this.w[88], this.w[89], this.w[90], this.w[91]);
    this.w[88] = this.X0; this.w[89] = this.X1; this.w[90] = this.X2; this.w[91] = this.X3;
    this.Sb4(this.w[92], this.w[93], this.w[94], this.w[95]);
    this.w[92] = this.X0; this.w[93] = this.X1; this.w[94] = this.X2; this.w[95] = this.X3;
    this.Sb3(this.w[96], this.w[97], this.w[98], this.w[99]);
    this.w[96] = this.X0; this.w[97] = this.X1; this.w[98] = this.X2; this.w[99] = this.X3;
    this.Sb2(this.w[100], this.w[101], this.w[102], this.w[103]);
    this.w[100] = this.X0; this.w[101] = this.X1; this.w[102] = this.X2; this.w[103] = this.X3;
    this.Sb1(this.w[104], this.w[105], this.w[106], this.w[107]);
    this.w[104] = this.X0; this.w[105] = this.X1; this.w[106] = this.X2; this.w[107] = this.X3;
    this.Sb0(this.w[108], this.w[109], this.w[110], this.w[111]);
    this.w[108] = this.X0; this.w[109] = this.X1; this.w[110] = this.X2; this.w[111] = this.X3;
    this.Sb7(this.w[112], this.w[113], this.w[114], this.w[115]);
    this.w[112] = this.X0; this.w[113] = this.X1; this.w[114] = this.X2; this.w[115] = this.X3;
    this.Sb6(this.w[116], this.w[117], this.w[118], this.w[119]);
    this.w[116] = this.X0; this.w[117] = this.X1; this.w[118] = this.X2; this.w[119] = this.X3;
    this.Sb5(this.w[120], this.w[121], this.w[122], this.w[123]);
    this.w[120] = this.X0; this.w[121] = this.X1; this.w[122] = this.X2; this.w[123] = this.X3;
    this.Sb4(this.w[124], this.w[125], this.w[126], this.w[127]);
    this.w[124] = this.X0; this.w[125] = this.X1; this.w[126] = this.X2; this.w[127] = this.X3;
    this.Sb3(this.w[128], this.w[129], this.w[130], this.w[131]);
    this.w[128] = this.X0; this.w[129] = this.X1; this.w[130] = this.X2; this.w[131] = this.X3;
  }

  EncryptBlock(input, inOff, output, outOff) {
    this.X0 = this.ToInt(input, inOff);
    this.X1 = this.ToInt(input, inOff + 4);
    this.X2 = this.ToInt(input, inOff + 8);
    this.X3 = this.ToInt(input, inOff + 12);

    this.Sb0(this.w[0] ^ this.X0, this.w[1] ^ this.X1, this.w[2] ^ this.X2, this.w[3] ^ this.X3); this.LT();
    this.Sb1(this.w[4] ^ this.X0, this.w[5] ^ this.X1, this.w[6] ^ this.X2, this.w[7] ^ this.X3); this.LT();
    this.Sb2(this.w[8] ^ this.X0, this.w[9] ^ this.X1, this.w[10] ^ this.X2, this.w[11] ^ this.X3); this.LT();
    this.Sb3(this.w[12] ^ this.X0, this.w[13] ^ this.X1, this.w[14] ^ this.X2, this.w[15] ^ this.X3); this.LT();
    this.Sb4(this.w[16] ^ this.X0, this.w[17] ^ this.X1, this.w[18] ^ this.X2, this.w[19] ^ this.X3); this.LT();
    this.Sb5(this.w[20] ^ this.X0, this.w[21] ^ this.X1, this.w[22] ^ this.X2, this.w[23] ^ this.X3); this.LT();
    this.Sb6(this.w[24] ^ this.X0, this.w[25] ^ this.X1, this.w[26] ^ this.X2, this.w[27] ^ this.X3); this.LT();
    this.Sb7(this.w[28] ^ this.X0, this.w[29] ^ this.X1, this.w[30] ^ this.X2, this.w[31] ^ this.X3); this.LT();
    this.Sb0(this.w[32] ^ this.X0, this.w[33] ^ this.X1, this.w[34] ^ this.X2, this.w[35] ^ this.X3); this.LT();
    this.Sb1(this.w[36] ^ this.X0, this.w[37] ^ this.X1, this.w[38] ^ this.X2, this.w[39] ^ this.X3); this.LT();
    this.Sb2(this.w[40] ^ this.X0, this.w[41] ^ this.X1, this.w[42] ^ this.X2, this.w[43] ^ this.X3); this.LT();
    this.Sb3(this.w[44] ^ this.X0, this.w[45] ^ this.X1, this.w[46] ^ this.X2, this.w[47] ^ this.X3); this.LT();
    this.Sb4(this.w[48] ^ this.X0, this.w[49] ^ this.X1, this.w[50] ^ this.X2, this.w[51] ^ this.X3); this.LT();
    this.Sb5(this.w[52] ^ this.X0, this.w[53] ^ this.X1, this.w[54] ^ this.X2, this.w[55] ^ this.X3); this.LT();
    this.Sb6(this.w[56] ^ this.X0, this.w[57] ^ this.X1, this.w[58] ^ this.X2, this.w[59] ^ this.X3); this.LT();
    this.Sb7(this.w[60] ^ this.X0, this.w[61] ^ this.X1, this.w[62] ^ this.X2, this.w[63] ^ this.X3); this.LT();
    this.Sb0(this.w[64] ^ this.X0, this.w[65] ^ this.X1, this.w[66] ^ this.X2, this.w[67] ^ this.X3); this.LT();
    this.Sb1(this.w[68] ^ this.X0, this.w[69] ^ this.X1, this.w[70] ^ this.X2, this.w[71] ^ this.X3); this.LT();
    this.Sb2(this.w[72] ^ this.X0, this.w[73] ^ this.X1, this.w[74] ^ this.X2, this.w[75] ^ this.X3); this.LT();
    this.Sb3(this.w[76] ^ this.X0, this.w[77] ^ this.X1, this.w[78] ^ this.X2, this.w[79] ^ this.X3); this.LT();
    this.Sb4(this.w[80] ^ this.X0, this.w[81] ^ this.X1, this.w[82] ^ this.X2, this.w[83] ^ this.X3); this.LT();
    this.Sb5(this.w[84] ^ this.X0, this.w[85] ^ this.X1, this.w[86] ^ this.X2, this.w[87] ^ this.X3); this.LT();
    this.Sb6(this.w[88] ^ this.X0, this.w[89] ^ this.X1, this.w[90] ^ this.X2, this.w[91] ^ this.X3); this.LT();
    this.Sb7(this.w[92] ^ this.X0, this.w[93] ^ this.X1, this.w[94] ^ this.X2, this.w[95] ^ this.X3); this.LT();
    this.Sb0(this.w[96] ^ this.X0, this.w[97] ^ this.X1, this.w[98] ^ this.X2, this.w[99] ^ this.X3); this.LT();
    this.Sb1(this.w[100] ^ this.X0, this.w[101] ^ this.X1, this.w[102] ^ this.X2, this.w[103] ^ this.X3); this.LT();
    this.Sb2(this.w[104] ^ this.X0, this.w[105] ^ this.X1, this.w[106] ^ this.X2, this.w[107] ^ this.X3); this.LT();
    this.Sb3(this.w[108] ^ this.X0, this.w[109] ^ this.X1, this.w[110] ^ this.X2, this.w[111] ^ this.X3); this.LT();
    this.Sb4(this.w[112] ^ this.X0, this.w[113] ^ this.X1, this.w[114] ^ this.X2, this.w[115] ^ this.X3); this.LT();
    this.Sb5(this.w[116] ^ this.X0, this.w[117] ^ this.X1, this.w[118] ^ this.X2, this.w[119] ^ this.X3); this.LT();
    this.Sb6(this.w[120] ^ this.X0, this.w[121] ^ this.X1, this.w[122] ^ this.X2, this.w[123] ^ this.X3); this.LT();
    this.Sb7(this.w[124] ^ this.X0, this.w[125] ^ this.X1, this.w[126] ^ this.X2, this.w[127] ^ this.X3);

    this.ToBytes((this.w[128] ^ this.X0), output, outOff);
    this.ToBytes((this.w[129] ^ this.X1), output, outOff + 4);
    this.ToBytes((this.w[130] ^ this.X2), output, outOff + 8);
    this.ToBytes((this.w[131] ^ this.X3), output, outOff + 12);
  }

  DecryptBlock(input, inOff, output, outOff) {
    this.X0 = this.w[128] ^ this.ToInt(input, inOff)
    this.X1 = this.w[129] ^ this.ToInt(input, inOff+4)
    this.X2 = this.w[130] ^ this.ToInt(input, inOff+8)
    this.X3 = this.w[131] ^ this.ToInt(input, inOff+12)

    this.Ib7(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[124]; this.X1 ^= this.w[125]; this.X2 ^= this.w[126]; this.X3 ^= this.w[127];
    this.InverseLT(); this.Ib6(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[120]; this.X1 ^= this.w[121]; this.X2 ^= this.w[122]; this.X3 ^= this.w[123];
    this.InverseLT(); this.Ib5(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[116]; this.X1 ^= this.w[117]; this.X2 ^= this.w[118]; this.X3 ^= this.w[119];
    this.InverseLT(); this.Ib4(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[112]; this.X1 ^= this.w[113]; this.X2 ^= this.w[114]; this.X3 ^= this.w[115];
    this.InverseLT(); this.Ib3(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[108]; this.X1 ^= this.w[109]; this.X2 ^= this.w[110]; this.X3 ^= this.w[111];
    this.InverseLT(); this.Ib2(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[104]; this.X1 ^= this.w[105]; this.X2 ^= this.w[106]; this.X3 ^= this.w[107];
    this.InverseLT(); this.Ib1(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[100]; this.X1 ^= this.w[101]; this.X2 ^= this.w[102]; this.X3 ^= this.w[103];
    this.InverseLT(); this.Ib0(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[96]; this.X1 ^= this.w[97]; this.X2 ^= this.w[98]; this.X3 ^= this.w[99];
    this.InverseLT(); this.Ib7(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[92]; this.X1 ^= this.w[93]; this.X2 ^= this.w[94]; this.X3 ^= this.w[95];
    this.InverseLT(); this.Ib6(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[88]; this.X1 ^= this.w[89]; this.X2 ^= this.w[90]; this.X3 ^= this.w[91];
    this.InverseLT(); this.Ib5(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[84]; this.X1 ^= this.w[85]; this.X2 ^= this.w[86]; this.X3 ^= this.w[87];
    this.InverseLT(); this.Ib4(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[80]; this.X1 ^= this.w[81]; this.X2 ^= this.w[82]; this.X3 ^= this.w[83];
    this.InverseLT(); this.Ib3(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[76]; this.X1 ^= this.w[77]; this.X2 ^= this.w[78]; this.X3 ^= this.w[79];
    this.InverseLT(); this.Ib2(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[72]; this.X1 ^= this.w[73]; this.X2 ^= this.w[74]; this.X3 ^= this.w[75];
    this.InverseLT(); this.Ib1(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[68]; this.X1 ^= this.w[69]; this.X2 ^= this.w[70]; this.X3 ^= this.w[71];
    this.InverseLT(); this.Ib0(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[64]; this.X1 ^= this.w[65]; this.X2 ^= this.w[66]; this.X3 ^= this.w[67];
    this.InverseLT(); this.Ib7(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[60]; this.X1 ^= this.w[61]; this.X2 ^= this.w[62]; this.X3 ^= this.w[63];
    this.InverseLT(); this.Ib6(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[56]; this.X1 ^= this.w[57]; this.X2 ^= this.w[58]; this.X3 ^= this.w[59];
    this.InverseLT(); this.Ib5(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[52]; this.X1 ^= this.w[53]; this.X2 ^= this.w[54]; this.X3 ^= this.w[55];
    this.InverseLT(); this.Ib4(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[48]; this.X1 ^= this.w[49]; this.X2 ^= this.w[50]; this.X3 ^= this.w[51];
    this.InverseLT(); this.Ib3(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[44]; this.X1 ^= this.w[45]; this.X2 ^= this.w[46]; this.X3 ^= this.w[47];
    this.InverseLT(); this.Ib2(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[40]; this.X1 ^= this.w[41]; this.X2 ^= this.w[42]; this.X3 ^= this.w[43];
    this.InverseLT(); this.Ib1(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[36]; this.X1 ^= this.w[37]; this.X2 ^= this.w[38]; this.X3 ^= this.w[39];
    this.InverseLT(); this.Ib0(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[32]; this.X1 ^= this.w[33]; this.X2 ^= this.w[34]; this.X3 ^= this.w[35];
    this.InverseLT(); this.Ib7(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[28]; this.X1 ^= this.w[29]; this.X2 ^= this.w[30]; this.X3 ^= this.w[31];
    this.InverseLT(); this.Ib6(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[24]; this.X1 ^= this.w[25]; this.X2 ^= this.w[26]; this.X3 ^= this.w[27];
    this.InverseLT(); this.Ib5(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[20]; this.X1 ^= this.w[21]; this.X2 ^= this.w[22]; this.X3 ^= this.w[23];
    this.InverseLT(); this.Ib4(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[16]; this.X1 ^= this.w[17]; this.X2 ^= this.w[18]; this.X3 ^= this.w[19];
    this.InverseLT(); this.Ib3(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[12]; this.X1 ^= this.w[13]; this.X2 ^= this.w[14]; this.X3 ^= this.w[15];
    this.InverseLT(); this.Ib2(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[8]; this.X1 ^= this.w[9]; this.X2 ^= this.w[10]; this.X3 ^= this.w[11];
    this.InverseLT(); this.Ib1(this.X0, this.X1, this.X2, this.X3);
    this.X0 ^= this.w[4]; this.X1 ^= this.w[5]; this.X2 ^= this.w[6]; this.X3 ^= this.w[7];
    this.InverseLT(); this.Ib0(this.X0, this.X1, this.X2, this.X3);

    this.ToBytes((this.w[0] ^ this.X0), output, outOff);
    this.ToBytes((this.w[1] ^ this.X1), output, outOff + 4);
    this.ToBytes((this.w[2] ^ this.X2), output, outOff + 8);
    this.ToBytes((this.w[3] ^ this.X3), output, outOff + 12);
  }

  LT() {
    let x0 = this.RotateLeft(this.X0, 13);
    let x2 = this.RotateLeft(this.X2, 3);
    let x1 = this.X1 ^ x0 ^ x2;
    let x3 = this.X3 ^ x2 ^ x0 << 3;
    this.X1 = this.RotateLeft(x1, 1);
    this.X3 = this.RotateLeft(x3, 7);
    this.X0 = this.RotateLeft(x0 ^ this.X1 ^ this.X3, 5);
    this.X2 = this.RotateLeft(x2 ^ this.X3 ^ (this.X1 << 7), 22);
  }

  InverseLT() {
    var x2 = this.RotateLeft(this.X2, 10) ^ this.X3 ^ (this.X1 << 7);
    var x0 = this.RotateLeft(this.X0, 27) ^ this.X1 ^ this.X3;
    var x3 = this.RotateLeft(this.X3, 25);
    var x1 = this.RotateLeft(this.X1, 31);
    this.X3 = x3 ^ x2 ^ (x0 << 3);
    this.X1 = x1 ^ x0 ^ x2;
    this.X2 = this.RotateLeft(x2, 29);
    this.X0 = this.RotateLeft(x0, 19);
  }

  XorBytes(a, b) {
    return Uint8Array.from(a, (v, i) => v ^ b[i])
  }
  RotateLeft(i, distance) { 
    return (i << distance) | (i >>> (32 - distance))
  }
  // RotateRight(i, distance) {
  //   return (i >> distance) | (i << -distance);
  // }

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
    this.X3 = (a & d) ^ t4;
    let t7 = a ^ (b & t1);
    this.X2 = t4 ^ (c | t7);
    let t12 = this.X3 & (t3 ^ t7);
    this.X1 = (~t3) ^ t12;
    this.X0 = t12 ^ (~t7);
  }

  Sb1(a, b, c, d)
  {
    var t2 = b ^ (~a);
    var t5 = c ^ (a | t2);
    this.X2 = d ^ t5;
    var t7 = b ^ (d | t2);
    var t8 = t2 ^ this.X2;
    this.X3 = t8 ^ (t5 & t7);
    var t11 = t5 ^ t7;
    this.X1 = this.X3 ^ t11;
    this.X0 = t5 ^ (t8 & t11);
  }

  Sb2(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = b ^ d;
    var t3 = c & t1;
    this.X0 = t2 ^ t3;
    var t5 = c ^ t1;
    var t6 = c ^ this.X0;
    var t7 = b & t6;
    this.X3 = t5 ^ t7;
    this.X2 = a ^ ((d | t7) & (this.X0 | t5));
    this.X1 = (t2 ^ this.X3) ^ (this.X2 ^ (d | t1));
  }

  Sb3(a, b, c, d)
  {
    var t1 = a ^ b;
    var t2 = a & c;
    var t3 = a | d;
    var t4 = c ^ d;
    var t5 = t1 & t3;
    var t6 = t2 | t5;
    this.X2 = t4 ^ t6;
    var t8 = b ^ t3;
    var t9 = t6 ^ t8;
    var t10 = t4 & t9;
    this.X0 = t1 ^ t10;
    var t12 = this.X2 & this.X0;
    this.X1 = t9 ^ t12;
    this.X3 = (b | d) ^ (t4 ^ t12);
  }

  Sb4(a, b, c, d)
  {
    var t1 = a ^ d;
    var t2 = d & t1;
    var t3 = c ^ t2;
    var t4 = b | t3;
    this.X3 = t1 ^ t4;
    var t6 = ~b;
    var t7 = t1 | t6;
    this.X0 = t3 ^ t7;
    var t9 = a & this.X0;
    var t10 = t1 ^ t6;
    var t11 = t4 & t10;
    this.X2 = t9 ^ t11;
    this.X1 = (a ^ t3) ^ (t10 & this.X2);
  }

  Sb5(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = a ^ b;
    var t3 = a ^ d;
    var t4 = c ^ t1;
    var t5 = t2 | t3;
    this.X0 = t4 ^ t5;
    var t7 = d & this.X0;
    var t8 = t2 ^ this.X0;
    this.X1 = t7 ^ t8;
    var t10 = t1 | this.X0;
    var t11 = t2 | t7;
    var t12 = t3 ^ t10;
    this.X2 = t11 ^ t12;
    this.X3 = (b ^ t7) ^ (this.X1 & t12);
  }

  Sb6(a, b, c, d)
  {
    var t1 = ~a;
    var t2 = a ^ d;
    var t3 = b ^ t2;
    var t4 = t1 | t2;
    var t5 = c ^ t4;
    this.X1 = b ^ t5;
    var t7 = t2 | this.X1;
    var t8 = d ^ t7;
    var t9 = t5 & t8;
    this.X2 = t3 ^ t9;
    var t11 = t5 ^ t8;
    this.X0 = this.X2 ^ t11;
    this.X3 = (~t5) ^ (t3 & t11);
  }

  Sb7(a, b, c, d)
  {
    var t1 = b ^ c;
    var t2 = c & t1;
    var t3 = d ^ t2;
    var t4 = a ^ t3;
    var t5 = d | t1;
    var t6 = t4 & t5;
    this.X1 = b ^ t6;
    var t8 = t3 | this.X1;
    var t9 = a & t4;
    this.X3 = t1 ^ t9;
    var t11 = t4 ^ t8;
    var t12 = this.X3 & t11;
    this.X2 = t3 ^ t12;
    this.X0 = (~t11) ^ (this.X3 & this.X2);
  }

  Ib0(a, b, c, d){
    var t1 = ~a;
    var t2 = a ^ b;
    var t4 = d ^ (t1 | t2);
    var t5 = c ^ t4;
    this.X2 = t2 ^ t5;
    var t8 = t1 ^ (d & t2);
    this.X1 = t4 ^ (this.X2 & t8);
    this.X3 = (a & t4) ^ (t5 | this.X1);
    this.X0 = this.X3 ^ (t5 ^ t8);
  }
  
  Ib1(a, b, c, d) {
    var t1 = b ^ d;
    var t3 = a ^ (b & t1);
    var t4 = t1 ^ t3;
    this.X3 = c ^ t4;
    var t7 = b ^ (t1 & t3);
    var t8 = this.X3 | t7;
    this.X1 = t3 ^ t8;
    var t10 = ~this.X1;
    var t11 = this.X3 ^ t7;
    this.X0 = t10 ^ t11;
    this.X2 = t4 ^ (t10 | t11);
  }

  Ib2(a, b, c, d) {
    var t1 = b ^ d;
    var t2 = ~t1;
    var t3 = a ^ c;
    var t4 = c ^ t1;
    var t5 = b & t4;
    this.X0 = t3 ^ t5;
    var t7 = a | t2;
    var t8 = d ^ t7;
    var t9 = t3 | t8;
    this.X3 = t1 ^ t9;
    var t11 = ~t4;
    var t12 = this.X0 | this.X3;
    this.X1 = t11 ^ t12;
    this.X2 = (d & t11) ^ (t3 ^ t12);
  }

  Ib3(a, b, c, d) {
    var t1 = a | b;
    var t2 = b ^ c;
    var t3 = b & t2;
    var t4 = a ^ t3;
    var t5 = c ^ t4;
    var t6 = d | t4;
    this.X0 = t2 ^ t6;
    var t8 = t2 | t6;
    var t9 = d ^ t8;
    this.X2 = t5 ^ t9;
    var t11 = t1 ^ t9;
    var t12 = this.X0 & t11;
    this.X3 = t4 ^ t12;
    this.X1 = this.X3 ^ (this.X0 ^ t11);
  }

  Ib4(a, b, c, d) {
    var t1 = c | d;
    var t2 = a & t1;
    var t3 = b ^ t2;
    var t4 = a & t3;
    var t5 = c ^ t4;
    this.X1 = d ^ t5;
    var t7 = ~a;
    var t8 = t5 & this.X1;
    this.X3 = t3 ^ t8;
    var t10 = this.X1 | t7;
    var t11 = d ^ t10;
    this.X0 = this.X3 ^ t11;
    this.X2 = (t3 & t11) ^ (this.X1 ^ t7);
  }

  Ib5(a, b, c, d) {
    var t1 = ~c;
    var t2 = b & t1;
    var t3 = d ^ t2;
    var t4 = a & t3;
    var t5 = b ^ t1;
    this.X3 = t4 ^ t5;
    var t7 = b | this.X3;
    var t8 = a & t7;
    this.X1 = t3 ^ t8;
    var t10 = a | d;
    var t11 = t1 ^ t7;
    this.X0 = t10 ^ t11;
    this.X2 = (b & t10) ^ (t4 | (a ^ c));
  }

  Ib6(a, b, c, d) {
    var t1 = ~a;
    var t2 = a ^ b;
    var t3 = c ^ t2;
    var t4 = c | t1;
    var t5 = d ^ t4;
    this.X1 = t3 ^ t5;
    var t7 = t3 & t5;
    var t8 = t2 ^ t7;
    var t9 = b | t8;
    this.X3 = t5 ^ t9;
    var t11 = b | this.X3;
    this.X0 = t8 ^ t11;
    this.X2 = (d & t1) ^ (t3 ^ t11);
}

  Ib7(a, b, c, d) {
    var t3 = c | (a & b);
    var t4 = d & (a | b);
    this.X3 = t3 ^ t4;
    var t6 = ~d;
    var t7 = b ^ t4;
    var t9 = t7 | (this.X3 ^ t6);
    this.X1 = a ^ t9;
    this.X0 = (c ^ t7) ^ (d | this.X1);
    this.X2 = (t3 ^ this.X1) ^ (this.X0 ^ (a & this.X3));
  }
}
