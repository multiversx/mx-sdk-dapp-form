import React from 'react';
import { LoginMethodsEnum } from '@elrondnetwork/dapp-core/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import Confirm from '../Confirm';

import styles from './styles.module.scss';

interface ConfirmScreenType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: string;
}

export const ConfirmScreen = ({
  isConfirmCloseBtnVisible = true,
  providerType
}: ConfirmScreenType) => {
  const {
    tokensInfo,
    receiverInfo,
    amountInfo,
    dataFieldInfo,
    formInfo,
    gasInfo
  } = useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const {
    readonly,
    onCloseForm,
    onInvalidateForm,
    onSubmitForm,
    txType
  } = formInfo;
  const { data } = dataFieldInfo;
  const { receiver, scamError } = receiverInfo;
  const { feeLimit, gasCostError } = gasInfo;

  let confirmText: string;

  switch (providerType) {
    case LoginMethodsEnum.walletconnect:
      confirmText = 'Confirm & Check your App';
      break;
    case LoginMethodsEnum.ledger:
      confirmText = 'Confirm & Check your Ledger';
      break;
    default:
      confirmText = 'Confirm';
      break;
  }

  const onCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (readonly) {
      onCloseForm();
    } else {
      onInvalidateForm();
    }
  };

  return (
    <div className={styles.confirm}>
      <Confirm.To {...{ receiver, nft }} scamReport={scamError} />

      <Confirm.Amount
        {...{
          amount: String(amountInfo.amount),
          txType,
          tokenDecimals: tokenDetails.decimals,
          tokenId,
          egldLabel,
          tokenLabel: tokenDetails.name,
          tokenAvatar: tokenDetails.assets?.svgUrl || '',
          egldPriceInUsd,
          nft
        }}
      />

      <Confirm.Fee {...{ feeLimit, egldPriceInUsd, egldLabel }} />
      <Confirm.Data {...{ data, egldPriceInUsd }} />

      <div className={styles.buttons}>
        {gasCostError && <p className={globals.error}>${gasCostError}</p>}

        <button
          className={classNames(globals.btn, globals.btnPrimary, {
            [globals.btnWarning]: scamError
          })}
          type='button'
          id='sendTrxBtn'
          data-testid='sendTrxBtn'
          onClick={onSubmitForm}
        >
          {confirmText}
        </button>

        {isConfirmCloseBtnVisible && (
          <button
            className={classNames(globals.btn, globals.btnLink, {
              [globals.btnWarning]: scamError
            })}
            type='button'
            id='cancelTrxBtn'
            data-testid='cancelTrxBtn'
            onClick={onCloseClick}
          >
            {readonly ? 'Close' : 'Back'}
          </button>
        )}
      </div>
    </div>
  );
};
