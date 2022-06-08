import {
  isTokenTransfer,
  denominate,
  MultiSignTxType,
  constants
} from '@elrondnetwork/dapp-core';
import { tokenGasLimit } from 'constants/index';
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
          denomination: constants.denomination,
          decimals: constants.decimals,
          showLastNonZeroDecimal: true,
          addCommas: false
        }),
    tokenId: tokenFound ? tokenId : egldLabel,
    gasLimit: (transaction.gasLimit.valueOf() || gasLimit).toString(),
    gasPrice: denominate({
      input: (transaction.gasPrice.valueOf() || constants.gasPrice).toString(),
      denomination: constants.denomination,
      decimals: constants.decimals,
      showLastNonZeroDecimal: true,
      addCommas: false
    }),
    data: String(transaction.data),
    nonce: transaction.nonce.valueOf().toString()
  };

  return values;
}
