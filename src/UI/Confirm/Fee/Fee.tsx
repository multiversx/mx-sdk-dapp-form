import React from 'react';
import { FormatAmount } from '@elrondnetwork/dapp-core/UI/FormatAmount/FormatAmount';

import { ZERO } from 'constants/index';
import { calculateFeeInFiat } from 'operations';
import styles from './styles.module.scss';

export interface FeePropsType {
  label?: string;
  egldPriceInUsd: number;
  feeLimit: string;
  egldLabel: string;
}

export const Fee = ({
  egldPriceInUsd,
  label = 'Fee',
  feeLimit,
  egldLabel
}: FeePropsType) => (
  <div className={styles.fee}>
    <span className={styles.text}>{label}</span>

    <FormatAmount
      egldLabel={egldLabel}
      value={feeLimit}
      showLastNonZeroDecimal
      data-testid='confirmFee'
    />

    {feeLimit !== ZERO && (
      <small className={styles.text}>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </small>
    )}
  </div>
);
