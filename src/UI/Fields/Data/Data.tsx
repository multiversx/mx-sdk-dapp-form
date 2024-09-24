import React from 'react';

import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ValuesEnum, WithClassnameType } from 'types';

import amountSelectStyles from '../AmountSelect/amountSelect.module.scss';

import { AdvancedMode } from './components';
import { useIsDataDisabled } from './hooks';
import styles from './styles.module.scss';

export const Data = ({ className }: WithClassnameType) => {
  const {
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const isDisabled = useIsDataDisabled();

  return (
    <div className={classNames(styles.data, className)}>
      <div className={amountSelectStyles.label}>
        <label htmlFor={ValuesEnum.data} className={globals.label}>
          Data
        </label>
        <AdvancedMode />
      </div>
      <div className={styles.wrapper}>
        <textarea
          rows={1}
          id={ValuesEnum.data}
          name={ValuesEnum.data}
          disabled={isDisabled}
          data-testid={ValuesEnum.data}
          value={data}
          onBlur={onBlur}
          onChange={onChange}
          spellCheck='false'
          placeholder='Add transaction data'
          className={classNames(globals.textarea, {
            [globals.invalid]: isDataInvalid,
            [globals.disabled]: isDisabled
          })}
        />
      </div>
      {isDataInvalid && (
        <div
          className={globals.error}
          data-testid={FormDataTestIdsEnum.dataError}
        >
          {dataError}
        </div>
      )}
    </div>
  );
};
