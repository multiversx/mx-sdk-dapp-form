import React from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';

import { ZERO } from 'constants/index';
import { calculateFeeInFiat } from 'operations';
import styles from './styles.module.scss';

export const Fee = ({
  egldPriceInUsd,
  label = 'Fee',
  feeLimit,
  egldLabel
}: {
  label?: string;
  egldPriceInUsd: number;
  feeLimit: string;
  egldLabel: string;
}) => (
  <div className={styles.confirmFee}>
    <span className={styles.confirmFeeText}>{label}</span>

    <Denominate
      egldLabel={egldLabel}
      value={feeLimit}
      showLastNonZeroDecimal
      data-testid='confirmFee'
    />

    {feeLimit !== ZERO && (
      <small className={styles.confirmFeeText}>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </small>
    )}
  </div>
);
