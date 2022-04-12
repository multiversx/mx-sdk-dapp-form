import React from 'react';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

export type DefaultFormDataClassesType = {
  container: string;
  label: string;
  textarea: string;
  invalidTextarea: string;
  errorMsg: string;
};
export const defaultFormDataClasses = {
  container: 'form-group mb-0',
  label: 'pb-1',
  textarea: 'form-control',
  invalidTextarea: 'is-invalid',
  errorMsg: 'invalid-feedback'
};

export const Data = ({
  label,
  customClasses
}: {
  label?: string;
  customClasses?: DefaultFormDataClassesType;
}) => {
  const classes = customClasses || defaultFormDataClasses;
  const {
    formInfo: { isEgldTransaction },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  return (
    <div className={classes.container}>
      <label htmlFor='data' className={classes.label}>
        {label}
      </label>
      <textarea
        className={`${classes.textarea} ${classnames({
          [classes.invalidTextarea]: isDataInvalid
        })}`}
        id='data'
        name='data'
        disabled={!isEgldTransaction}
        data-testid='data'
        value={data}
        onBlur={onBlur}
        onChange={onChange}
      />

      {isDataInvalid && (
        <div className={classes.errorMsg} data-testid='dataError'>
          {dataError}
        </div>
      )}
    </div>
  );
};

export default Data;
