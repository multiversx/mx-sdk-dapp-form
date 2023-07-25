import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { InputActionMeta, SingleValue } from 'react-select';
import Select from 'react-select/creatable';

import globals from 'assets/sass/globals.module.scss';
import { useUsernameAccount } from 'contexts/ReceiverUsernameContext/utils';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';

import { ExtendedValuesType, ValuesEnum } from 'types';
import { Control } from './components/Control';
import { DropdownIndicator } from './components/DropdownIndicator';
import { IndicatorsContainer } from './components/IndicatorsContainer';
import { Input } from './components/Input';
import { Menu } from './components/Menu';
import { MenuList } from './components/MenuList';
import { Option } from './components/Option';
import { SelectContainer } from './components/SelectContainer';
import { ValueContainer } from './components/ValueContainer';
import { filterOptions, useReceiverError } from './helpers';
import { GenericOptionType } from './Receiver.types';

import styles from './styles.module.scss';

const ms1000 = process.env.NODE_ENV !== 'test' ? 1000 : 1;

export const Receiver = (props: WithClassnameType) => {
  const { className } = props;
  const { setFieldValue } = useFormikContext<ExtendedValuesType>();

  const {
    receiverInfo: {
      scamError,
      fetchingScamAddress,
      knownAddresses,
      receiver,
      onBlurReceiver,
      onChangeReceiver
    },
    formInfo: { readonly }
  } = useSendFormContext();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(receiver);
  const [option, setOption] = useState<GenericOptionType | null>(
    receiver ? { label: receiver, value: receiver } : null
  );
  const debouncedUsername = useDebounce(inputValue, ms1000);
  const { receiverErrorDataTestId, error } = useReceiverError();
  const { usernameAccounts } = useUsernameAccount(debouncedUsername);

  const setAllValues = (value: string) => {
    const optionWithUsername = options.find((option) => option.value === value);
    const optionLabel =
      usernameAccounts[value]?.username ?? optionWithUsername?.label;

    setInputValue(value);
    setOption({ value, label: optionLabel ?? value });

    setFieldValue(
      ValuesEnum.receiver,
      usernameAccounts[value]?.address ?? value
    );

    setFieldValue(
      ValuesEnum.receiverUsername,
      usernameAccounts[value]?.username
    );
  };

  useEffect(() => {
    if (!receiver) {
      return;
    }

    const username = Object.keys(usernameAccounts).find(
      (key) => usernameAccounts[key]?.address === receiver
    );

    setAllValues(username ?? receiver);

    if (username) {
      setInputValue(username);
    }
  }, [usernameAccounts, receiver]);

  const onBlur = () => {
    onBlurReceiver(new Event('blur'));
  };

  const onInputChange = useCallback(
    (inputValue: string, meta: InputActionMeta) => {
      if (!['input-blur', 'menu-close'].includes(meta.action)) {
        // changeAndBlurInput(inputValue);
        setAllValues(inputValue);

        if (!inputValue) {
          setOption(null);
        }
      }
    },
    []
  );

  const options: GenericOptionType[] = useMemo(
    () =>
      knownAddresses
        ? knownAddresses
            .filter((knownAddress) => addressIsValid(knownAddress.address))
            .map((knownAddress) => ({
              value: knownAddress.address,
              label: knownAddress.username ?? knownAddress.address
            }))
        : [],
    [knownAddresses]
  );

  const onChange = (option: SingleValue<GenericOptionType>) => {
    if (option) {
      setOption(option);
      changeAndBlurInput(option.value);

      if (option.value !== option.label) {
        setInputValue(option.label);
      } else {
        setInputValue(option.value);
      }
    }
  };

  const changeAndBlurInput = useCallback((value: string) => {
    onChangeReceiver(value ? value.trim() : '');

    // Trigger validation after blur, by instantiating a new Event class and
    // pushing the action at the end of the event loop through setTimeout function.
    setTimeout(onBlur);
  }, []);

  const foundReceiver = usernameAccounts[inputValue];
  const isUsernameDebouncing =
    inputValue !== debouncedUsername && foundReceiver !== null;

  const searchQueryIsAddress = inputValue.startsWith('erd1');
  const addressIsAmongKnown = Boolean(
    knownAddresses && inputValue
      ? knownAddresses.find((account) => account.address.startsWith(inputValue))
      : false
  );

  const usernameIsAmongKnown = Boolean(
    knownAddresses && inputValue
      ? knownAddresses.find((account) =>
          account.username ? account.username.startsWith(inputValue) : false
        )
      : false
  );

  const isUsernameFetching =
    !isUsernameDebouncing && foundReceiver === undefined;

  const isAddressError =
    searchQueryIsAddress &&
    (!addressIsAmongKnown || !menuIsOpen) &&
    !addressIsValid(inputValue);

  const isUsernameError = [
    !inputValue,
    !debouncedUsername,
    isUsernameDebouncing,
    isUsernameFetching,
    foundReceiver,
    searchQueryIsAddress,
    menuIsOpen && addressIsAmongKnown,
    menuIsOpen && usernameIsAmongKnown
  ].every((condition) => !condition);

  const isUsernameLoading = Boolean(
    inputValue &&
      !searchQueryIsAddress &&
      isUsernameFetching &&
      !usernameIsAmongKnown
  );

  return (
    <div className={classNames(styles.receiver, className)}>
      <div
        className={globals.label}
        data-testid='receiverLabel'
        data-loading={fetchingScamAddress}
      >
        Receiver
      </div>

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
        onMenuClose={() => setMenuIsOpen(false)}
        onMenuOpen={() => setMenuIsOpen(true)}
        components={{
          Menu,
          Input,
          Control,
          ValueContainer,
          DropdownIndicator,
          SelectContainer,
          IndicatorsContainer,
          MenuList,
          Option,
          Placeholder: () => null,
          SingleValue: () => null,
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null
        }}
        className={classNames(styles.receiverSelectContainer, {
          [styles.invalid]: isAddressError || isUsernameError || scamError
        })}
      />

      {isUsernameLoading && <div className={styles.loading}>Loading...</div>}

      {foundReceiver && (
        <span className={styles.found} data-testid='receiverUsernameAddress'>
          Account found!{' '}
          <FontAwesomeIcon icon={faCheck} className={styles.foundIcon} />
        </span>
      )}

      {(isAddressError || isUsernameError) && (
        <div data-testid={receiverErrorDataTestId} className={globals.error}>
          {error}
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
