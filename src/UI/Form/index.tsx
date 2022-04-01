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

export const Form = () => {
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

  return (
    <form key={renderKey} onSubmit={onValidateForm} className='m-4'>
      <div>
        <fieldset disabled={readonly} className='text-left'>
          <To />
          <div className='row'>
            <div className='col-sm-6 col-12'>
              <Amount />
            </div>
            <div className='col-sm-6 col-12'>
              {[TxTypeEnum.EGLD, TxTypeEnum.ESDT, TxTypeEnum.MetaESDT].includes(
                txType
              ) ? (
                <SelectToken />
              ) : (
                <NftSftToken />
              )}
            </div>
          </div>
          <FeeAccordion />
          <Data />
        </fieldset>
        <div className='d-flex align-items-center flex-column mt-spacer'>
          <button
            className={classNames('btn px-spacer', {
              ['btn-warning']: scamError,
              ['btn-primary']: !scamError
            })}
            type={'button'}
            id='sendBtn'
            data-testid='sendBtn'
            onClick={onValidateForm}
          >
            Send
          </button>
          <a
            href='/#'
            id='closeButton'
            data-testid='returnToWalletBtn'
            onClick={handleCloseClick}
            className='mt-3'
          >
            Cancel
          </a>
        </div>
      </div>
    </form>
  );
};

export default Form;
