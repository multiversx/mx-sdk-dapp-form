import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ValuesEnum } from 'types';

import styles from './amountSelect.module.scss';
import './formComponents.scss';
import { AmountInput, MaxButton } from './components';

export interface AmountSelectPropsType extends WithClassnameType {
  label?: string;
}

const generatedClasses = {
  group: 'form-group text-left mb-0',
  label: 'mb-2 line-height-1 text-secondary',
  small: 'd-flex flex-column flex-sm-row my-2',
  error: 'invalid-feedback d-flex mt-0 mb-2 mb-sm-0',
  balance: 'd-flex ml-0 ml-sm-auto line-height-1 balance',
  maxBtn: 'badge-holder d-flex align-content-center justify-content-end',
  wrapper: classNames('token-amount-input-select-max', {
    'is-invalid': false
  })
};

export const AmountSelect = ({ className, label }: AmountSelectPropsType) => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { tokenDetails, tokenIdError, isTokenIdInvalid } = tokensInfo;

  const { isInvalid, amount, onBlur, onChange, onMaxClicked } = amountInfo;

  return (
    <div className={generatedClasses.group}>
      <label
        // htmlFor={name}
        className={`${generatedClasses.label} text-secondary`}
      >
        Amount Select 1
      </label>

      <div className={generatedClasses.wrapper}>
        <div className='amount-holder w-100'>
          <div className={classNames(styles.selectTokenContainer, className)}>
            {label && (
              <label
                htmlFor={ValuesEnum.tokenId}
                data-testid='tokenIdLabel'
                className={styles.selectTokenLabel}
              >
                {label}
              </label>
            )}

            <div
              className={`token-amount-input-select-max ${
                isInvalid ? 'is-invalid' : ''
              }`}
            >
              <AmountInput
                name='amount'
                required={true}
                value={amount}
                placeholder='Amount'
                handleBlur={onBlur}
                data-testid='amountInput'
                handleChange={onChange}
              />

              <div className='badge-holder d-flex align-content-center justify-content-end'>
                <MaxButton
                  token={tokenDetails}
                  inputAmount={amount}
                  onMaxClick={onMaxClicked}
                />
              </div>
            </div>

            {isTokenIdInvalid && (
              <div className={globals.error} data-testid='tokenIdError'>
                <small>{tokenIdError}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
