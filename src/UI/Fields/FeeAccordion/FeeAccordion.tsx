import React, { useRef, useState } from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI';
import {
  faAngleDown,
  faAngleRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { GasLimit } from '../GasLimit';
import { GasPrice } from '../GasPrice';
import { FeeInFiat } from './FeeInFiat';

import styles from './styles.module.scss';

export const FeeAccordion = () => {
  const accordion = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const { gasInfo, tokensInfo } = useSendFormContext();
  const { feeLimit, gasCostLoading } = gasInfo;
  const { egldPriceInUsd, egldLabel } = tokensInfo;

  const toggleAccordion = () => setActive((active) => !active);
  const dynamicAccordionHeight =
    active && accordion ? accordion?.current?.scrollHeight : 0;

  return (
    <div className={styles.accordion}>
      <span className={styles.trigger} onClick={toggleAccordion}>
        <span>
          <FontAwesomeIcon
            icon={active ? faAngleDown : faAngleRight}
            className={styles.icon}
          />{' '}
          <label className={styles.label}>Fee</label>
          <span className={styles.limit} data-testid='feeLimit'>
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
        className={styles.expandable}
        style={{
          height: dynamicAccordionHeight
        }}
      >
        <div className={styles.content}>
          <GasPrice />
          <GasLimit />
        </div>
      </div>
    </div>
  );
};
