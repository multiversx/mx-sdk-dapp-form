import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types/form';
import styles from './styles.module.scss';

export const Data = () => {
  const {
    fields: {
      data: { label }
    }
  } = useUICustomizationContext();
  const {
    formInfo: { isEgldTransaction, readonly },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const isDisabled =
    !isEgldTransaction || getIsDisabled(ValuesEnum.data, readonly);

  return (
    <div className={styles.fieldData}>
      {label != null && (
        <label htmlFor={ValuesEnum.data} className={styles.fieldDataLabel}>
          {label}
        </label>
      )}

      <div className={styles.fieldDataWrapper}>
        <textarea
          id={ValuesEnum.data}
          name={ValuesEnum.data}
          disabled={isDisabled}
          data-testid={ValuesEnum.data}
          value={data}
          onBlur={onBlur}
          onChange={onChange}
          className={classNames(globals.textarea, {
            [globals.invalid]: isDataInvalid
          })}
        />

        {isDataInvalid && (
          <span className={globals.errorExclamation}>
            <FontAwesomeIcon icon={faExclamation} size='xs' />
          </span>
        )}
      </div>

      {isDataInvalid && (
        <div className={globals.error} data-testid='dataError'>
          {dataError}
        </div>
      )}
    </div>
  );
};
