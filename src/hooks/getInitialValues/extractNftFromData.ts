import { Address } from '@multiversx/sdk-core';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { decodePart } from '@multiversx/sdk-dapp/utils/decoders/decodePart';

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

export default function extractNftFromData(
  data: string,
  nft?: ExistingNftType
): ExistingNftType | undefined {
  if (data && data.startsWith('ESDTNFTTransfer') && data.includes('@')) {
    try {
      const [, /*ESDTNFTTransfer*/ collection, nonce, quantity, receiver] = nft
        ? [
            'ESDTNFTTransfer',
            nft.collection,
            nft.nonce,
            nft.quantity,
            nft.receiver
          ]
        : decodeData(data);
      if (
        [collection, nonce, quantity, receiver].every((el) => Boolean(el)) &&
        addressIsValid(new Address(receiver).bech32())
      ) {
        return {
          collection,
          nonce,
          quantity,
          receiver
        };
      }
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
}
