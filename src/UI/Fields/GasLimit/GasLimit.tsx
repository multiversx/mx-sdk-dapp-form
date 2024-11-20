import React, { MouseEvent } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import {
  NumberFormatValues,
  NumericFormat,
  OnValueChange
} from 'react-number-format';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import { hasLeadingZeroes } from '../AmountSelect/components/AmountInput/helpers';
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

  const handleResetGasLimit = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onResetGasLimit();
  };

  const isAllowed = ({ value, floatValue }: NumberFormatValues) => {
    const defaultConditions = !floatValue || !BigNumber(floatValue).isNaN();
    return defaultConditions && !hasLeadingZeroes(value);
  };

  const handleValueChange: OnValueChange = (event) => {
    onChangeGasLimit(event.value, true);
  };

  const showUndoButton = gasLimit !== defaultGasLimit && !readonly;
  const isDisabled = getIsDisabled(ValuesEnum.gasLimit, readonly);

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasLimit}>
        Gas Limit
      </label>

      <div className={styles.wrapper}>
        <NumericFormat
          allowedDecimalSeparators={['.', ',']}
          autoComplete='off'
          data-testid={ValuesEnum.gasLimit}
          decimalSeparator='.'
          disabled={isDisabled}
          id={ValuesEnum.gasLimit}
          inputMode='decimal'
          name={ValuesEnum.gasLimit}
          onBlur={onBlurGasLimit}
          onValueChange={handleValueChange}
          required
          isAllowed={isAllowed}
          thousandSeparator=','
          thousandsGroupStyle='thousand'
          value={gasLimit}
          valueIsNumericString
          allowNegative={false}
          className={classNames(globals.input, styles.input, {
            [globals.disabled]: isDisabled,
            [globals.invalid]: isGasLimitInvalid,
            [styles.spaced]: showUndoButton
          })}
        />

        {showUndoButton && (
          <div className={styles.actions}>
            <div
              onClick={handleResetGasLimit}
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
