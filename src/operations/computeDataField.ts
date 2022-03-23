import { nominate } from '@elrondnetwork/dapp-core';
import BigNumber from 'bignumber.js';
import { bech32 } from 'helpers';
import getTokenDetails from 'logic/operations/getTokenDetails';
import { TxTypeEnum, ValuesType } from 'logic/types';
import { NftEnumType, NftType, TokenType } from 'types';

const evenLengthValue = (value: string) =>
  value.length % 2 === 0 ? value : `0${value}`;

export const computeTokenDataField = ({
  amount,
  tokenDenomination,
  tokenId
}: {
  amount: string;
  tokenId: string;
  tokenDenomination: number;
}) => {
  const hexEncodedId = evenLengthValue(Buffer.from(tokenId).toString('hex'));
  const hexEncodedValue = evenLengthValue(
    new BigNumber(nominate(amount, tokenDenomination)).toString(16)
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

export const getEsdtNftDataField = ({
  txType,
  tokens,
  values,
  nft,
  amountError,
  receiverError
}: {
  txType: TxTypeEnum;
  tokens?: TokenType[];
  values: ValuesType;
  nft?: NftType;
  amountError?: boolean;
  receiverError?: string;
}) => {
  if (tokens && txType === TxTypeEnum.ESDT && !amountError) {
    const { tokenDenomination } = getTokenDetails({
      tokens,
      tokenId: values.tokenId
    });
    return computeTokenDataField({
      amount: values.amount,
      tokenId: values.tokenId,
      tokenDenomination
    });
  }
  // NFT SFT MetaESDT
  if (txType !== TxTypeEnum.EGLD) {
    return computeNftDataField({
      nft,
      amount: values.amount,
      receiver: values.receiver,
      errors: Boolean(amountError || receiverError)
    });
  }
  return '';
};
