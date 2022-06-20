import React from 'react';
import { DappUI } from '@elrondnetwork/dapp-core';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import InfoDust from 'UI/InfoDust';
import SharedAmount from './SharedAmount';

export const EgldAmount = () => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { egldLabel, egldPriceInUsd } = tokensInfo;
  const { isMaxClicked, isInvalid, maxAmountAvailable, maxAmountMinusDust } =
    amountInfo;

  function AvailableAmountElement() {
    if (!isInvalid && amountInfo.amount) {
      return (
        <div className='d-flex align-items-center'>
          <DappUI.UsdValue amount={amountInfo.amount} usd={egldPriceInUsd} />
          {amountInfo.amount === maxAmountMinusDust && isMaxClicked && (
            <InfoDust egldLabel={egldLabel} />
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

  return <SharedAmount AvailableAmountElement={AvailableAmountElement} />;
};

export default EgldAmount;
