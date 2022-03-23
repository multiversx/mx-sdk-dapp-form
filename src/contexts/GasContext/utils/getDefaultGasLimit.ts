import { gasLimit as configGasLimit, tokenGasLimit } from 'config';
import { calculateNftGasLimit } from '../../../logic/operations';

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
  return configGasLimit;
}

export default getDefaultGasLimit;
