import { Address } from '@multiversx/sdk-core/out';

const encode = (publicKey: any) => {
  return Address.fromHex(publicKey).toBech32();
};

const decode = (address: any) => {
  return Address.newFromBech32(address).hex();
};

export const bech32 = { encode, decode };
