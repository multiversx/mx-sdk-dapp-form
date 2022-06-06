import { NftType, TxTypeEnum } from 'types';
import { showMax } from 'utilities';

interface GetIsMaxButtonVisiblePropsType {
  nft?: NftType;
  amount: string;
  readonly?: boolean;
  maxAmountAvailable: string;
  maxAmountMinusDust: string;
  txType: TxTypeEnum;
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
    case TxTypeEnum.EGLD:
      return showMax({
        amount,
        entireBalanceMinusDust: maxAmountMinusDust,
        readonly,
        available: maxAmountAvailable
      });
    case TxTypeEnum.ESDT:
      const differentFromMaxBalance = amount !== maxAmountAvailable;
      return differentFromMaxBalance && !readonly && maxAmountAvailable !== '0';
    default:
      const isNftAmountDifferentFromBalance =
        nft != null && amount !== nft?.balance;
      return isNftAmountDifferentFromBalance && !readonly;
  }
}
