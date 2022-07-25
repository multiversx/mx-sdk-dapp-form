import React from 'react';

import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType, TxTypeEnum } from 'types';
import {
  Amount,
  Data,
  FeeAccordion,
  NftSftToken,
  SelectToken,
  To
} from 'UI/Fields';

import styles from './styles.module.scss';
import globals from 'assets/sass/globals.module.scss';

const Form = () => {
  const { formInfo, receiverInfo } = useSendFormContext();
  const {
    values: { txType }
  } = useFormikContext<ExtendedValuesType>();

  const { renderKey, onValidateForm, readonly, onCloseForm } = formInfo;
  const { scamError } = receiverInfo;

  function handleCloseClick(e: any) {
    e.preventDefault();
    onCloseForm();
  }

  const isNFTTransaction = ![
    TxTypeEnum.EGLD,
    TxTypeEnum.ESDT,
    TxTypeEnum.MetaESDT
  ].includes(txType);

  return (
    <form key={renderKey} onSubmit={onValidateForm} className={styles.form}>
      <fieldset disabled={readonly} className={styles.fieldset}>
        <To />

        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Amount />
          </div>

          <div className={styles.right}>
            {isNFTTransaction ? <NftSftToken /> : <SelectToken />}
          </div>
        </div>

        <FeeAccordion />

        <Data />
      </fieldset>

      <div className={styles.buttons}>
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

export { Form };
