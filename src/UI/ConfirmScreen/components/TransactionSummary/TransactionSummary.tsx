import React, { useState, MouseEvent } from 'react';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types/enums.types';

import globals from 'assets/sass/globals.module.scss';
import { useFormContext } from 'contexts';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import Confirm from 'UI/Confirm';

import styles from './../confirmScreen.module.scss';

export interface TransactionSummaryPropsType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: string;
}

export const TransactionSummary = ({
  isConfirmCloseBtnVisible = true,
  providerType
}: TransactionSummaryPropsType) => {
  const { setIsGuardianScreenVisible } = useFormContext();

  const {
    receiverInfo: { scamError, receiver },
    formInfo,
    gasInfo: { gasCostError, feeLimit },
    accountInfo: { isGuarded, guardianProvider },
    dataFieldInfo: { data },
    amountInfo,
    tokensInfo
  } = useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const { readonly, onCloseForm, onInvalidateForm, onSubmitForm, txType } =
    formInfo;

  const onNext = () => {
    setIsGuardianScreenVisible(true);
  };

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

  const onCloseClick = (event: MouseEvent) => {
    event.preventDefault();

    if (readonly) {
      onCloseForm();
    } else {
      onInvalidateForm();
    }
  };

  const onConfirmClick = () => {
    if (isGuarded && guardianProvider) {
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

      {gasCostError && <p className={globals.error}>{gasCostError}</p>}

      <div className={styles.buttons}>
        <button
          className={globals.buttonSend}
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
            className={globals.buttonText}
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
