import React, { useEffect, useState } from 'react';

import {
  TransactionOptions,
  TransactionVersion
} from '@multiversx/sdk-core/out';
import { ZERO } from '@multiversx/sdk-dapp/constants';
import { GuardianScreen } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignWithDeviceModal/components/GuardianScreen/GuardianScreen';
import {
  GuardianScreenType,
  DeviceSignedTransactions
} from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignWithDeviceModal/signWithDeviceModal.types';
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
  NftSftToken,
  Receiver,
  AmountSlider,
  AmountSelectInput
} from 'UI/Fields';

import { CanTransferNftWarning, WegldWarning } from 'UI/Warnings';
import styles from './form.module.scss';
import { getSendLabel } from './helpers';

export const Form = ({ className }: WithClassnameType) => {
  const { formInfo, receiverInfo, accountInfo, amountInfo, tokensInfo } =
    useSendFormContext();
  const { values } = useFormikContext<ExtendedValuesType>();
  const { txType, tokenId, address, balance, chainId } = values;

  const [signedTransactions, setSignedTransactions] =
    useState<DeviceSignedTransactions>();

  const { amountRange, onSetAmountPercentage } = amountInfo;

  const {
    renderKey,
    onValidateForm,
    onInvalidateForm,
    onCloseForm,
    onSubmitForm,
    areValidatedValuesReady,
    isGuardianScreenVisible,
    uiOptions,
    readonly,
    setGuardedTransaction
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
    if (!signedTransactions) {
      return;
    }
    const transaction = signedTransactions[0];
    if (transaction) {
      setGuardedTransaction(transaction);
    }
  }, [signedTransactions]);

  function handleCloseClick(e: any) {
    e.preventDefault();
    onCloseForm();
  }

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
    guardianProvider: accountInfo.guardianProvider,
    title: '',
    className,
    signedTransactions,
    setSignedTransactions,
    signStepInnerClasses: {}
  };

  if (isGuardianScreenVisible) {
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
        <Receiver />

        {isNFTTransaction ? (
          <>
            <NftSftToken />
            <Amount />
          </>
        ) : (
          <AmountSelectInput />
        )}

        {uiOptions?.showAmountSlider && !isNFTTransaction && (
          <AmountSlider
            onPercentageChange={onSetAmountPercentage}
            percentageValue={amountRange}
            disabled={Boolean(readonly)}
          />
        )}

        <WegldWarning tokenId={tokenId} />

        <CanTransferNftWarning />

        <FeeAccordion />

        <Data />
      </fieldset>

      <div className={styles.formButtons}>
        <button
          className={classNames('my-3', globals.btn, globals.btnPrimary, {
            [globals.btnWarning]: receiverInfo?.scamError
          })}
          type='button'
          id='sendBtn'
          data-testid='sendBtn'
          onClick={onValidateForm}
        >
          Send {getSendLabel(tokensInfo)}
        </button>

        <button
          className={classNames(globals.btn, globals.btnLink, {
            [globals.btnWarning]: receiverInfo?.scamError
          })}
          type='button'
          id='closeButton'
          data-testid='returnToWalletBtn'
          onClick={handleCloseClick}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
