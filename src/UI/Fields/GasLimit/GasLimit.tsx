import React, { MouseEvent } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import styles from './../styles.module.scss';

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

  const onResetGasPrice = (event: MouseEvent) => {
    event.preventDefault();
    onResetGasLimit();
  };

  const showUndoButton = gasLimit !== defaultGasLimit && !readonly;
  const isDisabled = getIsDisabled(ValuesEnum.gasLimit, readonly);

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasLimit}>
        Gas Limit
      </label>

      <div className={styles.wrapper}>
        <input
          autoComplete='off'
          className={classNames(globals.input, {
            [globals.disabled]: isDisabled,
            [globals.invalid]: isGasLimitInvalid
          })}
          data-testid={ValuesEnum.gasLimit}
          disabled={isDisabled}
          id={ValuesEnum.gasLimit}
          name={ValuesEnum.gasLimit}
          onBlur={onBlurGasLimit}
          onChange={onChangeGasLimit}
          required
          type='text'
          value={gasLimit}
        />

        {showUndoButton && (
          <div className={styles.actions}>
            <div
              onClick={onResetGasPrice}
              data-testid={FormDataTestIdsEnum.gasLimitResetBtn}
              className={classNames(styles.action, {
                [styles.disabled]: isDisabled
              })}
            >
              <FontAwesomeIcon icon={faUndo} className={styles.icon} />
            </div>
          </div>
        )}

        {isGasLimitInvalid && (
          <div
            className={globals.error}
            data-testid={`${ValuesEnum.gasLimit}Error`}
          >
            {gasLimitError}
          </div>
        )}
      </div>
    </div>
  );
};
