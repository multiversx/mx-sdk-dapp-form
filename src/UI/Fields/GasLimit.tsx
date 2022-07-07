import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

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
      <label className={styles.left} htmlFor='gasLimit'>
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
              id='gasLimit'
              name='gasLimit'
              data-testid='gasLimit'
              required
              value={gasLimit}
              onChange={onChangeGasLimit}
              onBlur={onBlurGasLimit}
              autoComplete='off'
              className={styles.input}
            />

            {isGasLimitInvalid && (
              <span className={styles.exclamation}>
                <FontAwesomeIcon
                  icon={faExclamation}
                  size='xs'
                  className={styles.svg}
                />
              </span>
            )}

            {gasLimit !== defaultGasLimit && !readonly && (
              <span className={styles.undo}>
                <a
                  href='/#'
                  className={styles.reset}
                  onClick={onResetClick}
                  data-testid='gasLimitResetBtn'
                >
                  <i>
                    <FontAwesomeIcon icon={faUndo} />
                  </i>
                </a>
              </span>
            )}
          </div>
        </div>

        {isGasLimitInvalid && (
          <div className={styles.error}>{gasLimitError}</div>
        )}
      </div>
    </div>
  );
};

export default GasLimit;
