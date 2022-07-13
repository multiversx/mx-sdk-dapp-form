import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';
import globals from 'assets/sass/globals.module.scss';

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

  const DATA = 'data';

  return (
    <div className={styles.data}>
      {label && (
        <label htmlFor={DATA} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <textarea
          id={DATA}
          name={DATA}
          disabled={!isEgldTransaction}
          data-testid={DATA}
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
