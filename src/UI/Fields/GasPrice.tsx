import React from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { formattedConfigGasPrice } from 'operations';
import { ValuesEnum } from 'types';

export const GasPriceComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
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
    <div className={styles?.gas}>
      <label className={globalStyles?.label} htmlFor={ValuesEnum.gasPrice}>
        Gas Price
      </label>

      <div className={styles?.wrapper}>
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
          className={classNames(globalStyles?.input, {
            [globalStyles?.invalid]: isGasPriceInvalid,
            [globalStyles?.disabled]: isDisabled
          })}
        />

        {showUndoButton && (
          <span
            className={classNames(styles?.undo, {
              [styles?.disabled]: isDisabled
            })}
          >
            <button onClick={onResetGasPrice} className={styles?.reset}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </span>
        )}
      </div>

      {isGasPriceInvalid && (
        <div className={globalStyles?.error}>{gasPriceError}</div>
      )}
    </div>
  );
};

export const GasPrice = withStyles(GasPriceComponent, {
  ssrStyles: () => import('UI/Fields/styles.scss'),
  clientStyles: () => require('UI/Fields/styles.scss').default
});
