import { denomination as defaultDenomination } from '@elrondnetwork/dapp-core/constants/index';

export const maxDecimals = (amount: string, customDenomination?: number) => {
  const denomination =
    customDenomination == null ? defaultDenomination : customDenomination;
  if (
    amount != null &&
    amount.toString().indexOf('.') >= 0 &&
    (amount as any)
      .toString()
      .split('.')
      .pop().length > denomination
  ) {
    return false;
  }
  return true;
};

export default maxDecimals;
