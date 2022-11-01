import { NetworkType } from '@elrondnetwork/dapp-core/types/network.types';
import { FormConfigType, PartialNftType } from 'types';

export interface ComputedNftType {
  receiver: string;
  quantity: string;
  /**
   * if set, transfer is only allowed to listed accounts
   */
  allowedReceivers: string[] | null;
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
