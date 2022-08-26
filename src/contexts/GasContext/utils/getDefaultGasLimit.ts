import { GAS_LIMIT } from '@elrondnetwork/dapp-core/constants/index';
import { TOKEN_GAS_LIMIT } from 'constants/index';
import { calculateNftGasLimit } from 'operations';

export function getDefaultGasLimit({
  isNftTransaction,
  isEsdtTransaction,
  data
}: {
  isNftTransaction: boolean;
  isEsdtTransaction: boolean;
  data?: string;
}): string {
  if (isNftTransaction) {
    return calculateNftGasLimit(data);
  }
  if (isEsdtTransaction) {
    return TOKEN_GAS_LIMIT;
  }
  return String(GAS_LIMIT);
}

export default getDefaultGasLimit;
