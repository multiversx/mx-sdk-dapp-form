import { NftEnumType } from '@elrondnetwork/dapp-core/types/tokens';

export { NftEnumType };

export enum TxTypeEnum {
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
