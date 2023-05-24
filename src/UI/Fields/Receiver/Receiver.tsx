import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import classNames from 'classnames';
import { InputActionMeta, SingleValue } from 'react-select';
import Select from 'react-select/creatable';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import { Control } from './components/Control';
import { DropdownIndicator } from './components/DropdownIndicator';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { MenuList } from './components/MenuList';
import { Option } from './components/Option';
import { SelectContainer } from './components/SelectContainer';
import { ValueContainer } from './components/ValueContainer';

import { filterOptions } from './helpers';
import { GenericOptionType } from './Receiver.types';
import styles from './styles.module.scss';

export const Receiver = (props: WithClassnameType) => {
  const { className } = props;
  const {
    fields: {
      receiver: { label }
    }
  } = useUICustomizationContext();

  const {
    receiverInfo: {
      scamError,
      fetchingScamAddress,
      knownAddresses,
      receiverError,
      receiver,
      isReceiverInvalid,
      onBlurReceiver,
      onChangeReceiver
    },
    formInfo: { readonly }
  } = useSendFormContext();

  const [key, setKey] = useState('');
  const [inputValue, setInputValue] = useState(receiver);
  const [option, setOption] = useState<GenericOptionType | null>(
    receiver ? { label: receiver, value: receiver } : null
  );

  const triggerRerenderOnceOnHook = () => {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  };

  const onBlur = () => onBlurReceiver(new Event('blur'));

  const onInputChange = useCallback(
    (inputValue: string, meta: InputActionMeta) => {
      if (!['input-blur', 'menu-close'].includes(meta.action)) {
        changeAndBlurInput(inputValue);
        setInputValue(inputValue);
        setOption({
          value: inputValue,
          label: inputValue
        });

        if (!inputValue) {
          setOption(null);
        }
      }
    },
    []
  );

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  const options: GenericOptionType[] = useMemo(
    () =>
      knownAddresses
        ? knownAddresses.map((address) => ({
            value: address,
            label: address
          }))
        : [],
    [knownAddresses]
  );

  const onChange = (option: SingleValue<GenericOptionType>) => {
    if (option) {
      setOption(option);
      setInputValue(option.value);
      changeAndBlurInput(option.value);
    }
  };

  const changeAndBlurInput = useCallback((value: string) => {
    onChangeReceiver(value ? value.trim() : '');

    // Trigger validation after blur, by instantiating a new Event class and
    // pushing the action at the end of the event loop through setTimeout function.
    setTimeout(onBlur);
  }, []);

  return (
    <div className={classNames(styles.receiver, className)}>
      {label !== null && (
        <div
          className={globals.label}
          data-testid='receiverLabel'
          data-loading={fetchingScamAddress}
        >
          {label}
        </div>
      )}

      <Select
        value={option}
        onInputChange={onInputChange}
        inputId='receiverWrapper'
        maxMenuHeight={160}
        openMenuOnFocus
        isDisabled={getIsDisabled(ValuesEnum.receiver, readonly)}
        options={options}
        filterOption={filterOptions}
        noOptionsMessage={() => null}
        onChange={onChange}
        onBlur={onBlur}
        isLoading={knownAddresses === null}
        isMulti={false}
        inputValue={inputValue}
        className={classNames(styles.receiverSelectContainer, {
          [styles.invalid]: isReceiverInvalid || scamError
        })}
        components={{
          Menu,
          Input,
          Control,
          ValueContainer,
          DropdownIndicator,
          SelectContainer,
          MenuList,
          Option,
          Placeholder: () => null,
          SingleValue: () => null,
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null
        }}
      />

      {isReceiverInvalid && (
        <div data-testid='receiverError' className={globals.error}>
          {receiverError}
        </div>
      )}

      {scamError && (
        <div
          data-testid='receiverScam'
          className={classNames(globals.error, globals.scam)}
        >
          <span>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};
