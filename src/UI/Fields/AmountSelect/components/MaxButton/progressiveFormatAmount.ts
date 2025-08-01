import { DIGITS as configDigits } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount as dappCoreFormatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { stringIsInteger } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsInteger';

export const progressiveFormatAmount = ({
  amount = '0',
  decimals = 0,
  digits = configDigits,
  addCommas = false,
  showLastNonZeroDecimal = false
}: {
  amount?: string | null;
  decimals?: number;
  digits?: number;
  addCommas?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  if (amount == null || !stringIsInteger(amount)) {
    return '0';
  }

  const tryFormatAmount = (tryDigits: number) =>
    dappCoreFormatAmount({
      input: amount,
      digits: tryDigits,
      decimals,
      addCommas,
      showLastNonZeroDecimal
    });

  let formattedAmount = tryFormatAmount(digits);

  formattedAmount =
    parseFloat(formattedAmount) > 0
      ? formattedAmount
      : tryFormatAmount(configDigits);

  formattedAmount =
    parseFloat(formattedAmount) > 0
      ? formattedAmount
      : tryFormatAmount(configDigits + 2);

  formattedAmount =
    parseFloat(formattedAmount) > 0
      ? formattedAmount
      : tryFormatAmount(configDigits + 4);

  formattedAmount =
    parseFloat(formattedAmount) > 0
      ? formattedAmount
      : tryFormatAmount(configDigits + 6);

  formattedAmount =
    parseFloat(formattedAmount) > 0
      ? formattedAmount
      : tryFormatAmount(configDigits + 10);

  return parseFloat(formattedAmount) > 0
    ? formattedAmount
    : tryFormatAmount(configDigits + 14);
};
