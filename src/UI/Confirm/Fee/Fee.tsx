import React from 'react';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';

import globals from 'assets/sass/globals.module.scss';
import { TestIdsEnum, ZERO } from 'constants/index';
import { calculateFeeInFiat } from 'operations';

import { TransactionTypeEnum } from 'types';
import { TokenAvatar } from '../TokenAvatar';

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

    <div className={styles.token}>
      <TokenAvatar type={TransactionTypeEnum.EGLD} />

      <div className={styles.value}>
        <FormatAmount
          egldLabel={egldLabel}
          value={feeLimit}
          showLastNonZeroDecimal
          data-testid={TestIdsEnum.confirmFee}
        />
      </div>
    </div>

    {feeLimit !== ZERO && (
      <span className={styles.price}>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </span>
    )}
  </div>
);
