import React from 'react';
import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import { UsdValue } from '@elrondnetwork/dapp-core/UI/UsdValue/index';

import classNames from 'classnames';
import { ZERO } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { InfoDust } from 'UI/InfoDust';
import { SharedAmount } from './components';

import styles from './styles.module.scss';

export const EgldAmount = ({ className }: WithClassnameType) => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { egldLabel, egldPriceInUsd } = tokensInfo;
  const {
    isMaxClicked,
    isInvalid,
    maxAmountAvailable,
    maxAmountMinusDust
  } = amountInfo;

  function AvailableAmountElement() {
    if (!isInvalid && amountInfo.amount) {
      return (
        <div className={styles.container}>
          <UsdValue
            amount={amountInfo.amount}
            usd={egldPriceInUsd}
            data-testid={`egldPrice_${egldPriceInUsd}`}
          />

          {amountInfo.amount === maxAmountMinusDust && isMaxClicked && (
            <span className={styles.amountInfo}>
              <InfoDust egldLabel={egldLabel} />
            </span>
          )}
        </div>
      );
    }

    if (maxAmountAvailable !== ZERO) {
      return (
        <small
          className={classNames(styles.small, className)}
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
      className={className}
      AvailableAmountElement={AvailableAmountElement}
    />
  );
};
