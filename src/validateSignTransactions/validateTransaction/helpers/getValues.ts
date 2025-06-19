import { DIGITS, DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants';
import { GAS_PRICE } from '@multiversx/sdk-dapp/out/constants';
import { isTokenTransfer } from '@multiversx/sdk-dapp/out/providers/strategies/helpers/signTransactions/helpers/isTokenTransfer';
import { MultiSignTransactionType } from '@multiversx/sdk-dapp/out/types/transactions.types';

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
  const { receiver, receiverUsername, senderUsername } = transaction;
  const isTokenTransaction = Boolean(
    tokenId && isTokenTransfer({ tokenId, egldLabel })
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
    receiverUsername,
    senderUsername,
    data: String(transaction.data),
    nonce: transaction.nonce.valueOf().toString()
  };

  return values;
}
