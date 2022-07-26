import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { GAS_LIMIT_FIELD } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import styles from './styles.module.scss';

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
    <div className={styles.gas}>
      <label className={styles.left} htmlFor={GAS_LIMIT_FIELD}>
        Gas Limit
      </label>

      <div className={styles.right}>
        <div
          className={classNames(styles.form, {
            [styles.invalid]: isGasLimitInvalid
          })}
        >
          <div className={styles.wrapper}>
            <input
              type='text'
              id={GAS_LIMIT_FIELD}
              name={GAS_LIMIT_FIELD}
              data-testid={GAS_LIMIT_FIELD}
              required
              value={gasLimit}
              onChange={onChangeGasLimit}
              onBlur={onBlurGasLimit}
              autoComplete='off'
              className={globals.input}
            />

            {isGasLimitInvalid && (
              <span className={globals.errorExclamation}>
                <FontAwesomeIcon icon={faExclamation} size='xs' />
              </span>
            )}

            {gasLimit !== defaultGasLimit && !readonly && (
              <span className={styles.undo}>
                <button
                  className={styles.reset}
                  onClick={onResetClick}
                  data-testid='gasLimitResetBtn'
                >
                  <i>
                    <FontAwesomeIcon icon={faUndo} />
                  </i>
                </button>
              </span>
            )}
          </div>
        </div>

        {isGasLimitInvalid && (
          <div className={globals.error}>{gasLimitError}</div>
        )}
      </div>
    </div>
  );
};
