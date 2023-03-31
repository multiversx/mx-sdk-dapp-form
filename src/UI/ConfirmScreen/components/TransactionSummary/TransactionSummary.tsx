import React, { useState } from 'react';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import Confirm from 'UI/Confirm';

import styles from './../confirmScreen.module.scss';

export interface TransactionSummaryPropsType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: string;
}

export const TransactionSummary = ({
  isConfirmCloseBtnVisible = true,
  providerType,
  onNext
}: TransactionSummaryPropsType & {
  onNext: () => void;
}) => {
  const {
    receiverInfo: { scamError, receiver },
    formInfo,
    gasInfo: { gasCostError, feeLimit },
    accountInfo: { isGuardedAccount },
    dataFieldInfo: { data },
    amountInfo,
    tokensInfo
  } = useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const { readonly, onCloseForm, onInvalidateForm, onSubmitForm, txType } =
    formInfo;
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
    if (isGuardedAccount) {
      return onNext();
    }
    setIsSubmitting(true);
    onSubmitForm();
  };

  return (
    <>
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
          className={classNames('my-3', globals.btn, globals.btnPrimary, {
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
    </>
  );
};
