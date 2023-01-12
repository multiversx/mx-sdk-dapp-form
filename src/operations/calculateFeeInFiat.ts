import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { formatAmount, usdValue } from 'helpers';

export function calculateFeeInFiat({
  feeLimit,
  egldPriceInUsd
}: {
  feeLimit: string;
  egldPriceInUsd: number;
}) {
  const amount = formatAmount({
    input: feeLimit,
    decimals: DECIMALS,
    digits: DIGITS,
    showLastNonZeroDecimal: true
  });

  return `≈ ${usdValue({
    amount,
    usd: egldPriceInUsd,
    decimals: DIGITS
  })}`;
}

export default calculateFeeInFiat;
