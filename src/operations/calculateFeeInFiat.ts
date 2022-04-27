import { denominate, constants } from '@elrondnetwork/dapp-core';
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
    denomination: constants.denomination,
    decimals: constants.decimals,
    showLastNonZeroDecimal: true
  });

  return `≈ $${usdValue({
    amount,
    egldPriceInUsd,
    decimals: constants.decimals
  })}`;
}

export default calculateFeeInFiat;
