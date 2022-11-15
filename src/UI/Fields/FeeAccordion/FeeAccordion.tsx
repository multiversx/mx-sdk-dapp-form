import React, { useRef, useState } from 'react';
import { FormatAmount } from '@elrondnetwork/dapp-core/UI/FormatAmount/FormatAmount';
import {
  faAngleDown,
  faAngleRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { GasLimit } from '../GasLimit/GasLimit';
import { GasPrice } from '../GasPrice';
import { FeeInFiat } from './FeeInFiat';

import styles from './styles.module.scss';

export const FeeAccordion = () => {
  const { gasInfo, tokensInfo, formInfo } = useSendFormContext();
  const { feeLimit, gasCostLoading, gasPriceError, gasLimitError } = gasInfo;
  const { egldPriceInUsd, egldLabel } = tokensInfo;

  const accordion = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(Boolean(gasPriceError || gasLimitError));

  const toggleAccordion = () => {
    setActive((active) => !active);
  };

  const dynamicAccordionHeight =
    active && accordion ? accordion?.current?.scrollHeight : 0;

  return (
    <div
      className={classNames(styles.feeAccordion, {
        [styles.feeAccordionSpaced]: formInfo.uiOptions?.showAmountSlider
      })}
    >
      <span className={styles.feeAccordionTrigger} onClick={toggleAccordion}>
        <span>
          <FontAwesomeIcon
            icon={active ? faAngleDown : faAngleRight}
            className={styles.feeAccordionIcon}
          />{' '}
          <label className={styles.feeAccordionLabel}>Fee</label>
          <span className={styles.feeAccordionLimit} data-testid='feeLimit'>
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
              data-testid='gasCostLoadingSpinner'
            />
          )}
        </span>

        <FeeInFiat egldPriceInUsd={egldPriceInUsd} feeLimit={feeLimit} />
      </span>

      <div
        ref={accordion}
        className={styles.feeAccordionExpandable}
        style={{
          height: dynamicAccordionHeight
        }}
      >
        <div className={styles.feeAccordionContent}>
          <GasPrice />
          <GasLimit />
        </div>
      </div>
    </div>
  );
};
