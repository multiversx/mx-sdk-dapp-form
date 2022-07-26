import React from 'react';
import { UsdValue } from '@elrondnetwork/dapp-core/UI/UsdValue';

import { ZERO } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { InfoDust } from 'UI/InfoDust';
import { SharedAmount } from './SharedAmount';

import styles from './styles.module.scss';

export const EgldAmount = () => {
  const { tokensInfo, amountInfo } = useSendFormContext();

  const { egldLabel, egldPriceInUsd } = tokensInfo;
  const { isMaxClicked, isInvalid, maxAmountAvailable, maxAmountMinusDust } =
    amountInfo;

  function AvailableAmountElement() {
    if (!isInvalid && amountInfo.amount) {
      return (
        <div className={styles.container}>
          <UsdValue amount={amountInfo.amount} usd={egldPriceInUsd} />

          {amountInfo.amount === maxAmountMinusDust && isMaxClicked && (
            <span className={styles.info}>
              <InfoDust egldLabel={egldLabel} />
            </span>
          )}
        </div>
      );
    }

    if (maxAmountAvailable !== ZERO) {
      return (
        <small
          className={styles.small}
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
