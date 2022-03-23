import React from 'react';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import SharedAmount from './SharedAmount';

export const EsdtAmount = () => {
  const { amountInfo, tokensInfo } = useSendFormContext();
  const { maxAmountAvailable } = amountInfo;
  const { tokenId } = tokensInfo;

  function AvailableAmountElement() {
    if (maxAmountAvailable !== '0') {
      return (
        <small
          className='form-text text-secondary mt-1'
          data-testid={`available${tokenId}`}
          data-value={`${maxAmountAvailable} ${tokenId}`}
        >
          Available {maxAmountAvailable}
        </small>
      );
    }

    return null;
  }

  return <SharedAmount AvailableAmountElement={AvailableAmountElement} />;
};

export default EsdtAmount;
