import React from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate/index';

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
  <div className={styles.fee}>
    <span className={styles.text}>{label}</span>

    <Denominate
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
