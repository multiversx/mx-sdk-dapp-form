import React from 'react';
import { calculateFeeInFiat } from 'operations';

import styles from './styles.module.scss';
import { ZERO } from 'constants/index';

interface FeeInFiatType {
  feeLimit: string;
  egldPriceInUsd: number;
}

const FeeInFiat = ({ feeLimit, egldPriceInUsd }: FeeInFiatType) =>
  feeLimit !== ZERO ? (
    <small className={styles.fiat}>
      {calculateFeeInFiat({
        feeLimit,
        egldPriceInUsd
      })}
    </small>
  ) : null;

export { FeeInFiat };
