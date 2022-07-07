import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { denominatedConfigGasPrice } from 'operations';

import styles from './styles.module.scss';

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
              className={styles.input}
            />

            {isGasPriceInvalid && (
              <span className={styles.exclamation}>
                <FontAwesomeIcon
                  icon={faExclamation}
                  size='xs'
                  className={styles.svg}
                />
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
          <div className={styles.error}>{gasPriceError}</div>
        )}
      </div>
    </div>
  );
};

export default GasPrice;
