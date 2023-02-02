import React from 'react';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import classNames from 'classnames';

import { ZERO } from 'constants/index';
import { calculateFeeInFiat } from 'operations';

import globals from 'assets/sass/globals.module.scss';
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
    <span className={globals.label}>{label}</span>

    <div className={classNames(globals.value, styles.value)}>
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
  </div>
);
