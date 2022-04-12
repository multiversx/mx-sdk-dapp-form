import React from 'react';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { DefaultFormAmountClassesType } from '../Amount';

interface SharedAmountType {
  AvailableAmountElement: () => JSX.Element | null;
  TokenSelector?: React.ReactNode;
  customClasses: DefaultFormAmountClassesType;
  label: string;
}

export const SharedAmount = ({
  AvailableAmountElement,
  TokenSelector,
  customClasses,
  label
}: SharedAmountType) => {
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
  const invalidClassname = classnames({
    [customClasses.invalidInput]: isInvalid
  });

  return (
    <div className='form-group'>
      <label htmlFor='amount'>{label}</label>

      <div className='amount'>
        <div className={customClasses.inputContainer}>
          <input
            type='text'
            className={`${customClasses.input} ${invalidClassname}`}
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
        </div>

        {isMaxButtonVisible && (
          <div className={customClasses.maxBtnContainer}>
            <button
              data-testid='maxBtn'
              className={customClasses.maxBtn}
              onClick={onMaxClicked}
            >
              Max
            </button>
          </div>
        )}

        {TokenSelector}
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
