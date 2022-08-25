import { DECIMALS, DIGITS } from '@elrondnetwork/dapp-core/constants/index';
import { denominate, usdValue } from 'helpers';

export function calculateFeeInFiat({
  feeLimit,
  egldPriceInUsd
}: {
  feeLimit: string;
  egldPriceInUsd: number;
}) {
  const amount = denominate({
    input: feeLimit,
    decimals: DECIMALS,
    digits: DIGITS,
    showLastNonZeroDecimal: true
  });

  return `≈ $${usdValue({
    amount,
    usd: egldPriceInUsd,
    decimals: DIGITS
  })}`;
}

export default calculateFeeInFiat;
