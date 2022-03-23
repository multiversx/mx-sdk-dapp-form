import bech32lib from 'bech32';

const encode = (publicKey: any) => {
  const words = bech32lib.toWords(Buffer.from(publicKey, 'hex'));
  return bech32lib.encode('erd', words);
};

const decode = (address: any) => {
  const decoded = bech32lib.decode(address, 256);
  return Buffer.from(bech32lib.fromWords(decoded.words)).toString('hex');
};

export const bech32 = { encode, decode };
