import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { isNftOrMultiEsdtTx } from 'validation';
import { SignTxType } from './validateTransaction';

export function getTxWithReceiver({
  address,
  tx
}: {
  address: string;
  tx: SignTxType;
}) {
  const receiver =
    isNftOrMultiEsdtTx(tx.data) && !addressIsValid(String(tx.receiver))
      ? address
      : String(tx.receiver);
  const transactionWithRealReceiver = { ...tx, receiver };
  return transactionWithRealReceiver;
}

export default getTxWithReceiver;
