import React from 'react';
import { calculateFeeInFiat } from 'operations';

import styles from './styles.module.scss';

interface FeeInFiatType {
  feeLimit: string;
  egldPriceInUsd: number;
}

const FeeInFiat = ({ feeLimit, egldPriceInUsd }: FeeInFiatType) =>
  feeLimit !== '0' ? (
    <small className={styles.fiat}>
      {calculateFeeInFiat({
        feeLimit,
        egldPriceInUsd
      })}
    </small>
  ) : null;

export default FeeInFiat;
