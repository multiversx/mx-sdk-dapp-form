import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import BigNumber from 'bignumber.js';
import { bech32 } from 'helpers';
import { NftEnumType, NftType, TxTypeEnum, ExtendedValuesType } from 'types';
import getTokenDetails from './getTokenDetails';

const evenLengthValue = (value: string) =>
  value.length % 2 === 0 ? value : `0${value}`;

export const computeTokenDataField = ({
  amount,
  decimals,
  tokenId
}: {
  amount: string;
  tokenId: string;
  decimals: number;
}) => {
  const hexEncodedId = evenLengthValue(Buffer.from(tokenId).toString('hex'));
  const hexEncodedValue = evenLengthValue(
    new BigNumber(nominate(amount, decimals)).toString(16)
  );
  const data = `ESDTTransfer@${hexEncodedId}@${hexEncodedValue}`;
  return data;
};

export const computeNftDataField = ({
  nft,
  amount,
  receiver,
  errors
}: {
  nft?: NftType;
  amount: string;
  receiver: string;
  errors: boolean;
}) => {
  if (nft && amount && receiver && !errors) {
    let dataStr = 'ESDTNFTTransfer';
    const quantity =
      nft?.type === NftEnumType.MetaESDT
        ? nominate(amount, nft.decimals)
        : amount;
    dataStr += `@${Buffer.from(String(nft.collection)).toString('hex')}`;
    dataStr += `@${evenLengthValue(
      new BigNumber(String(nft.nonce)).toString(16)
    )}`;
    dataStr += `@${evenLengthValue(new BigNumber(quantity).toString(16))}`;
    dataStr += `@${bech32.decode(receiver)}`;
    return dataStr;
  } else {
    return '';
  }
};

export const getDataField = ({
  txType,
  values,
  nft,
  amountError,
  receiverError
}: {
  txType: TxTypeEnum;
  values: ExtendedValuesType;
  nft?: NftType;
  amountError?: boolean;
  receiverError?: string;
}) => {
  const { tokens, tokenId, amount, receiver, customBalanceRules } = values;
  if (tokens && txType === TxTypeEnum.ESDT && !amountError) {
    const { decimals } = getTokenDetails({
      tokens,
      tokenId
    });

    return computeTokenDataField({
      amount,
      tokenId,
      decimals
    });
  }
  // NFT SFT MetaESDT
  if (txType !== TxTypeEnum.EGLD) {
    return computeNftDataField({
      nft,
      amount,
      receiver,
      errors: Boolean(amountError || receiverError)
    });
  }
  if (customBalanceRules?.dataFieldBuilder != null) {
    return customBalanceRules.dataFieldBuilder(values);
  }
  return '';
};
