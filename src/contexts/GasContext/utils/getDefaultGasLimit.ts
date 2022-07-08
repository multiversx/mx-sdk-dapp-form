import { gasLimit } from '@elrondnetwork/dapp-core/constants/index';
import { tokenGasLimit } from 'constants/index';
import { calculateNftGasLimit } from 'operations';

export function getDefaultGasLimit({
  isNftTransaction,
  isEsdtTransaction,
  data
}: {
  isNftTransaction: boolean;
  isEsdtTransaction: boolean;
  data?: string;
}) {
  if (isNftTransaction) {
    return calculateNftGasLimit(data);
  }
  if (isEsdtTransaction) {
    return tokenGasLimit;
  }
  return gasLimit;
}

export default getDefaultGasLimit;
