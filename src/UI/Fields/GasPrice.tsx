import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { denominatedConfigGasPrice } from 'operations';

import styles from './styles.module.scss';
import globals from 'assets/sass/globals.module.scss';

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
  const showUndoButton = gasPrice !== denominatedConfigGasPrice && !readonly;

  return (
    <div className={classNames(styles.gas, styles.price)}>
      <label className={styles.left} htmlFor='gasPrice'>
        Gas Price
      </label>

      <div className={styles.right}>
        <div
          className={classNames(styles.form, {
            [styles.invalid]: isGasPriceInvalid
          })}
        >
          <div className={styles.wrapper}>
            <input
              type='text'
              id='gasPrice'
              name='gasPrice'
              data-testid='gasPrice'
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
            <span className={styles.undo}>
              <a
                href='/#'
                className={classNames(styles.reset, styles.default)}
                onClick={onResetGasPrice}
              >
                <i>
                  <FontAwesomeIcon icon={faUndo} />
                </i>
              </a>
            </span>
          )}
        </div>

        {isGasPriceInvalid && (
          <div className={globals.error}>{gasPriceError}</div>
        )}
      </div>
    </div>
  );
};

export { GasPrice };
