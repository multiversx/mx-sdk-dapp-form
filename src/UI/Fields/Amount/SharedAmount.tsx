import React from 'react';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

interface SharedAmountType {
  AvailableAmountElement: () => JSX.Element | null;
}

export const SharedAmount = (props: SharedAmountType) => {
  const { AvailableAmountElement } = props;

  const {
    formInfo: { checkInvalid },
    amountInfo
  } = useSendFormContext();
  const {
    amount,
    error,
    isMaxButtonVisible,
    onMaxClicked,
    onFocus,
    onBlur,
    onChange
  } = amountInfo;

  const isInvalid = checkInvalid('amount');
  const invalidClassname = classnames({ 'is-invalid': isInvalid });

  return (
    <div className='form-group amount'>
      <label htmlFor='amount' data-testid='amountLabel'>
        Amount
      </label>
      <div className={`input-group input-group-seamless ${invalidClassname}`}>
        <input
          type='text'
          className={`form-control ${invalidClassname}`}
          id='amount'
          name='amount'
          data-testid='amount'
          required={true}
          value={amount}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          autoComplete='off'
        />
        {isMaxButtonVisible && (
          <span className='input-group-append'>
            <span className='input-group-text'>
              <button
                className='p-0 btn btn-link'
                data-testid='maxBtn'
                onClick={onMaxClicked}
              >
                Max
              </button>
            </span>
          </span>
        )}
      </div>

      {isInvalid ? (
        <div className='invalid-feedback' data-testid='amountError'>
          {error}
        </div>
      ) : (
        <AvailableAmountElement />
      )}
    </div>
  );
};

export default SharedAmount;
