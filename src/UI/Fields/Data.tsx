import React from 'react';
import { useSendFormContext } from 'contexts';
import classnames from 'optionalPackages/classnames';

export const Data = () => {
  const {
    formInfo: { isEgldTransaction },
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  return (
    <div className='form-group mb-0'>
      <label htmlFor='data' className='pb-1'>
        Data
      </label>
      <textarea
        className={`form-control ${classnames({
          'is-invalid': isDataInvalid
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
        <div className='invalid-feedback' data-testid='dataError'>
          {dataError}
        </div>
      )}
    </div>
  );
};

export default Data;
