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
  const isDisabled = true;

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles.wrapper}>
        <input
          type='text'
          id={ValuesEnum.gasPrice}
          name={ValuesEnum.gasPrice}
          data-testid={ValuesEnum.gasPrice}
          required
          disabled={isDisabled}
          value={gasPrice}
          onChange={onChangeGasPrice}
          onBlur={onBlurGasPrice}
          autoComplete='off'
          className={classNames(globals.input, {
            [globals.invalid]: isGasPriceInvalid,
            [globals.disabled]: isDisabled
          })}
        />

        {showUndoButton && (
          <span
            className={classNames(styles.undo, {
              [styles.disabled]: isDisabled
            })}
          >
            <button onClick={onResetGasPrice} className={styles.reset}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </span>
        )}
      </div>

      {isGasPriceInvalid && (
        <div className={globals.error}>{gasPriceError}</div>
      )}
    </div>
  );
};
