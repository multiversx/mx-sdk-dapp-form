import { TransactionTypeEnum } from 'types/enums';

export const getIsNftTransaction = (txType: TransactionTypeEnum) => {
  const isNftTransaction = ![
    TransactionTypeEnum.EGLD,
    TransactionTypeEnum.ESDT
  ].includes(txType);
  return isNftTransaction;
};
