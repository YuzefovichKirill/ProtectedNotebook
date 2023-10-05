const bigInt = require('big-integer');

export const defaultLength = 1200

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

export const encrypt = (encodedMsg, n, e) => {
  return bigInt(encodedMsg).modPow(e, n);
}

export const decrypt = (encryptedMsg, d, n) => {
  return bigInt(encryptedMsg).modPow(d, n); 
}

export const encode = (str) => {
  const codes = str
    .split('')
    .map(i => i.charCodeAt())
    .join('');

  return bigInt(codes);
}

export const decode = (code) => {
  const stringified = code.toString();
  let string = '';

  for (let i = 0; i < stringified.length; i += 2) {
    let num = Number(stringified.substr(i, 2));
    
    if (num <= 30) {
      string += String.fromCharCode(Number(stringified.substr(i, 3)));
      i++;
    } else {
      string += String.fromCharCode(num);
    }
  }

  return string;
}