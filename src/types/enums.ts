import { NftEnumType } from '@multiversx/sdk-dapp/out/types/tokens.types';

export { NftEnumType };

export enum TransactionTypeEnum {
  EGLD = 'EGLD',
  ESDT = 'ESDT',
  MetaESDT = 'MetaESDT',
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT'
}

export enum TransferDataEnum {
  ESDTNFTTransfer = 'ESDTNFTTransfer',
  ESDTNFTCreate = 'ESDTNFTCreate',
  ESDTNFTBurn = 'ESDTNFTBurn',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer'
}
