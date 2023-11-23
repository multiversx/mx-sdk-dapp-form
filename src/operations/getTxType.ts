import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { NftEnumType, PartialNftType } from 'types';
import { TransactionTypeEnum } from 'types';

export function getTxType({
  nft,
  tokenId
}: {
  nft?: PartialNftType;
  tokenId: string;
}): TransactionTypeEnum {
  const { isEsdt, isNft, isEgld } = getIdentifierType(tokenId);

  if (isEgld) {
    return TransactionTypeEnum.EGLD;
  }

  if (nft?.type === NftEnumType.NonFungibleESDT) {
    return TransactionTypeEnum.NonFungibleESDT;
  }

  if (nft?.type === NftEnumType.SemiFungibleESDT) {
    return TransactionTypeEnum.SemiFungibleESDT;
  }

  if (nft?.type === NftEnumType.MetaESDT || isNft) {
    return TransactionTypeEnum.MetaESDT;
  }

  if (isEsdt) {
    return TransactionTypeEnum.ESDT;
  }

  return TransactionTypeEnum.EGLD;
}

export default getTxType;
