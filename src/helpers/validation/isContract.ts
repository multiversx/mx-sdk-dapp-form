import { Address } from '@multiversx/sdk-core';

export const isContract = (address: string) => {
  try {
    return new Address(address).isSmartContract();
  } catch (error) {
    return false;
  }
};
