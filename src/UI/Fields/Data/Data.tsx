import React from 'react';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';

export const Data = () => {
  const {
    fields: {
      data: { label }
    }
  } = useUICustomizationContext();
  const {
    formInfo: { isEgldTransaction },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  return (
    <div className={styles.data}>
      {label && (
        <label htmlFor='data' className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <textarea
          id='data'
          name='data'
          disabled={!isEgldTransaction}
          data-testid='data'
          value={data}
          onBlur={onBlur}
          onChange={onChange}
          className={classNames(styles.textarea, {
            [styles.invalid]: isDataInvalid
          })}
        />

        {isDataInvalid && (
          <span className={styles.exclamation}>
            <FontAwesomeIcon
              icon={faExclamation}
              size='xs'
              className={styles.svg}
            />
          </span>
        )}
      </div>

      {isDataInvalid && (
        <div className={styles.error} data-testid='dataError'>
          {dataError}
        </div>
      )}
    </div>
  );
};

export default Data;
