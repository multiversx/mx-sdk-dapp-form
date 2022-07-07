import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';

interface SharedAmountType {
  AvailableAmountElement: () => JSX.Element | null;
}

export const SharedAmount = ({ AvailableAmountElement }: SharedAmountType) => {
  const {
    formInfo: { checkInvalid },
    amountInfo
  } = useSendFormContext();

  const {
    fields: {
      amount: {
        label,
        components: { tokenSelector: TokenSelector }
      }
    }
  } = useUICustomizationContext();

  const isInvalid = checkInvalid('amount');
  const {
    amount,
    isMaxButtonVisible,
    onMaxClicked,
    onFocus,
    onBlur,
    onChange
  } = amountInfo;

  return (
    <div className={styles.amount}>
      {label && (
        <label htmlFor='amount' className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <input
          type='text'
          id='amount'
          name='amount'
          data-testid='amount'
          required={true}
          value={amount}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          autoComplete='off'
          className={classNames(styles.input, {
            [styles.invalid]: isInvalid
          })}
        />

        {isInvalid && (
          <span className={styles.exclamation}>
            <FontAwesomeIcon
              icon={faExclamation}
              size='xs'
              className={styles.svg}
            />
          </span>
        )}
      </div>

      {isMaxButtonVisible && (
        <div className={styles.max}>
          <button
            data-testid='maxBtn'
            className={styles.button}
            onClick={onMaxClicked}
          >
            Max
          </button>
        </div>
      )}

      {TokenSelector ? <TokenSelector /> : null}

      {!isInvalid && <AvailableAmountElement />}
    </div>
  );
};

export default SharedAmount;
