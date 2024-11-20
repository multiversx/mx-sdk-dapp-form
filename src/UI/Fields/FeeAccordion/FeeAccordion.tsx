import React, { useState } from 'react';
import { faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import useCollapse from 'react-collapsed';

import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { GasLimit } from '../GasLimit/GasLimit';
import { GasPrice } from '../GasPrice';
import { FeeInFiat } from './FeeInFiat';

import styles from './styles.module.scss';

export const FeeAccordion = ({ className }: WithClassnameType) => {
  const { gasInfo, tokensInfo } = useSendFormContext();
  const { feeLimit, gasCostLoading, gasPriceError, gasLimitError } = gasInfo;
  const { egldPriceInUsd, egldLabel } = tokensInfo;

  const [active, setActive] = useState(Boolean(gasPriceError || gasLimitError));
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: active
  });

  const toggleAccordion = () => {
    setActive((active) => !active);
  };

  return (
    <div className={classNames(styles.fee, className)}>
      <label className={globals.label}>Fee</label>
      <div
        className={styles.trigger}
        {...getToggleProps({ onClick: toggleAccordion })}
      >
        <span
          className={styles.limit}
          data-testid={FormDataTestIdsEnum.feeLimit}
        >
          <FormatAmount
            value={feeLimit}
            showLastNonZeroDecimal
            egldLabel={egldLabel}
          />
        </span>

        {gasCostLoading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className='fa-spin fast-spin'
            data-testid={FormDataTestIdsEnum.gasCostLoadingSpinner}
          />
        )}

        <FeeInFiat egldPriceInUsd={egldPriceInUsd} feeLimit={feeLimit} />

        <FontAwesomeIcon
          icon={faChevronRight}
          className={classNames(styles.arrow, { [styles.active]: active })}
        />
      </div>

      <div className={styles.expandable} {...getCollapseProps()}>
        <div className={styles.content}>
          <GasPrice egldLabel={egldLabel} />
          <GasLimit />
        </div>
      </div>
    </div>
  );
};
