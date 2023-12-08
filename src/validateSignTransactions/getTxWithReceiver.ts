import { RawTransactionType } from '@multiversx/sdk-dapp/types/transactions.types';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { isNftOrMultiEsdtTx } from 'validation';

export function getTxWithReceiver({
  address,
  tx
}: {
  address: string;
  tx: RawTransactionType;
}) {
  const receiver =
    isNftOrMultiEsdtTx(String(tx.data)) && !addressIsValid(String(tx.receiver))
      ? address
      : String(tx.receiver);

  return { ...tx, receiver };
}

export default getTxWithReceiver;
