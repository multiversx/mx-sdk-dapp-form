import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useFormikContext } from 'formik';
import globals from 'assets/sass/globals.module.scss';
import { DATA_FIELD } from 'constants/index';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { ExtendedValuesType } from 'types/form';
import styles from './styles.module.scss';

const Data = () => {
  const {
    fields: {
      data: { label }
    }
  } = useUICustomizationContext();
  const {
    formInfo: { isEgldTransaction },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const {
    values: { customBalanceRules }
  } = useFormikContext<ExtendedValuesType>();

  const disabled = Boolean(
    !isEgldTransaction || customBalanceRules?.dataFieldBuilder != null
  );

  return (
    <div className={styles.data}>
      {label && (
        <label htmlFor={DATA_FIELD} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <textarea
          id={DATA_FIELD}
          name={DATA_FIELD}
          disabled={disabled}
          data-testid={DATA_FIELD}
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

export { Data };
