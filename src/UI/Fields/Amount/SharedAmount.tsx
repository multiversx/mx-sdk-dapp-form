import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import styles from './styles.module.scss';

interface SharedAmountType {
  AvailableAmountElement: () => JSX.Element | null;
}

export const SharedAmount = ({ AvailableAmountElement }: SharedAmountType) => {
  const {
    formInfo: { checkInvalid, readonly },
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

  const isInvalid = checkInvalid(ValuesEnum.amount);

  const {
    amount,
    error,
    isMaxButtonVisible,
    onMaxClicked,
    onFocus,
    onBlur,
    onChange
  } = amountInfo;

  return (
    <div className={styles.sharedAmount}>
      {label && (
        <label htmlFor={ValuesEnum.amount} className={styles.sharedAmountLabel}>
          {label}
        </label>
      )}

      <div className={styles.sharedAmountWrapper}>
        <input
          type='text'
          id={ValuesEnum.amount}
          name={ValuesEnum.amount}
          data-testid={ValuesEnum.amount}
          required
          value={amount}
          disabled={getIsDisabled(ValuesEnum.amount, readonly)}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          autoComplete='off'
          className={classNames(globals.input, {
            [globals.invalid]: isInvalid,
            [styles.sharedAmountInvalid]: isInvalid
          })}
        />

        {isInvalid && (
          <span className={globals.errorExclamation}>
            <FontAwesomeIcon icon={faExclamation} size='xs' />
          </span>
        )}

        {isMaxButtonVisible && (
          <div
            className={classNames(styles.max, {
              [styles.maxOffset]: isInvalid
            })}
          >
            <button
              data-testid='maxBtn'
              className={styles.button}
              onClick={onMaxClicked}
            >
              Max
            </button>
          </div>
        )}
      </div>

      {isInvalid && <div className={globals.error}>{error}</div>}

      {TokenSelector && <TokenSelector />}

      {!isInvalid && <AvailableAmountElement />}
    </div>
  );
};
