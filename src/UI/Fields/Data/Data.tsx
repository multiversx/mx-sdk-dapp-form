import React from 'react';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types/form';

import styles from './styles.module.scss';

export const Data = ({ className }: WithClassnameType) => {
  const {
    formInfo: { isEgldTransaction, readonly },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const isDisabled =
    !isEgldTransaction || getIsDisabled(ValuesEnum.data, readonly);

  return (
    <div className={classNames(styles.data, className)}>
      <label htmlFor={ValuesEnum.data} className={globals.label}>
        Data
      </label>

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
