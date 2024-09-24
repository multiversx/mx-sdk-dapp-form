import React, { useState, MouseEvent } from 'react';
import { ConfirmReceiver } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignWithDeviceModal/components/components/ConfirmReceiver';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useFormContext } from 'contexts';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { TransactionTypeEnum } from 'types';
import Confirm from 'UI/Confirm';
import { NFTSFTPreview } from 'UI/NFTSFTPreview';

import { getConfirmButtonLabel, getReceiverUsername } from './helpers';

export interface TransactionSummaryPropsType {
  isConfirmCloseBtnVisible?: boolean;
  providerType: string;
  hasGuardianScreen?: boolean;
}

export const TransactionSummaryComponent = ({
  isConfirmCloseBtnVisible = true,
  providerType,
  globalStyles,
  styles
}: TransactionSummaryPropsType & WithStylesImportType) => {
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
    <div className={styles?.summary}>
      <div className={styles?.fields}>
        {isNFTTransaction && nft && (
          <NFTSFTPreview onClick={onPreviewClick} txType={txType} {...nft} />
        )}

        <ConfirmReceiver
          amount={amountInfo.amount}
          scamReport={scamError ?? null}
          receiver={receiver}
          receiverUsername={transactionReceiverUsername}
        />

        <div className={styles?.columns}>
          {!isNFT && (
            <div className={styles?.column}>
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

          <div className={styles?.column}>
            <Confirm.Fee
              egldLabel={egldLabel}
              egldPriceInUsd={egldPriceInUsd}
              feeLimit={feeLimit}
            />
          </div>
        </div>

        <Confirm.Data data={data} />

        {gasCostError && <p className={globalStyles?.error}>{gasCostError}</p>}
      </div>

      <div className={styles?.buttons}>
        <button
          className={globalStyles?.buttonSend}
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
            className={globalStyles?.buttonText}
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

export const TransactionSummary = withStyles(TransactionSummaryComponent, {
  ssrStyles: () => import('UI/ConfirmScreen/styles?.scss'),
  clientStyles: () => require('UI/ConfirmScreen/styles?.scss').default
});
