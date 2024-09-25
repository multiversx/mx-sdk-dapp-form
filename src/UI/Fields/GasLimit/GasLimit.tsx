import React, { MouseEvent } from 'react';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ValuesEnum } from 'types';

export const GasLimitComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
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
    <div className={styles?.gas}>
      <label className={globalStyles?.label} htmlFor={ValuesEnum.gasLimit}>
        Gas Limit
      </label>

      <div className={styles?.wrapper}>
        <input
          autoComplete='off'
          className={classNames(globalStyles?.input, {
            [globalStyles?.disabled]: isDisabled,
            [globalStyles?.invalid]: isGasLimitInvalid
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
          <span
            className={classNames(styles?.undo, {
              [styles?.disabled]: isDisabled
            })}
          >
            <button
              onClick={onResetGasPrice}
              data-testid={FormDataTestIdsEnum.gasLimitResetBtn}
              className={styles?.reset}
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </span>
        )}

        {isGasLimitInvalid && (
          <div
            className={globalStyles?.error}
            data-testid={`${ValuesEnum.gasLimit}Error`}
          >
            {gasLimitError}
          </div>
        )}
      </div>
    </div>
  );
};

export const GasLimit = withStyles(GasLimitComponent, {
  ssrStyles: () => import('UI/Fields/styles.scss'),
  clientStyles: () => require('UI/Fields/styles.scss').default
});
