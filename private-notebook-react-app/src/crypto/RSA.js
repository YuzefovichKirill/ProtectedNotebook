const bigInt = require('big-integer');
export const defaultLength = 2048

const genPrime = (l) => {
  const min = bigInt.one.shiftLeft(l - 1)
  const max = bigInt.one.shiftLeft(l).prev()

  while(true) {
    let p = bigInt.randBetween(min, max)
    if (p.isProbablePrime(100))
      return p
  }
}

export const genKey = (l) => {
  let e = bigInt((1<<16) + 1)
  let p
  let q
  let totient

  do {
    p = genPrime(Math.floor(l / 2));
    q = genPrime(Math.ceil(l / 2));
    totient = bigInt.lcm(p.prev(), q.prev())
  } while (bigInt.gcd(e, totient).notEquals(1) || p.minus(q).abs().shiftRight(l / 2 - 100).isZero());

  return {e, n: p.multiply(q), d: e.modInv(totient)}
}

// export const encrypt = (msg, n, e) => {
//   var encodedMsg = encode(msg)
//   var encodedCipherText = bigInt(encodedMsg).modPow(e, n)
//   return decode(encodedCipherText)
// }

// cipherText: base64 string, d: string, n: string
export const RSADecrypt = (cipherText, d, n) => {
  var encodedCipherText = encode(cipherText)
  var encodedMsg = bigInt(encodedCipherText).modPow(bigInt(d), bigInt(n))
  //console.log('key in bigInt: ', encodedMsg)
  return decode(encodedMsg)
}

// base64 to bigInt
export const encode = (str) => {
  return bigInt(atob(str), 10)
}

// bigInt to byte[]
export const decode = (code) => {
  const stringified = code.toString(16);

  var bytes = []
  for (var i = 0; i < stringified.length; i += 2) {
    var byte = parseInt(stringified.substring(i, i + 2), 16);
    bytes.push(byte)
  }
  bytes = bytes.reverse()
  return bytes
}
