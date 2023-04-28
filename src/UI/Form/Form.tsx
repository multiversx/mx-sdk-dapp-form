import React, { useEffect, MouseEvent, useState } from 'react';

import {
  TransactionOptions,
  TransactionVersion
} from '@multiversx/sdk-core/out';
import { ZERO } from '@multiversx/sdk-dapp/constants';
import {
  DeviceSignedTransactions,
  GuardianScreenType
} from '@multiversx/sdk-dapp/types/transactions.types';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { generateTransaction } from 'operations/generateTransaction';
import { ExtendedValuesType, TransactionTypeEnum } from 'types';

import { ConfirmScreen } from 'UI/ConfirmScreen';
import {
  Amount,
  Data,
  FeeAccordion,
  Receiver,
  AmountSlider,
  AmountSelectInput
} from 'UI/Fields';

import { NFTSFTPreview } from 'UI/NFTSFTPreview';
import { NFTTransferWarning } from 'UI/NFTTransferWarning';
import { WEGLDWarning } from 'UI/WEGLDWarning';

import styles from './form.module.scss';
import { getSendLabel } from './helpers';

interface FormPropsType extends WithClassnameType {
  GuardianScreen?: (props: GuardianScreenType) => JSX.Element;
}

export const Form = ({ className, GuardianScreen }: FormPropsType) => {
  const { formInfo, accountInfo, amountInfo, tokensInfo } =
    useSendFormContext();
  const { values } = useFormikContext<ExtendedValuesType>();
  const { txType, tokenId, address, balance, chainId } = values;
  const { nft } = tokensInfo;

  const [signedTransactions, setSignedTransactions] =
    useState<DeviceSignedTransactions>();

  const { amountRange, onSetAmountPercentage } = amountInfo;

  const {
    renderKey,
    onValidateForm,
    onInvalidateForm,
    onCloseForm,
    onSubmitForm,
    onPreviewClick,
    areValidatedValuesReady,
    isGuardianScreenVisible,
    uiOptions,
    readonly,
    setGuardedTransaction,
    setHasGuardianScreen
  } = formInfo;

  // TODO: move outside of render
  const createTransaction = async () => {
    if (!areValidatedValuesReady) {
      return;
    }
    const actualTransactionAmount =
      values.txType === TransactionTypeEnum.EGLD ? values.amount : ZERO;
    const parsedValues = { ...values, amount: actualTransactionAmount };

    try {
      const transaction = await generateTransaction({
        address,
        balance,
        chainId,
        nonce: accountInfo.nonce,
        values: parsedValues
      });

      transaction.setVersion(TransactionVersion.withTxOptions());
      transaction.setOptions(TransactionOptions.withOptions({ guarded: true }));

      setSignedTransactions({ 0: transaction });
    } catch {
      // no need to handle error, since values may be invalid
      setSignedTransactions({});
    }
  };

  useEffect(() => {
    createTransaction();
  }, [values, areValidatedValuesReady]);

  useEffect(() => {
    // account may be guarded, but 2FA will be provided in provider
    setHasGuardianScreen(Boolean(GuardianScreen));
  }, []);

  useEffect(() => {
    if (!signedTransactions) {
      return;
    }
    const transaction = signedTransactions[0];
    if (transaction) {
      setGuardedTransaction(transaction);
    }
  }, [signedTransactions]);

  const handleCloseClick = (event: MouseEvent) => {
    event.preventDefault();
    onCloseForm();
  };

  const isNFTTransaction = ![
    TransactionTypeEnum.EGLD,
    TransactionTypeEnum.ESDT,
    TransactionTypeEnum.MetaESDT
  ].includes(txType);

  const onConfirmClick = () => {
    // allow setting guarded transaction then submit form

    setTimeout(() => {
      onSubmitForm();
    });
  };

  const props: GuardianScreenType = {
    onSignTransaction: onConfirmClick,
    onPrev: onInvalidateForm,
    title: '',
    className,
    signedTransactions,
    setSignedTransactions,
    signStepInnerClasses: {}
  };

  if (GuardianScreen && isGuardianScreenVisible) {
    return <GuardianScreen {...props} />;
  }

  if (areValidatedValuesReady) {
    return <ConfirmScreen providerType={accountInfo.providerType} />;
  }

  return (
    <form
      key={renderKey}
      onSubmit={onValidateForm}
      className={classNames(styles.form, className)}
    >
      <fieldset className={styles.formFieldset}>
        {isNFTTransaction && nft && (
          <NFTSFTPreview onClick={onPreviewClick} txType={txType} {...nft} />
        )}

        <Receiver />

        {isNFTTransaction ? <Amount /> : <AmountSelectInput />}

        {uiOptions?.showAmountSlider && !isNFTTransaction && (
          <AmountSlider
            onPercentageChange={onSetAmountPercentage}
            percentageValue={amountRange}
            disabled={Boolean(readonly)}
          />
        )}

        <WEGLDWarning tokenId={tokenId} />
        <NFTTransferWarning />

        <FeeAccordion />

        <Data />
      </fieldset>

      <div className={styles.formButtons}>
        <button
          type='button'
          id='sendBtn'
          data-testid='sendBtn'
          onClick={onValidateForm}
          className={globals.buttonSend}
        >
          Send {getSendLabel(tokensInfo)}
        </button>

        <button
          type='button'
          id='closeButton'
          data-testid='returnToWalletBtn'
          onClick={handleCloseClick}
          className={globals.buttonText}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
