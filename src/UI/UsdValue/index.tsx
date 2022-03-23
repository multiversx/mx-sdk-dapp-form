import React from 'react';
import { usdValue } from 'helpers';

export function UsdValue(props: {
  amount: string;
  egldPriceInUsd: number;
  'data-testid'?: string;
}) {
  const { amount, egldPriceInUsd, ...dataTestId } = props;
  const value = `≈ $${usdValue({ amount, egldPriceInUsd })}`;
  return (
    <small className='form-text text-secondary mt-0' {...dataTestId}>
      {`${amount}` === '0' ? '= $0' : value}
    </small>
  );
}

export default UsdValue;
