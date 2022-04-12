import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import InfoDust from 'UI/InfoDust';
import UsdValue from 'UI/UsdValue';
import { DefaultFormAmountClassesType } from '../Amount';
import SharedAmount from './SharedAmount';

export const EgldAmount = ({
  customClasses,
  label,
  TokenSelector
}: {
  customClasses: DefaultFormAmountClassesType;
  label: string;
  TokenSelector?: React.ReactNode;
}) => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { egldLabel, egldPriceInUsd } = tokensInfo;
  const { isMaxClicked, isInvalid, maxAmountAvailable, maxAmountMinusDust } =
    amountInfo;

  function AvailableAmountElement() {
    if (!isInvalid && amountInfo.amount) {
      return (
        <div className='d-flex align-items-center'>
          <UsdValue
            amount={amountInfo.amount}
            egldPriceInUsd={egldPriceInUsd}
          />
          {amountInfo.amount === maxAmountMinusDust && isMaxClicked && (
            <InfoDust />
          )}
        </div>
      );
    }

    if (maxAmountAvailable !== '0') {
      return (
        <small
          className='form-text text-secondary mt-1'
          data-testid={`available${egldLabel}`}
          data-value={`${maxAmountAvailable} ${egldLabel}`}
        >
          Available {maxAmountAvailable}
        </small>
      );
    }

    return null;
  }

  return (
    <SharedAmount
      customClasses={customClasses}
      label={label}
      TokenSelector={TokenSelector}
      AvailableAmountElement={AvailableAmountElement}
    />
  );
};

export default EgldAmount;
