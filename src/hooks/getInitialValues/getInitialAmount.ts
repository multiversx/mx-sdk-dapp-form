import { DIGITS } from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { NftEnumType } from 'types';
import { ComputedNftType } from './types';

const nftDefaultAmount = '1';

export function getInitialAmount(props: {
  computedNft: ComputedNftType | null;
  amount: string;
}) {
  const { computedNft, amount } = props;
  if (computedNft?.nft?.type === NftEnumType.NonFungibleESDT) {
    return nftDefaultAmount;
  }

  const isMetaESDT = computedNft?.nft?.type === NftEnumType.MetaESDT;

  const amountValue = computedNft?.quantity || amount;

  if (isMetaESDT && amountValue) {
    return denominate({
      input: amountValue,
      denomination: computedNft?.nft?.decimals,
      showLastNonZeroDecimal: true,
      addCommas: false,
      decimals: DIGITS
    });
  }
  return amountValue;
}

export default getInitialAmount;
