import { TOKEN_GAS_LIMIT } from 'constants/index';
import { TransactionTypeEnum } from 'types/enums';
import { calculateGasLimit } from './calculateGasLimit';
import { calculateNftGasLimit } from './calculateNftGasLimit';

export interface GetGasLimitType {
  txType: TransactionTypeEnum;
  data?: string;
}
export function getGasLimit({ txType, data = '' }: GetGasLimitType) {
  switch (txType) {
    case TransactionTypeEnum.ESDT:
      return TOKEN_GAS_LIMIT;
    case TransactionTypeEnum.EGLD:
      return calculateGasLimit({
        data: data.trim()
      });
    default:
      return calculateNftGasLimit();
  }
}
