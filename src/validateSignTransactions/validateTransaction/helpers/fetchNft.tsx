import { ApiConfigType } from 'apiCalls';
import { searchNft } from 'hooks';
import { TransferDataEnum } from 'types';

const nftTransaction = 'nftTransaction';

interface FetchNftType {
  type: string;
  nonce: string;
  tokenId: string;
  amount: string;
  address: string;
  data: string;
  receiver: string;
}

export async function fetchNft(props: FetchNftType, apiConfig: ApiConfigType) {
  const { type, nonce, amount, receiver, tokenId, data, address } = props;

  if (type === nftTransaction) {
    const nft = {
      collection: tokenId,
      nonce,
      quantity: amount,
      receiver
    };
    const computedNft = await searchNft(
      { data: `${TransferDataEnum.ESDTNFTTransfer}@`, nft, address },
      apiConfig
    );

    return computedNft;
  } else {
    const computedNft = await searchNft({ data, address }, apiConfig);
    return computedNft;
  }
}
