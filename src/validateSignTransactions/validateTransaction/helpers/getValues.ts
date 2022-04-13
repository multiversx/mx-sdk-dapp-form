import {
  isTokenTransfer,
  denominate,
  MultiSignTxType
} from '@elrondnetwork/dapp-core';
import {
  tokenGasLimit,
  denomination,
  decimals,
  defaultGasPrice as configGasPrice
} from 'constants/index';
import { TxSignValuesType } from '../types';

export function getValues(props: {
  tx: MultiSignTxType;
  tokenId: string;
  egldLabel: string;
  tokenFound?: boolean;
  tokenAmount: string;
}) {
  const { tx, tokenId, egldLabel, tokenFound, tokenAmount } = props;
  const transaction = tx.transaction.toPlainObject();
  const destinationAddress = transaction.receiver;
  const isTokenTransaction = Boolean(
    tokenId && isTokenTransfer({ tokenId, erdLabel: egldLabel })
  );

  const gasLimit = isTokenTransaction ? tokenGasLimit : '0';

  const values: TxSignValuesType = {
    receiver: destinationAddress,
    amount: tokenFound
      ? tokenAmount
      : denominate({
          input: transaction.value ? transaction.value : '0',
          denomination,
          decimals,
          showLastNonZeroDecimal: true,
          addCommas: false
        }),
    tokenId: tokenFound ? tokenId : egldLabel,
    gasLimit: transaction.gasLimit || gasLimit,
    gasPrice: denominate({
      input: transaction.gasPrice || configGasPrice,
      denomination,
      decimals,
      showLastNonZeroDecimal: true,
      addCommas: false
    }),
    data: String(transaction.data),
    nonce: transaction.nonce
  };

  return values;
}
