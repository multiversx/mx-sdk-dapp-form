import React, { MouseEvent, useRef, useState } from 'react';
import {
  faCheck,
  faPencil,
  faUndo,
  faX
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { formattedConfigGasPrice } from 'operations';
import { ValuesEnum } from 'types';

import { hasLeadingZeroes } from './AmountSelect/components/AmountInput/helpers';
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

  const [isEditable, setIsEditable] = useState(false);
  const [isEditableConfirmed, setIsEditableConfirmed] = useState(false);

  const gasInputReference = useRef<HTMLInputElement>(null);
  const showUndoButton = gasPrice !== formattedConfigGasPrice && !readonly;

  const isAllowed = ({ value, floatValue }: NumberFormatValues) => {
    const defaultConditions = !floatValue || !BigNumber(floatValue).isNaN();
    return defaultConditions && !hasLeadingZeroes(value);
  };

  const handleEnableEditable = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsEditable(true);
  };

  const handlePreventEditable = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsEditable(false);
  };

  const handleConfirmEditable = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsEditableConfirmed(true);

    // The timeout is necessary because it has to wait for a minimum amount of time for the state to update before focusing.
    setTimeout(() => {
      if (gasInputReference.current) {
        gasInputReference.current.focus();
      }
    });
  };

  const handleResetEditable = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsEditable(false);
    setIsEditableConfirmed(false);
    onResetGasPrice();
  };

  return (
    <div className={styles.gas}>
      <label className={globals.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles.wrapper}>
        <NumericFormat
          allowedDecimalSeparators={['.', ',']}
          autoComplete='off'
          data-testid={ValuesEnum.gasPrice}
          decimalSeparator='.'
          disabled={Boolean(readonly || !isEditableConfirmed)}
          id={ValuesEnum.gasPrice}
          inputMode='decimal'
          isAllowed={isAllowed}
          name={ValuesEnum.gasPrice}
          onBlur={onBlurGasPrice}
          getInputRef={gasInputReference}
          onChange={(e) => onChangeGasPrice(e, true)}
          required
          thousandSeparator=','
          thousandsGroupStyle='thousand'
          value={gasPrice}
          valueIsNumericString
          allowNegative={false}
          className={classNames(globals.input, {
            [globals.invalid]: isGasPriceInvalid,
            [globals.disabled]: !isEditable || !isEditableConfirmed
          })}
        />

        {!readonly && (
          <div className={styles.actions}>
            {!isEditableConfirmed && (
              <div
                className={styles.action}
                onClick={
                  isEditable ? handleConfirmEditable : handleEnableEditable
                }
              >
                <FontAwesomeIcon
                  className={styles.icon}
                  icon={isEditable ? faCheck : faPencil}
                />
              </div>
            )}

            {isEditable && !isEditableConfirmed && (
              <div className={styles.action} onClick={handlePreventEditable}>
                <FontAwesomeIcon className={styles.icon} icon={faX} />
              </div>
            )}

            {showUndoButton && (
              <div className={styles.action} onClick={handleResetEditable}>
                <FontAwesomeIcon className={styles.icon} icon={faUndo} />
              </div>
            )}
          </div>
        )}
      </div>

      {isGasPriceInvalid && (
        <div className={globals.error}>{gasPriceError}</div>
      )}
    </div>
  );
};
