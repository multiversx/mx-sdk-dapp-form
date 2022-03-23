import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { calculateFeeInFiat } from 'operations';

const Fee = ({
  egldPriceInUsd,
  label = 'Fee',
  feeLimit
}: {
  label?: string;
  egldPriceInUsd: number;
  feeLimit: string;
}) => (
  <div className='form-group'>
    <span className='form-label text-secondary d-block'>{label}</span>
    <DappUI.Denominate
      value={feeLimit}
      showLastNonZeroDecimal
      data-testid='confirmFee'
    />
    {feeLimit !== '0' && (
      <small className='d-block text-secondary'>
        {calculateFeeInFiat({
          feeLimit,
          egldPriceInUsd
        })}
      </small>
    )}
  </div>
);

export default Fee;
