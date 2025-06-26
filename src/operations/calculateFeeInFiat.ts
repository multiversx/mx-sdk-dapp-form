import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { getUsdValue } from '@multiversx/sdk-dapp/out/utils/operations/getUsdValue';

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

  const feeInFiat = `≈ ${getUsdValue({
    amount,
    usd: egldPriceInUsd,
    decimals: DIGITS
  })}`;

  return feeInFiat;
}

export default calculateFeeInFiat;
