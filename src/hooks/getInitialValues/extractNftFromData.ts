import { decodePart } from '@multiversx/sdk-dapp/out/utils/decoders/decodePart';
import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import { TransferDataEnum } from '../../types';
import { bech32 } from 'helpers/transformations';
import { SearchNFTPropsType } from './searchNft';

interface ExistingNftType {
  collection: string;
  nonce: string;
  quantity: string;
  receiver: string;
}

const decodeData = (data: string) => {
  const nonceIndex = 2;
  const amountIndex = 3;
  const parts = data.split('@');
  const decodedParts = parts.map((part, i) =>
    [nonceIndex, amountIndex].includes(i) ? part : decodePart(part)
  );
  return decodedParts;
};

export const extractNftFromData = ({
  data,
  nft,
  address
}: SearchNFTPropsType): ExistingNftType | undefined => {
  const isBurnNFT = data?.startsWith(TransferDataEnum.ESDTNFTBurn);
  const isNFTTransfer = data?.startsWith(TransferDataEnum.ESDTNFTTransfer);
  const isNFTData = (isBurnNFT || isNFTTransfer) && data.includes('@');

  if (isNFTData) {
    try {
      const [, collection, nonce, quantity, receiver] = nft
        ? [
            TransferDataEnum.ESDTNFTTransfer,
            nft.collection,
            nft.nonce,
            nft.quantity,
            nft.receiver
          ]
        : decodeData(data);

      // Burn NFT may not have receiver
      const usedReceiver = isBurnNFT && !receiver ? address : receiver;
      const hasAllDataFields = [
        collection,
        nonce,
        quantity,
        usedReceiver
      ].every((el) => el);

      const isValidReceiver = addressIsValid(bech32.encode(usedReceiver));

      if (hasAllDataFields && isValidReceiver) {
        return {
          collection,
          nonce,
          quantity,
          receiver: usedReceiver
        };
      }
    } catch (err) {
      console.error('Could not extract NFT from data:', err);
      return undefined;
    }
  }

  return undefined;
};
