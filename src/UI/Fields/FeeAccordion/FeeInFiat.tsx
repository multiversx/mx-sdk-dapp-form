import React from 'react';

import { ZERO } from 'constants/index';
import { calculateFeeInFiat } from 'operations';

import styles from './styles.module.scss';

interface FeeInFiatType {
  feeLimit: string;
  egldPriceInUsd: number;
}

export const FeeInFiat = ({ feeLimit, egldPriceInUsd }: FeeInFiatType) =>
  feeLimit !== ZERO ? (
    <span className={styles.fiat} data-testid='feeInFiat'>
      (
      {calculateFeeInFiat({
        feeLimit,
        egldPriceInUsd
      })}
      )
    </span>
  ) : null;
