import React, { useEffect, useState } from 'react';

import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ValuesEnum } from 'types/form';
import amountSelectStyles from '../AmountSelect/amountSelect.module.scss';

import { AdvancedMode } from './components';
import { useIsDataDisabled } from './hooks';
import styles from './styles.module.scss';
import { DecodeMethodEnum } from '@multiversx/sdk-dapp/types';
import { decodeForDisplay } from '@multiversx/sdk-dapp/utils/transactions/transactionInfoHelpers/decodeForDisplay';

import Select, { components, SingleValue } from 'react-select';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';

const ListOption = (props: any) => {
  return (
    <div
      className={`token-option ${props.isSelected ? 'is-selected' : ''}`}
      data-testid={`${props.value}-option`}
    >
      <components.Option {...props} />
    </div>
  );
};

export const Data = ({ className }: WithClassnameType) => {
  const {
    dataFieldInfo: { data, dataError, isDataInvalid, onChange, onBlur }
  } = useSendFormContext();

  const isDisabled = useIsDataDisabled();
  const [activeKey, setActiveKey] = useState(DecodeMethodEnum.raw);
  const [displayValue, setDisplayValue] = useState('');
  const [validationWarnings, setValidationWarnings] = useState<any>([]);

  const handleSelect = (event: SingleValue<DecodeMethodEnum>) => {
    if (event) {
      setActiveKey(event);
    }
  };

  useEffect(() => {
    const { displayValue, validationWarnings } = decodeForDisplay({
      input: data,
      decodeMethod: activeKey as DecodeMethodEnum
    });

    setDisplayValue(displayValue);
    setValidationWarnings(validationWarnings);
  }, [activeKey, data]);

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
          value={displayValue}
          onBlur={onBlur}
          onChange={onChange}
          spellCheck='false'
          placeholder='Add transaction data'
          className={classNames(globals.textarea, {
            [globals.invalid]: isDataInvalid,
            [globals.disabled]: isDisabled
          })}
        />
        <CopyButton text={displayValue} className='copy-button' />
        <Select
          className='data-decode-select'
          components={{ Option: ListOption }}
          onChange={handleSelect}
          openMenuOnFocus
          options={Object.values(DecodeMethodEnum)}
          value={activeKey}
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
      {validationWarnings.map((warning: string, i: number) => (
        <div
          key={i}
          className={globals.error}
          data-testid={FormDataTestIdsEnum.dataError}
        >
          {warning}
        </div>
      ))}
    </div>
  );
};
