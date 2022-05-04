import { NetworkType } from '@elrondnetwork/dapp-core';
import { FormConfigType, NftType } from 'types';

export interface ComputedNftType {
  receiver: string;
  quantity: string;
  nft: NftType;
}

export interface GetInitialValuesType {
  configValues: FormConfigType;
  address: string;
  balance: string;
  egldLabel: string;
  nonce: number;
  chainId: string;
  networkConfig?: NetworkType;
}
