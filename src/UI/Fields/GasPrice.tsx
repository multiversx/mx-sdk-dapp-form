import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { denominatedConfigGasPrice } from 'operations';

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

  const { readonly, hiddenFields } = formInfo;
  const showUndoButton = gasPrice !== denominatedConfigGasPrice && !readonly;

  const isHidden =
    hiddenFields?.includes(ValuesEnum.gasLimit) &&
    !gasPriceError &&
    !isGasPriceInvalid;

  return (
    <div
      className={classNames(styles.gas, styles.gasPrice, {
        [styles.gasHidden]: isHidden
      })}
    >
      <label className={styles.gasLeft} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles.gasRight}>
        <div
          className={classNames(styles.gasForm, {
            [styles.gasInvalid]: isGasPriceInvalid || gasPriceError
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
              className={globals.input}
            />

            {isGasPriceInvalid && (
              <span className={globals.errorExclamation}>
                <FontAwesomeIcon icon={faExclamation} size='xs' />
              </span>
            )}
          </div>

          {showUndoButton && (
            <span className={styles.gasUndo}>
              <button
                className={classNames(styles.gasReset, styles.default)}
                onClick={onResetGasPrice}
              >
                <i>
                  <FontAwesomeIcon icon={faUndo} />
                </i>
              </button>
            </span>
          )}
        </div>

        {gasPriceError && <div className={globals.error}>{gasPriceError}</div>}
      </div>
    </div>
  );
};
