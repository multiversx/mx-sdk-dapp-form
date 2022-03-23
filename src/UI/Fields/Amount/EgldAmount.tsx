import React from 'react';
import { InfoDust, UsdValue } from 'components';
import { useSendFormContext } from 'contexts';
import SharedAmount from 'UI/Fields/Amount/SharedAmount';

export const EgldAmount = () => {
  const { tokensInfo, amount } = useSendFormContext();

  const { egldLabel, egldPriceInUsd } = tokensInfo;
  const { isMaxClicked, isInvalid, maxAmountAvailable, maxAmountMinusDust } =
    amount;

  function AvailableAmountElement() {
    if (!isInvalid && amount.value) {
      return (
        <div className='d-flex align-items-center'>
          <UsdValue amount={amount.value} egldPriceInUsd={egldPriceInUsd} />
          {amount.value === maxAmountMinusDust && isMaxClicked && <InfoDust />}
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
          {`Available ${maxAmountAvailable}}`}
        </small>
      );
    }

    return null;
  }

  return <SharedAmount AvailableAmountElement={AvailableAmountElement} />;
};

export default EgldAmount;
