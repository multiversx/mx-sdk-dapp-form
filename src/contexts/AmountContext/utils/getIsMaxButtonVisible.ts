import { ZERO } from 'constants/index';
import { ExtendedValuesType, PartialNftType, TransactionTypeEnum } from 'types';
import { showMax } from 'utilities';

interface GetIsMaxButtonVisiblePropsType {
  nft?: PartialNftType;
  amount: string;
  readonly?: ExtendedValuesType['readonly'];
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
  txType: TransactionTypeEnum;
}

export function getIsMaxButtonVisible({
  nft,
  amount,
  readonly,
  maxAmountAvailable,
  maxAmountMinusDust,
  txType
}: GetIsMaxButtonVisiblePropsType) {
  switch (txType) {
    case TransactionTypeEnum.EGLD:
      return showMax({
        amount,
        entireBalanceMinusDust: maxAmountMinusDust,
        readonly,
        available: maxAmountAvailable
      });
    case TransactionTypeEnum.ESDT:
      const differentFromMaxBalance = amount !== maxAmountAvailable;
      return (
        differentFromMaxBalance && !readonly && maxAmountAvailable !== ZERO
      );
    default:
      const isNftAmountDifferentFromBalance =
        nft != null && amount !== nft?.balance;
      return isNftAmountDifferentFromBalance && !readonly;
  }
}
