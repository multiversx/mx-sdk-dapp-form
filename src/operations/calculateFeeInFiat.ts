import { denominate } from '@elrondnetwork/dapp-core';
import { denomination, decimals } from 'constants/index';
import usdValue from 'helpers/misc/usdValue';

export function calculateFeeInFiat({
  feeLimit,
  egldPriceInUsd
}: {
  feeLimit: string;
  egldPriceInUsd: number;
}) {
  const amount = denominate({
    input: feeLimit,
    denomination,
    decimals,
    showLastNonZeroDecimal: true
  });

  return `≈ $${usdValue({ amount, egldPriceInUsd, decimals })}`;
}

export default calculateFeeInFiat;
