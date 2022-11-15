import React from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { formattedConfigGasPrice } from 'operations';

import { ValuesEnum } from 'types';
import styles from './styles.module.scss';

export const GasPrice = () => {
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
  const showUndoButton = gasPrice !== formattedConfigGasPrice && !readonly;

  return (
    <div className={classNames(styles.gas, styles.gasPrice)}>
      <label className={styles.gasLeft} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles.gasRight}>
        <div
          className={classNames(styles.gasForm, {
            [styles.gasInvalid]: isGasPriceInvalid
          })}
        >
          <div className={styles.gasWrapper}>
            <input
              type='text'
              id={ValuesEnum.gasPrice}
              name={ValuesEnum.gasPrice}
              data-testid={ValuesEnum.gasPrice}
              required
              disabled
              value={gasPrice}
              onChange={onChangeGasPrice}
              onBlur={onBlurGasPrice}
              autoComplete='off'
              className={classNames(globals.input, {
                [globals.invalid]: isGasPriceInvalid
              })}
            />
          </div>

          {showUndoButton && (
            <span className={styles.gasUndo}>
              <button
                onClick={onResetGasPrice}
                className={classNames(styles.gasReset, styles.default, {
                  [styles.invalid]: isGasPriceInvalid
                })}
              >
                <i>
                  <FontAwesomeIcon icon={faUndo} />
                </i>
              </button>
            </span>
          )}
        </div>

        {isGasPriceInvalid && (
          <div className={classNames(globals.error, styles.gasError)}>
            {gasPriceError}
          </div>
        )}
      </div>
    </div>
  );
};
