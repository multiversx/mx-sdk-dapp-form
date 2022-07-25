import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { AMOUNT_FIELD } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';

interface SharedAmountType {
  AvailableAmountElement: () => JSX.Element | null;
}

const SharedAmount = ({ AvailableAmountElement }: SharedAmountType) => {
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

  const isInvalid = checkInvalid(AMOUNT_FIELD);

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
        <label htmlFor={AMOUNT_FIELD} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <input
          type='text'
          id={AMOUNT_FIELD}
          name={AMOUNT_FIELD}
          data-testid={AMOUNT_FIELD}
          required={true}
          value={amount}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          autoComplete='off'
          className={classNames(globals.input, {
            [globals.invalid]: isInvalid,
            [styles.invalid]: isInvalid
          })}
        />

        {isInvalid && (
          <span className={globals.errorExclamation}>
            <FontAwesomeIcon icon={faExclamation} size='xs' />
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

      {TokenSelector && <TokenSelector />}

      {!isInvalid && <AvailableAmountElement />}
    </div>
  );
};

export { SharedAmount };
