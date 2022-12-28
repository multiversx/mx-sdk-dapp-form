import React from 'react';

import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import classNames from 'classnames';
import { ZERO } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import { SharedAmount } from './components';
import styles from './styles.module.scss';

export const EsdtAmount = ({ className }: WithClassnameType) => {
  const { amountInfo, tokensInfo } = useSendFormContext();
  const { maxAmountAvailable } = amountInfo;
  const { tokenId } = tokensInfo;

  function AvailableAmountElement() {
    if (maxAmountAvailable !== ZERO) {
      return (
        <small
          className={classNames(styles.small, className)}
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
