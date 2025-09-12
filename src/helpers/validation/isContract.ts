import { Address } from '@multiversx/sdk-core';

export const isContract = (address: string) =>
  new Address(address).isSmartContract();
