import { NetworkType } from '@elrondnetwork/dapp-core/types/network';
import { FormConfigType, PartialNftType } from 'types';

export interface ComputedNftType {
  receiver: string;
  quantity: string;
  nft: PartialNftType;
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
