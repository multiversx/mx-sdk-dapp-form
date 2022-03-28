import React from 'react';

import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType, TxTypeEnum } from 'types';
import Token from 'UI/Confirm/Token';
import { Amount, Data, FeeAccordion, SelectToken, To } from 'UI/Fields';

export const Form = () => {
  const { formInfo, receiverInfo } = useSendFormContext();
  const {
    values: { txType }
  } = useFormikContext<ExtendedValuesType>();

  const { renderKey, onValidateForm, readonly } = formInfo;

  const { scamError } = receiverInfo;

  function handleCloseClick(e: any) {
    e.preventDefault();
    close();
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
                <Token />
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
          <button
            id='closeButton'
            data-testid='returnToWalletBtn'
            onClick={handleCloseClick}
            className='mt-3'
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
