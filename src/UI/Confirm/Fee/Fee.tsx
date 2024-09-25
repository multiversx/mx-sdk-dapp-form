import React from 'react';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';

import { FormDataTestIdsEnum, ZERO } from 'constants/index';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { calculateFeeInFiat } from 'operations';
import { TransactionTypeEnum } from 'types';
import { TokenAvatar } from '../TokenAvatar';

export interface FeePropsType {
  label?: string;
  egldPriceInUsd: number;
  feeLimit: string;
  egldLabel: string;
}

export const FeeComponent = ({
  egldPriceInUsd,
  label = 'Fee',
  feeLimit,
  egldLabel,
  globalStyles,
  styles
}: FeePropsType & WithStylesImportType) => (
  <div className={styles?.fee}>
    <span className={globalStyles?.label}>{label}</span>

    <div className={styles?.token}>
      <TokenAvatar type={TransactionTypeEnum.EGLD} />

      <div className={styles?.value}>
        <FormatAmount
          egldLabel={egldLabel}
          value={feeLimit}
          showLastNonZeroDecimal
          data-testid={FormDataTestIdsEnum.confirmFee}
        />
      </div>
    </div>

    {feeLimit !== ZERO && (
      <span className={styles?.price}>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </span>
    )}
  </div>
);

export const Fee = withStyles(FeeComponent, {
  ssrStyles: () => import('UI/Confirm/Fee/styles.scss'),
  clientStyles: () => require('UI/Confirm/Fee/styles.scss').default
});
