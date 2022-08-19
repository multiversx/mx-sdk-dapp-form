import React from 'react';
import BigNumber from 'bignumber.js';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { NftEnumType } from 'types';

import { SharedAmount } from './components';
import styles from './styles.module.scss';

export const NftAmount = () => {
  const { amountInfo, tokensInfo } = useSendFormContext();
  const { nft } = tokensInfo;
  const { maxAmountAvailable, isMaxClicked } = amountInfo;

  function AvailableAmountElement() {
    const hasPositiveBalance = new BigNumber(nft?.balance || 0).isGreaterThan(
      0
    );
    return hasPositiveBalance && !isMaxClicked ? (
      <small
        className={styles.small}
        data-testid={`available-${nft?.identifier}`}
        data-value={`${maxAmountAvailable} ${nft?.identifier}`}
      >
        Available {maxAmountAvailable}
      </small>
    ) : null;
  }

  if (nft?.type === NftEnumType.NonFungibleESDT) {
    return null;
  }

  return <SharedAmount AvailableAmountElement={AvailableAmountElement} />;
};
