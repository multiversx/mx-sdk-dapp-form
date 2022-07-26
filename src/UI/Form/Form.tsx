import React from 'react';

import classNames from 'classnames';
import { useFormikContext } from 'formik';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType, TxTypeEnum } from 'types';

import { ConfirmScreen } from 'UI/ConfirmScreen';
import {
  Amount,
  Data,
  FeeAccordion,
  NftSftToken,
  SelectToken,
  To,
  AmountSlider
} from 'UI/Fields';

import styles from './styles.module.scss';

export const Form = () => {
  const { formInfo, receiverInfo, accountInfo } = useSendFormContext();
  const {
    values: { txType }
  } = useFormikContext<ExtendedValuesType>();

  const { scamError } = receiverInfo;
  const { renderKey, onValidateForm, onCloseForm, areValidatedValuesReady } =
    formInfo;

  function handleCloseClick(e: any) {
    e.preventDefault();
    onCloseForm();
  }

  const isNFTTransaction = ![
    TxTypeEnum.EGLD,
    TxTypeEnum.ESDT,
    TxTypeEnum.MetaESDT
  ].includes(txType);

  if (areValidatedValuesReady) {
    return <ConfirmScreen providerType={accountInfo.providerType} />;
  }

  return (
    <form key={renderKey} onSubmit={onValidateForm} className={styles.form}>
      <fieldset className={styles.formFieldset}>
        <To />

        <div className={styles.formWrapper}>
          <div className={styles.formLeft}>
            <Amount />
          </div>

          <div className={styles.formRight}>
            {isNFTTransaction ? <NftSftToken /> : <SelectToken />}
          </div>
        </div>

        <AmountSlider />

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
