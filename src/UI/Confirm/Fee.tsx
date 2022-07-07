import React from 'react';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';
import { calculateFeeInFiat } from 'operations';

const Fee = ({
  egldPriceInUsd,
  label = 'Fee',
  feeLimit,
  egldLabel
}: {
  label?: string;
  egldPriceInUsd: number;
  feeLimit: string;
  egldLabel: string;
}) => (
  <div className='form-group'>
    <span className='form-label text-secondary d-block'>{label}</span>
    <Denominate
      egldLabel={egldLabel}
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
