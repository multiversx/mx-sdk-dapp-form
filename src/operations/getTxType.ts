import { TxTypeEnum } from 'logic/types';
import getIdentifierType from 'logic/validation/getIdentifierType';
import { NftEnumType, NftType } from 'types';

export function getTxType({
  nft,
  tokenId
}: {
  nft?: NftType;
  tokenId: string;
}): TxTypeEnum {
  const { isEsdt, isNft } = getIdentifierType(tokenId);

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
