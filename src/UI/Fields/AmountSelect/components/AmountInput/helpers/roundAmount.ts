import { DIGITS } from '@multiversx/sdk-dapp-utils/out';
import { stringIsFloat } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsFloat';
import BigNumber from 'bignumber.js';

export const roundAmount = (amount: string, digits?: number) => {
  const digitsToUse = digits ?? DIGITS;

  if (stringIsFloat(amount)) {
    const bNamount = new BigNumber(amount);

    if (bNamount.isZero()) {
      return '0';
    }

    let formattedAmount = new BigNumber(amount).toFormat(digitsToUse);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(DIGITS);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(DIGITS + 2);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(DIGITS + 4);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(DIGITS + 6);

    formattedAmount =
      parseFloat(formattedAmount) > 0
        ? formattedAmount
        : new BigNumber(amount).toFormat(DIGITS + 10);

    return parseFloat(formattedAmount) > 0
      ? formattedAmount
      : new BigNumber(amount).toFormat(DIGITS + 14);
  }

  return '0';
};
