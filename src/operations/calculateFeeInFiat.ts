import {
  denomination,
  decimals
} from '@elrondnetwork/dapp-core/constants/index';
import { denominate } from '@elrondnetwork/dapp-core/utils/operations/denominate';
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
    denomination: denomination,
    decimals: decimals,
    showLastNonZeroDecimal: true
  });

  return `≈ $${usdValue({
    amount,
    egldPriceInUsd,
    decimals: decimals
  })}`;
}

export default calculateFeeInFiat;
