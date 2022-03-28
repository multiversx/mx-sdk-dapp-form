import React from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { denominatedConfigGasPrice } from 'operations';

const GasPrice = () => {
  const { gasInfo, formInfo } = useSendFormContext();

  const {
    gasPrice,
    gasPriceError,
    isGasPriceInvalid,
    onChangeGasPrice,
    onBlurGasPrice,
    onResetGasPrice
  } = gasInfo;
  const { readonly } = formInfo;

  const invalidClassName = classnames({ 'is-invalid': isGasPriceInvalid });

  const showUndoButton = gasPrice !== denominatedConfigGasPrice && !readonly;

  return (
    <div className='form-group row'>
      <label className='col-5 col-sm-3 pl-0 col-form-label text-right'>
        Gas Price
      </label>
      <div className='col-7 col-sm-9 pl-0'>
        <div className={`input-group input-group-seamless ${invalidClassName}`}>
          <input
            type='text'
            className={`form-control ${invalidClassName}`}
            id='gasPrice'
            name='gasPrice'
            data-testid='gasPrice'
            required
            disabled
            value={gasPrice}
            onChange={onChangeGasPrice}
            onBlur={onBlurGasPrice}
            autoComplete='off'
          />
          {showUndoButton && (
            <span className='input-group-append'>
              <a
                href='/#'
                className='input-group-text'
                onClick={onResetGasPrice}
              >
                <i className='material-icons'>
                  <FontAwesomeIcon icon={faUndo} />
                </i>
              </a>
            </span>
          )}
        </div>
        {isGasPriceInvalid && (
          <div className='invalid-feedback'>{gasPriceError}</div>
        )}
      </div>
    </div>
  );
};

export default GasPrice;
