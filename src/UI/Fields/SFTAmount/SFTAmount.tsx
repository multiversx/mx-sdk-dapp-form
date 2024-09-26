import React, { MouseEvent } from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts';
import { getIsDisabled } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ValuesEnum } from 'types';

export const SFTAmountComponent = (
  props: WithClassnameType & WithStylesImportType
) => {
  const { className, globalStyles, styles } = props;
  const {
    formInfo: { readonly },
    amountInfo,
    tokensInfo
  } = useSendFormContext();
  const {
    amount,
    error,
    onFocus,
    onBlur,
    onChange,
    isInvalid,
    onMaxClicked,
    maxAmountAvailable,
    isMaxButtonVisible
  } = amountInfo;

  const { nft } = tokensInfo;

  const hasPositiveBalance = nft?.balance
    ? new BigNumber(nft.balance).isGreaterThan(0)
    : false;

  const onMaxAmount = (event: MouseEvent) => {
    event.preventDefault();
    onMaxClicked();
  };

  return (
    <div className={classNames(styles?.amount, className)}>
      <div className={styles?.label}>
        <label htmlFor={ValuesEnum.amount} className={globalStyles?.label}>
          Amount
        </label>

        {hasPositiveBalance && nft && (
          <div
            data-value={`${maxAmountAvailable} ${nft.identifier}`}
            className={classNames(styles?.balance, className)}
          >
            <span>Available:</span>{' '}
            <span
              data-testid={`available-${nft.identifier}`}
              className={styles?.available}
            >
              {maxAmountAvailable} {nft.ticker}
            </span>
          </div>
        )}
      </div>

      <div className={styles?.wrapper}>
        <input
          type='text'
          id={ValuesEnum.amount}
          name={ValuesEnum.amount}
          data-testid={ValuesEnum.amount}
          required
          value={amount}
          disabled={getIsDisabled(ValuesEnum.amount, readonly)}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          autoComplete='off'
          className={classNames(globalStyles?.input, {
            [globalStyles?.invalid]: isInvalid,
            [globalStyles?.disabled]: getIsDisabled(ValuesEnum.amount, readonly)
          })}
        />

        {isMaxButtonVisible && (
          <a
            href='/'
            data-testid={FormDataTestIdsEnum.maxBtn}
            className={styles?.max}
            onClick={onMaxAmount}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            Max
          </a>
        )}
      </div>

      {isInvalid && (
        <div
          className={globalStyles?.error}
          data-testid={FormDataTestIdsEnum.amountError}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export const SFTAmount = withStyles(SFTAmountComponent, {
  ssrStyles: () => import('UI/Fields/SFTAmount/styles.scss'),
  clientStyles: () => require('UI/Fields/SFTAmount/styles.scss').default
});
