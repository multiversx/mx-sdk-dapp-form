import React, { useState } from 'react';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import Confirm from '../Confirm';

import styles from './styles.module.scss';

export interface ConfirmScreenPropsType extends WithClassnameType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: string;
}

export const ConfirmScreen = ({
  isConfirmCloseBtnVisible = true,
  providerType,
  className
}: ConfirmScreenPropsType) => {
  const {
    tokensInfo,
    receiverInfo,
    amountInfo,
    dataFieldInfo,
    formInfo,
    gasInfo
  } = useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const { readonly, onCloseForm, onInvalidateForm, onSubmitForm, txType } =
    formInfo;
  const { data } = dataFieldInfo;
  const { receiver, scamError } = receiverInfo;
  const { feeLimit, gasCostError } = gasInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);

  let confirmText: string;

  switch (providerType) {
    case LoginMethodsEnum.walletconnect:
    case LoginMethodsEnum.extension:
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

  const onConfirmClick = () => {
    setIsSubmitting(true);
    onSubmitForm();
  };

  return (
    <div
      className={classNames(styles.confirm, className)}
      data-testid='confirmScreen'
    >
      <Confirm.Receiver receiver={receiver} scamReport={scamError} />

      <Confirm.Amount
        txType={txType}
        tokenId={tokenId}
        tokenDecimals={tokenDetails.decimals}
        amount={String(amountInfo.amount)}
        nft={nft}
        egldPriceInUsd={egldPriceInUsd}
        egldLabel={egldLabel}
        tokenLabel={tokenDetails.name}
        tokenAvatar={tokenDetails.assets?.svgUrl || ''}
      />

      <Confirm.Fee
        egldLabel={egldLabel}
        egldPriceInUsd={egldPriceInUsd}
        feeLimit={feeLimit}
      />
      <Confirm.Data data={data} />

      <div className={styles.buttons}>
        {gasCostError && <p className={globals.error}>{gasCostError}</p>}

        <button
          className={classNames(globals.btn, globals.btnPrimary, {
            [globals.btnWarning]: scamError
          })}
          type='button'
          id='sendTrxBtn'
          data-testid='sendTrxBtn'
          disabled={isSubmitting}
          onClick={onConfirmClick}
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
