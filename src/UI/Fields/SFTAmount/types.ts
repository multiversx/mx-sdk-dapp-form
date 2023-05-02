import { PartialNftType } from 'types';

export interface EsdtAmountType {
  tokenBalance: string;
}

export interface NftAmountType {
  nftBalance: string;
  nft: PartialNftType;
}
