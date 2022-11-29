import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import styles from './../styles.module.scss';
import { MaxButton } from './MaxButton';

export interface SharedAmountPropsType {
  AvailableAmountElement: () => JSX.Element | null;
}

export const SharedAmount = ({
  AvailableAmountElement
}: SharedAmountPropsType) => {
  const {
    formInfo: { readonly },
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

  const { amount, error, onFocus, onBlur, onChange, isInvalid } = amountInfo;

  return (
    <div className={styles.sharedAmount}>
      {label != null && (
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

        <MaxButton />
      </div>

      {isInvalid && (
        <div className={globals.error} data-testid='amountError'>
          {error}
        </div>
      )}

      {TokenSelector && <TokenSelector />}

      {!isInvalid && <AvailableAmountElement />}
    </div>
  );
};
