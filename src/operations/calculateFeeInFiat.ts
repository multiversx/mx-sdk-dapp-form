import * as constants from '@elrondnetwork/dapp-core/constants';
import { denominate } from '@elrondnetwork/dapp-core/utils';
import { usdValue } from 'utilities';

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
