import React from 'react';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

export const Data = ({ label }: { label?: string }) => {
  const { formDataField: classes } = useUICustomizationContext();
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
          [classes.invalidTextarea as string]: isDataInvalid
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
