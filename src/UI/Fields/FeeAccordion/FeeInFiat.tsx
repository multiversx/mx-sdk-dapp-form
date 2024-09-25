import React from 'react';

import { FormDataTestIdsEnum, ZERO } from 'constants/index';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { calculateFeeInFiat } from 'operations';

interface FeeInFiatType {
  feeLimit: string;
  egldPriceInUsd: number;
}

export const FeeInFiatComponent = ({
  feeLimit,
  egldPriceInUsd,
  styles
}: FeeInFiatType & WithStylesImportType) => {
  if (feeLimit === ZERO) {
    return null;
  }

  return (
    <span className={styles?.fiat} data-testid={FormDataTestIdsEnum.feeInFiat}>
      (
      {calculateFeeInFiat({
        feeLimit,
        egldPriceInUsd
      })}
      )
    </span>
  );
};

export const FeeInFiat = withStyles(FeeInFiatComponent, {
  ssrStyles: () => import('UI/Fields/FeeAccordion/styles.scss'),
  clientStyles: () => require('UI/Fields/FeeAccordion/styles.scss').default
});
