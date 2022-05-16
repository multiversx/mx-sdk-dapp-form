import React from 'react';
import classnames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

export const Data = () => {
  const {
    fields: {
      data: { classes: customClasses, label }
    }
  } = useUICustomizationContext();
  const {
    formInfo: { isEgldTransaction },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  return (
    <div className={customClasses.container}>
      <label htmlFor='data' className={customClasses.label}>
        {label}
      </label>
      <textarea
        className={`${customClasses.textarea} ${classnames({
          [customClasses.invalidTextarea as string]: isDataInvalid
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
        <div className={customClasses.errorMsg} data-testid='dataError'>
          {dataError}
        </div>
      )}
    </div>
  );
};

export default Data;
