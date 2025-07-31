import { Address } from '@multiversx/sdk-core';

const encode = (publicKey: string) => Address.newFromHex(publicKey).toBech32();
const decode = (address: string) => Address.newFromBech32(address).toHex();

export const bech32 = { encode, decode };
