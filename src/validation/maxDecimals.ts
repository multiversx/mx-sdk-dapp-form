import { constants } from '@elrondnetwork/dapp-core';

export const maxDecimals = (amount: string, customDenomination?: number) => {
  const denomination =
    customDenomination === undefined
      ? constants.denomination
      : customDenomination;
  if (
    amount !== undefined &&
    amount.toString().indexOf('.') >= 0 &&
    (amount as any).toString().split('.').pop().length > denomination
  ) {
    return false;
  }
  return true;
};

export default maxDecimals;
