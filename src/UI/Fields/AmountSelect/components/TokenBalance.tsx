import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import React from 'react';

export interface TokenBalancePropsType extends WithClassnameType {
  label?: string;
  value?: string;
  'data-value'?: string; // used for testing
}

export const TokenBalance = ({
  label,
  value,
  className,
  'data-testid': dataTestId,
  'data-value': dataValue
}: TokenBalancePropsType) => {
  return (
    <div data-testid={dataTestId} data-value={dataValue} className={className}>
      <span className='mex-text-secondary mr-2'>{label}</span>
      {value}
    </div>
  );
};
