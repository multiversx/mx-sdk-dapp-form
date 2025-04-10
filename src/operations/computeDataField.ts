import BigNumber from 'bignumber.js';

import { ZERO } from 'constants/index';
import { bech32, parseAmount } from 'helpers';
import {
  NftEnumType,
  PartialNftType,
  TransactionTypeEnum,
  ExtendedValuesType
} from 'types';
import getTokenDetails from './getTokenDetails';

const evenLengthValue = (value: string) =>
  value.length % 2 === 0 ? value : `0${value}`;

const getDepositHex = (isDeposit?: boolean) =>
  isDeposit
    ? `@${evenLengthValue(Buffer.from('deposit').toString('hex'))}`
    : '';

interface IComputeTokenDataFieldParams {
  amount: string;
  tokenId: string;
  decimals: number;
  isDeposit?: boolean;
}

export const computeTokenDataField = ({
  amount,
  decimals,
  tokenId,
  isDeposit
}: IComputeTokenDataFieldParams) => {
  const amountValue = Boolean(amount) ? amount : ZERO;
  const hexEncodedId = evenLengthValue(Buffer.from(tokenId).toString('hex'));

  const hexEncodedValue = evenLengthValue(
    new BigNumber(parseAmount(amountValue, decimals)).toString(16)
  );

  const hexEncodedDeposit = getDepositHex(isDeposit);

  const data = `ESDTTransfer@${hexEncodedId}@${hexEncodedValue}${hexEncodedDeposit}`;
  return data;
};

export const computeNftDataField = ({
  nft,
  amount,
  receiver,
  errors,
  isDeposit
}: {
  nft?: PartialNftType;
  amount: string;
  receiver: string;
  errors: boolean;
  isDeposit?: boolean;
}) => {
  const isNoErrorNft = nft && amount && receiver && !errors;

  if (!isNoErrorNft) {
    return '';
  }

  try {
    let dataStr = 'ESDTNFTTransfer';
    const quantity =
      nft?.type === NftEnumType.MetaESDT
        ? parseAmount(amount, nft.decimals)
        : amount;
    dataStr += `@${Buffer.from(String(nft.collection)).toString('hex')}`;
    dataStr += `@${evenLengthValue(
      new BigNumber(String(nft.nonce)).toString(16)
    )}`;
    dataStr += `@${evenLengthValue(new BigNumber(quantity).toString(16))}`;
    dataStr += `@${bech32.decode(receiver)}`;
    dataStr += getDepositHex(isDeposit);
    return dataStr;
  } catch (err) {
    return '';
  }
};

export const getDataField = ({
  txType,
  values,
  nft,
  amountError,
  receiverError,
  isDeposit
}: {
  txType: TransactionTypeEnum;
  values: ExtendedValuesType;
  nft?: PartialNftType;
  amountError?: boolean;
  receiverError?: string;
  isDeposit?: boolean;
}) => {
  const { tokens, tokenId, amount, receiver } = values;
  if (tokens && txType === TransactionTypeEnum.ESDT && !amountError) {
    const { decimals } = getTokenDetails({
      tokens,
      tokenId
    });

    return computeTokenDataField({
      amount,
      tokenId,
      decimals,
      isDeposit
    });
  }
  // NFT SFT MetaESDT
  if (txType !== TransactionTypeEnum.EGLD) {
    return computeNftDataField({
      nft,
      amount,
      receiver,
      errors: Boolean(amountError || receiverError),
      isDeposit
    });
  }

  return values.data;
};
