import React, { useRef, useState } from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';
import {
  faAngleDown,
  faAngleRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { GasLimit } from '../GasLimit';
import { GasPrice } from '../GasPrice';
import { FeeInFiat } from './FeeInFiat';

import styles from './styles.module.scss';

export const FeeAccordion = () => {
  const accordion = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const { gasInfo, tokensInfo, formInfo } = useSendFormContext();
  const { feeLimit, gasCostLoading } = gasInfo;
  const { egldPriceInUsd, egldLabel } = tokensInfo;

  const toggleAccordion = () => setActive((active) => !active);
  const dynamicAccordionHeight =
    active && accordion ? accordion?.current?.scrollHeight : 0;

  return (
    <div
      className={classNames(styles.feeAccordion, {
        [styles.feeAccordionSpaced]: !formInfo.uiOptions?.hideAmountSlider
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
            <Denominate
              value={feeLimit}
              showLastNonZeroDecimal
              egldLabel={egldLabel}
            />
          </span>
          {gasCostLoading && (
            <FontAwesomeIcon icon={faSpinner} className='fa-spin fast-spin' />
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
