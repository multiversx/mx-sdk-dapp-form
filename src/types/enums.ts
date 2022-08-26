import { NftEnumType } from '@elrondnetwork/dapp-core/types/tokens.types';

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
  ESDTTransfer = 'ESDTTransfer',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer'
}
