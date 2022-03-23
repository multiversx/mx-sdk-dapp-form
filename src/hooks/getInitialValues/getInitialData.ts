import { computeNftDataField } from 'operations';
import { ComputedNftType } from './types';

export function getInitialData(props: {
  computedNft: ComputedNftType | null;
  data?: string;
  receiver: string;
  amount: string;
}) {
  const { computedNft, data, amount, receiver } = props;
  const nft = computedNft?.nft;
  const nftData = nft
    ? computeNftDataField({
        nft,
        amount: amount,
        receiver,
        errors: false
      })
    : '';

  const initData = data ? data : nftData;
  return initData;
}
