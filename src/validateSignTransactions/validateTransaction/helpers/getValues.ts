import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@elrondnetwork/dapp-core/constants/index';
import { MultiSignTransactionType } from '@elrondnetwork/dapp-core/types/transactions.types';
import { isTokenTransfer } from '@elrondnetwork/dapp-core/utils/transactions/isTokenTransfer';

import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { denominate } from 'helpers';
import { TxSignValuesType } from '../types';

export function getValues(props: {
  tx: MultiSignTransactionType;
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

  const gasLimit = isTokenTransaction ? TOKEN_GAS_LIMIT : ZERO;

  const values: TxSignValuesType = {
    receiver: destinationAddress,
    amount: tokenFound
      ? tokenAmount
      : denominate({
          input: transaction.value ? transaction.value : ZERO,
          decimals: DECIMALS,
          digits: DIGITS,
          showLastNonZeroDecimal: true,
          addCommas: false
        }),
    tokenId: tokenFound ? tokenId : egldLabel,
    gasLimit: String(transaction.gasLimit.valueOf() || gasLimit),
    gasPrice: denominate({
      input: String(transaction.gasPrice.valueOf() || GAS_PRICE),
      decimals: DECIMALS,
      digits: DIGITS,
      showLastNonZeroDecimal: true,
      addCommas: false
    }),
    data: String(transaction.data),
    nonce: transaction.nonce.valueOf().toString()
  };

  return values;
}
