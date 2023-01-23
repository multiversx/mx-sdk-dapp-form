import React, { useRef, useState } from 'react';
import { faAngleDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import useCollapse from 'react-collapsed';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { GasLimit } from '../GasLimit/GasLimit';
import { GasPrice } from '../GasPrice';
import { FeeInFiat } from './FeeInFiat';

import styles from './styles.module.scss';

export const FeeAccordion = ({ className }: WithClassnameType) => {
  const { gasInfo, tokensInfo } = useSendFormContext();
  const { feeLimit, gasCostLoading, gasPriceError, gasLimitError } = gasInfo;
  const { egldPriceInUsd, egldLabel } = tokensInfo;

  const accordion = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(Boolean(gasPriceError || gasLimitError));
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: active
  });

  const toggleAccordion = () => {
    setActive((active) => !active);
  };

  return (
    <div className={classNames(styles.fee, className)}>
      <span
        className={styles.trigger}
        {...getToggleProps({ onClick: toggleAccordion })}
      >
        <span>
          <span className={styles.label}>Fee:</span>

          <span className={styles.limit} data-testid='feeLimit'>
            <FormatAmount
              value={feeLimit}
              showLastNonZeroDecimal={true}
              egldLabel={egldLabel}
            />
          </span>

          {gasCostLoading && (
            <FontAwesomeIcon
              icon={faSpinner}
              className='fa-spin fast-spin'
              data-testid='gasCostLoadingSpinner'
            />
          )}
        </span>

        <FeeInFiat egldPriceInUsd={egldPriceInUsd} feeLimit={feeLimit} />

        <FontAwesomeIcon
          icon={faAngleDown}
          className={classNames(styles.arrow, { [styles.active]: active })}
        />
      </span>

      <div
        ref={accordion}
        className={styles.expandable}
        {...getCollapseProps()}
      >
        <div className={styles.content}>
          <GasPrice />
          <GasLimit />
        </div>
      </div>
    </div>
  );
};
