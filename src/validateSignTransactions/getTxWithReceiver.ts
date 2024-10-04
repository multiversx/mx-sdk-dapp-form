import { IPlainTransactionObject } from '@multiversx/sdk-core/out';

import { addressIsValid } from 'helpers';
import { isNftOrMultiEsdtTx } from 'validation';

export function getTxWithReceiver({
  address,
  tx
}: {
  address: string;
  tx: IPlainTransactionObject;
}) {
  const receiver =
    isNftOrMultiEsdtTx(String(tx.data)) && !addressIsValid(String(tx.receiver))
      ? address
      : String(tx.receiver);

  return { ...tx, receiver };
}

export default getTxWithReceiver;
