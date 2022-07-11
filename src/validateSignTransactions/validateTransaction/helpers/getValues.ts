import {
  decimals,
  denomination,
  gasPrice
} from '@elrondnetwork/dapp-core/constants/index';
import { MultiSignTxType } from '@elrondnetwork/dapp-core/types';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
import { isTokenTransfer } from '@elrondnetwork/dapp-core/utils/transactions/isTokenTransfer';

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
          denomination: denomination,
          decimals: decimals,
          showLastNonZeroDecimal: true,
          addCommas: false
        }),
    tokenId: tokenFound ? tokenId : egldLabel,
    gasLimit: String(transaction.gasLimit.valueOf() || gasLimit),
    gasPrice: denominate({
      input: String(transaction.gasPrice.valueOf() || gasPrice),
      denomination: denomination,
      decimals: decimals,
      showLastNonZeroDecimal: true,
      addCommas: false
    }),
    data: String(transaction.data),
    nonce: transaction.nonce.valueOf().toString()
  };

  return values;
}
