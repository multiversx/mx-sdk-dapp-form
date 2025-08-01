import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/index';
import { bech32 } from 'helpers/transformations';
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

interface IComputeNftDataFieldParams {
  nft?: PartialNftType;
  amount: string;
  receiver: string;
  errors: boolean;
  isDeposit?: boolean;
}

export const computeNftDataField = ({
  nft,
  amount,
  receiver,
  errors,
  isDeposit
}: IComputeNftDataFieldParams) => {
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

interface IGetDataFieldParams {
  txType: TransactionTypeEnum;
  values: ExtendedValuesType;
  nft?: PartialNftType;
  amountError?: boolean;
  receiverError?: string;
  isDeposit?: boolean;
}

export const getDataField = ({
  txType,
  values,
  nft,
  amountError,
  receiverError,
  isDeposit
}: IGetDataFieldParams) => {
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
