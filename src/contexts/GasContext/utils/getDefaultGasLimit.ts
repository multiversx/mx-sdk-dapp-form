import * as constants from '@elrondnetwork/dapp-core/constants';
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
  return constants.gasLimit;
}

export default getDefaultGasLimit;
