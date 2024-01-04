import { DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { formatAmount } from 'helpers';
import { NftEnumType } from 'types';
import { ComputedNftType } from './types';

const nftDefaultAmount = '1';

interface GetInitialAmountParamsType {
  computedNft: ComputedNftType | null;
  amount: string;
}

export const getInitialAmount = ({
  computedNft,
  amount
}: GetInitialAmountParamsType) => {
  if (computedNft?.nft?.type === NftEnumType.NonFungibleESDT) {
    return nftDefaultAmount;
  }

  const isMetaESDT = computedNft?.nft?.type === NftEnumType.MetaESDT;
  const amountValue = computedNft?.quantity || amount;

  if (isMetaESDT && amountValue) {
    return formatAmount({
      input: amountValue,
      decimals: computedNft?.nft?.decimals,
      showLastNonZeroDecimal: true,
      addCommas: false,
      digits: DIGITS
    });
  }
  return amountValue;
};
