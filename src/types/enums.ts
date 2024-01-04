import { NftEnumType } from '@multiversx/sdk-dapp/types/tokens.types';

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
  ESDTTransfer = 'ESDTTransfer',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer'
}
