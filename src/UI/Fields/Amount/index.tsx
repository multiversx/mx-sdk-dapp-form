import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { EgldAmount } from './EgldAmount';
import { EsdtAmount } from './EsdtAmount';
import { NftAmount } from './NftAmount';

export type DefaultFormAmountClassesType = {
  container: string;
  invalidInput: string;
  inputContainer: string;
  input: string;
  maxBtnContainer: string;
  errorMsg: string;
};
export const defaultFormAmountClasses = {
  container: 'form-group amount',
  invalidInput: 'is-invalid',
  inputContainer: 'amount-holder',
  input: 'form-control amount-input',
  maxBtnContainer:
    'badge-holder d-flex align-content-center justify-content-end',
  errorMsg: 'invalid-feedback'
};

export function Amount({
  customClasses,
  label,
  TokenSelector
}: {
  customClasses?: DefaultFormAmountClassesType;
  label?: string;
  TokenSelector?: React.ReactNode;
}) {
  const { formInfo } = useSendFormContext();
  const { isNftTransaction, isEsdtTransaction } = formInfo;
  const classes = customClasses || defaultFormAmountClasses;

  if (isNftTransaction) {
    return (
      <NftAmount
        TokenSelector={TokenSelector}
        label={label || ''}
        customClasses={classes}
      />
    );
  }

  if (isEsdtTransaction) {
    return (
      <EsdtAmount
        TokenSelector={TokenSelector}
        label={label || ''}
        customClasses={classes}
      />
    );
  }

  return (
    <EgldAmount
      TokenSelector={TokenSelector}
      label={label || ''}
      customClasses={classes}
    />
  );
}
