import React, { useState, MouseEvent } from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProviderTypeEnum } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useFormContext } from 'contexts';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { TransactionTypeEnum } from 'types';
import Confirm from 'UI/Confirm';
import { Receiver as ConfirmReceiver } from 'UI/Confirm/Receiver';
import { NFTSFTPreview } from 'UI/NFTSFTPreview';

import styles from './../confirmScreen.module.scss';
import { getConfirmButtonLabel, getReceiverUsername } from './helpers';

export interface TransactionSummaryPropsType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: keyof typeof ProviderTypeEnum;
  hasGuardianScreen?: boolean;
}

export const TransactionSummary = ({
  isConfirmCloseBtnVisible = true,
  providerType
}: TransactionSummaryPropsType) => {
  const { setIsGuardianScreenVisible } = useFormContext();

  const {
    receiverUsernameInfo: { receiverUsername },
    receiverInfo: { scamError, receiver, knownAddresses },
    formInfo,
    gasInfo: { gasCostError, feeLimit },
    accountInfo: { isGuarded },
    dataFieldInfo: { data },
    amountInfo,
    tokensInfo
  } = useSendFormContext();

  const isReceiverKnown = knownAddresses?.find(
    (knownAddress) => knownAddress.address === receiver
  );

  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const {
    readonly,
    onCloseForm,
    onInvalidateForm,
    onPreviewClick,
    onSubmitForm,
    txType,
    hasGuardianScreen
  } = formInfo;

  const onNext = () => {
    setIsGuardianScreenVisible(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNFT = txType === TransactionTypeEnum.NonFungibleESDT;
  const confirmButtonLabel = getConfirmButtonLabel({
    providerType,
    hasGuardianScreen
  });

  const onCloseClick = (event: MouseEvent) => {
    event.preventDefault();

    if (readonly) {
      onCloseForm();
    } else {
      onInvalidateForm();
    }
  };

  const onConfirmClick = () => {
    if (isGuarded && hasGuardianScreen) {
      return onNext();
    }

    setIsSubmitting(true);
    onSubmitForm();
  };

  const isNFTTransaction = ![
    TransactionTypeEnum.EGLD,
    TransactionTypeEnum.ESDT,
    TransactionTypeEnum.MetaESDT
  ].includes(txType);

  const transactionReceiverUsername = getReceiverUsername({
    knownAddresses,
    receiverAddress: receiver,
    existingReceiverUsername: receiverUsername
  });

  return (
    <div className={styles.summary}>
      <div className={styles.fields}>
        {isNFTTransaction && nft && (
          <NFTSFTPreview onClick={onPreviewClick} txType={txType} {...nft} />
        )}

        {!isReceiverKnown && (
          <div className={styles.warning}>
            <FontAwesomeIcon
              className={styles.warningIcon}
              icon={faTriangleExclamation}
            />

            <div className={styles.warningText}>
              <strong>Verify the full address.</strong> This is your first time
              transacting with this address. Please double check to ensure its
              accuracy before proceeding.
            </div>
          </div>
        )}

        <ConfirmReceiver
          amount={amountInfo.amount}
          scamReport={scamError ?? null}
          receiver={receiver}
          receiverUsername={transactionReceiverUsername}
          shouldTrimReceiver={Boolean(isReceiverKnown)}
        />

        <div className={styles.columns}>
          {!isNFT && (
            <div className={styles.column}>
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
            </div>
          )}

          <div className={styles.column}>
            <Confirm.Fee
              egldLabel={egldLabel}
              egldPriceInUsd={egldPriceInUsd}
              feeLimit={feeLimit}
            />
          </div>
        </div>

        <Confirm.Data data={data} />

        {gasCostError && <p className={globals.error}>{gasCostError}</p>}
      </div>

      <div className={styles.buttons}>
        <button
          className={globals.buttonSend}
          type='button'
          id='sendTrxBtn'
          data-testid={FormDataTestIdsEnum.sendTrxBtn}
          disabled={isSubmitting}
          onClick={onConfirmClick}
        >
          {confirmButtonLabel}
        </button>

        {isConfirmCloseBtnVisible && (
          <button
            className={globals.buttonText}
            type='button'
            id='cancelTrxBtn'
            data-testid={FormDataTestIdsEnum.cancelTrxBtn}
            onClick={onCloseClick}
          >
            {readonly ? 'Close' : 'Back'}
          </button>
        )}
      </div>
    </div>
  );
};
