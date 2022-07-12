import React from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';
import { calculateFeeInFiat } from 'operations';
import styles from './styles.module.scss';

const Fee = ({
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

    {feeLimit !== '0' && (
      <small className={styles.text}>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </small>
    )}
  </div>
);

export default Fee;
