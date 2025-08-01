import React, { useEffect, MouseEvent, useState } from 'react';

import {
  TransactionOptions,
  TransactionVersion
} from '@multiversx/sdk-core/out';
import { ProviderType } from '@multiversx/sdk-dapp/out/providers/types/providerFactory.types';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getTransactionFields } from 'helpers';
import { generateTransaction } from 'operations/generateTransaction';
import { WithClassnameType } from 'types';
import {
  ExtendedValuesType,
  TransactionTypeEnum,
  DeviceSignedTransactions,
  GuardianScreenType
} from 'types';

import { ConfirmScreen } from 'UI/ConfirmScreen';
import {
  SFTAmount,
  Data,
  FeeAccordion,
  Receiver,
  AmountSlider,
  AmountSelectInput
} from 'UI/Fields';

import { NFTCanTransferWarning } from 'UI/NFTCanTransferWarning';
import { NFTSFTPreview } from 'UI/NFTSFTPreview';
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
  const { txType, tokenId, address, balance, chainId, ledger } = values;
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

    const parsedValues = await getTransactionFields(values);

    try {
      const transaction = await generateTransaction({
        address,
        balance,
        chainId,
        nonce: accountInfo.nonce,
        values: parsedValues
      });

      transaction.version = TransactionVersion.withTxOptions().valueOf();
      const options = {
        guarded: true,
        ...(ledger ? { hashSign: true } : {})
      };
      transaction.options = TransactionOptions.withOptions(options).valueOf();

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

  const isNFTTransaction = txType === TransactionTypeEnum.NonFungibleESDT;
  const isSFTTransaction = txType === TransactionTypeEnum.SemiFungibleESDT;

  const onConfirmClick = async () => {
    // allow setting guarded transaction then submit form

    setTimeout(() => {
      onSubmitForm();
    });
  };

  const props: GuardianScreenType = {
    onSignTransaction: onConfirmClick,
    onPrev: onInvalidateForm,
    address,
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
    return (
      <ConfirmScreen
        providerType={String(accountInfo.providerType) as ProviderType}
      />
    );
  }

  return (
    <form
      key={renderKey}
      onSubmit={onValidateForm}
      className={classNames(styles.form, className)}
    >
      <fieldset className={styles.formFieldset}>
        {(isNFTTransaction || isSFTTransaction) && nft && (
          <NFTSFTPreview onClick={onPreviewClick} txType={txType} {...nft} />
        )}

        <Receiver />

        {isSFTTransaction ? <SFTAmount /> : <AmountSelectInput />}

        {uiOptions?.showAmountSlider && !isNFTTransaction && (
          <AmountSlider
            onPercentageChange={onSetAmountPercentage}
            percentageValue={amountRange}
            disabled={Boolean(readonly)}
          />
        )}

        <WEGLDWarning tokenId={tokenId} />
        <NFTCanTransferWarning />

        <FeeAccordion />

        <Data />
      </fieldset>

      <div className={styles.formButtons}>
        <button
          type='button'
          id='sendBtn'
          data-testid={FormDataTestIdsEnum.sendBtn}
          onClick={onValidateForm}
          className={globals.buttonSend}
        >
          Send {getSendLabel(tokensInfo)}
        </button>

        <button
          type='button'
          id='closeButton'
          data-testid={FormDataTestIdsEnum.returnToWalletBtn}
          onClick={handleCloseClick}
          className={globals.buttonText}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
