import {
  DIGITS,
  DECIMALS,
  GAS_PRICE
} from '@multiversx/sdk-dapp/constants/index';
import { MultiSignTransactionType } from '@multiversx/sdk-dapp/types/transactions.types';
import { isTokenTransfer } from '@multiversx/sdk-dapp/utils/transactions/isTokenTransfer';

import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { formatAmount } from 'helpers';
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
  const receiver = transaction.receiver;
  const isTokenTransaction = Boolean(
    tokenId && isTokenTransfer({ tokenId, erdLabel: egldLabel })
  );

  const gasLimit = isTokenTransaction ? TOKEN_GAS_LIMIT : ZERO;

  const values: TxSignValuesType = {
    receiver,
    amount: tokenFound
      ? tokenAmount
      : formatAmount({
          input: transaction.value ? transaction.value : ZERO,
          decimals: DECIMALS,
          digits: DIGITS,
          showLastNonZeroDecimal: true,
          addCommas: false
        }),
    tokenId: tokenFound ? tokenId : egldLabel,
    gasLimit: String(transaction.gasLimit.valueOf() || gasLimit),
    gasPrice: formatAmount({
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
