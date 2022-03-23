import React from 'react';
import { calculateFeeInFiat } from 'operations';

interface FeeInFiatType {
  feeLimit: string;
  egldPriceInUsd: number;
}

const FeeInFiat = ({ feeLimit, egldPriceInUsd }: FeeInFiatType) => {
  return feeLimit !== '0' ? (
    <small style={{ lineHeight: '1' }} className='text-secondary'>
      {calculateFeeInFiat({
        feeLimit,
        egldPriceInUsd
      })}
    </small>
  ) : null;
};
export default FeeInFiat;
