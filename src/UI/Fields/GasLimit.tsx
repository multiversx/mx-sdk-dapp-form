import React from 'react';
import { faUndo, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import styles from './styles.module.scss';

export const GasLimit = () => {
  const { formInfo, gasInfo } = useSendFormContext();
  const { readonly, hiddenFields } = formInfo;
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

  const isDisabled = getIsDisabled(ValuesEnum.gasLimit, readonly);
  const isHidden =
    hiddenFields?.includes(ValuesEnum.gasLimit) &&
    !gasLimitError &&
    !isGasLimitInvalid;

  return (
    <div className={classNames(styles.gas, { [styles.gasHidden]: isHidden })}>
      <label className={styles.gasLeft} htmlFor={ValuesEnum.gasLimit}>
        Gas Limit
      </label>

      <div className={styles.gasRight}>
        <div
          className={classNames(styles.gasForm, {
            [styles.gasInvalid]: isGasLimitInvalid || gasLimitError
          })}
        >
          <div className={styles.gasWrapper}>
            <input
              type='text'
              id={ValuesEnum.gasLimit}
              name={ValuesEnum.gasLimit}
              data-testid={ValuesEnum.gasLimit}
              disabled={isDisabled}
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
              <span className={styles.gasUndo}>
                <button
                  className={styles.gasReset}
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

        {gasLimitError && <div className={globals.error}>{gasLimitError}</div>}
      </div>
    </div>
  );
};
