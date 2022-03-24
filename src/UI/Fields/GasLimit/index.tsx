import React from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSendFormContext } from 'contexts';

export const GasLimit = () => {
  const { formInfo, gasInfo } = useSendFormContext();
  const { readonly } = formInfo;
  const {
    defaultGasLimit,
    onResetGasLimit,
    onChangeGasLimit,
    onBlurGasLimit,
    gasLimit,
    gasLimitError,
    isGasLimitInvalid
  } = gasInfo;
  const onResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onResetGasLimit();
  };

  return (
    <div className='form-group row mb-0'>
      <label
        className='col-5 col-sm-3 col-form-label text-right'
        htmlFor='gasLimit'
      >
        Gas Limit
      </label>
      <div className='col-7 col-sm-9 pl-0'>
        <div
          className={classNames('input-group input-group-seamless', {
            'is-invalid': isGasLimitInvalid
          })}
        >
          <input
            type='text'
            className={classNames('form-control', {
              'is-invalid': isGasLimitInvalid
            })}
            id='gasLimit'
            name='gasLimit'
            data-testid='gasLimit'
            required
            value={gasLimit}
            onChange={onChangeGasLimit}
            onBlur={onBlurGasLimit}
            autoComplete='off'
          />
          {gasLimit !== defaultGasLimit && !readonly && (
            <span className='input-group-append'>
              <a
                href='/#'
                className='input-group-text'
                onClick={onResetClick}
                data-testid='gasLimitResetBtn'
              >
                <i className='material-icons'>
                  <FontAwesomeIcon icon={faUndo} />
                </i>
              </a>
            </span>
          )}
        </div>
        {isGasLimitInvalid && (
          <div className='invalid-feedback' data-testid='gasLimitError'>
            {gasLimitError}
          </div>
        )}
      </div>
    </div>
  );
};

export default GasLimit;
