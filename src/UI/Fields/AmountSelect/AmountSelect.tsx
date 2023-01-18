import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import globals from 'assets/sass/globals.module.scss';
import styles from './amountSelect.styles.scss';
import {
  AmountInput,
  AmountInputPropsType,
  MaxButton,
  MaxButtonPropsType,
  TokenSelect,
  TokenSelectType
} from './components';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
  name: string;
  tokenSelectProps: TokenSelectType;
  amountInputProps: AmountInputPropsType;
  maxButtonProps: MaxButtonPropsType;
}

export const AmountSelect = ({
  className,
  label,
  name,
  tokenSelectProps,
  amountInputProps,
  maxButtonProps
}: AmountSelectPropsType) => {
  const isInvalid = amountInputProps.isInvalid || tokenSelectProps.isInvalid;
  const error = amountInputProps.error || tokenSelectProps.error;
  const errorDataTestId = amountInputProps.error
    ? `${amountInputProps.name}Error`
    : `${tokenSelectProps.name}Error`;

  // TODO: remove BS classes or pass from above?
  const generatedClasses = {
    group: 'form-group text-left mb-0',
    label: 'mb-2 line-height-1 text-secondary',
    small: 'd-flex flex-column flex-sm-row my-2',
    error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
    balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
    maxBtn: `${styles.badgeHolder} d-flex align-content-center justify-content-end`,
    wrapper: classNames(styles.tokenAmountInputSelectMax, {
      'is-invalid': isInvalid
    })
  };

  return (
    <div className={generatedClasses.group}>
      {label && (
        <label
          htmlFor={name}
          className={`${generatedClasses.label} text-secondary`}
        >
          {label}
        </label>
      )}

      <div className={generatedClasses.wrapper}>
        <div className={classNames(styles.selectTokenContainer, className)}>
          <div className={generatedClasses.wrapper}>
            <AmountInput {...amountInputProps} />

            <div className={generatedClasses.maxBtn}>
              <MaxButton {...maxButtonProps} />
            </div>

            <TokenSelect {...tokenSelectProps} />
          </div>

          {isInvalid && (
            <div className={globals.error} data-testid={errorDataTestId}>
              <small>{error}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
