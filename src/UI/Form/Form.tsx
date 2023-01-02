import React from 'react';

import { WithClassnameType } from '@elrondnetwork/dapp-core/UI/types';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType, TransactionTypeEnum } from 'types';

import { ConfirmScreen } from 'UI/ConfirmScreen';
import {
  Amount,
  Data,
  FeeAccordion,
  NftSftToken,
  SelectToken,
  Receiver,
  AmountSlider
} from 'UI/Fields';

import { CanTransferNftWarning, WegldWarning } from 'UI/Warnings';
import styles from './form.module.scss';

export const Form = ({ className }: WithClassnameType) => {
  const {
    formInfo,
    receiverInfo,
    accountInfo,
    amountInfo
  } = useSendFormContext();
  const {
    values: { txType, tokenId }
  } = useFormikContext<ExtendedValuesType>();

  const { scamError } = receiverInfo;
  const { amountRange, onSetAmountPercentage } = amountInfo;

  const {
    renderKey,
    onValidateForm,
    onCloseForm,
    areValidatedValuesReady,
    uiOptions,
    readonly
  } = formInfo;

  function handleCloseClick(e: any) {
    e.preventDefault();
    onCloseForm();
  }

  const isNFTTransaction = ![
    TransactionTypeEnum.EGLD,
    TransactionTypeEnum.ESDT,
    TransactionTypeEnum.MetaESDT
  ].includes(txType);

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

        {isNFTTransaction ? <NftSftToken /> : <SelectToken label='Token' />}

        <Amount />

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
          className={classNames(globals.btn, globals.btnPrimary, {
            [globals.btnWarning]: scamError
          })}
          type='button'
          id='sendBtn'
          data-testid='sendBtn'
          onClick={onValidateForm}
        >
          Send
        </button>

        <button
          className={classNames(globals.btn, globals.btnLink, {
            [globals.btnWarning]: scamError
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
