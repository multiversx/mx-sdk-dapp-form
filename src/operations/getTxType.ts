import { getIdentifierType } from '@elrondnetwork/dapp-core/utils/validation/getIdentifierType';
import { NftEnumType, PartialNftType } from 'types';
import { TxTypeEnum } from 'types';

export function getTxType({
  nft,
  tokenId
}: {
  nft?: PartialNftType;
  tokenId: string;
}): TxTypeEnum {
  const { isEsdt, isNft, isEgld } = getIdentifierType(tokenId);

  if (isEgld) {
    return TxTypeEnum.EGLD;
  }
  if (nft?.type === NftEnumType.NonFungibleESDT) {
    return TxTypeEnum.NonFungibleESDT;
  }
  if (nft?.type === NftEnumType.SemiFungibleESDT) {
    return TxTypeEnum.SemiFungibleESDT;
  }
  if (nft?.type === NftEnumType.MetaESDT || isNft) {
    return TxTypeEnum.MetaESDT;
  }
  if (isEsdt) {
    return TxTypeEnum.ESDT;
  }
  return TxTypeEnum.EGLD;
}

export default getTxType;
