import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
import {
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WithClassnameType } from '@multiversx/sdk-dapp/UI/types';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import Select from 'react-select';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { useReceiverUsernameContext } from 'contexts/ReceiverUsernameContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { getIsDisabled } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ExtendedValuesType, ValuesEnum } from 'types';

import {
  renderControl,
  renderDropdownIndicator,
  renderInput,
  renderMenu,
  renderMenuList,
  renderOption,
  renderSelectContainer,
  renderValueContainer
} from './components';
import {
  filterOptions,
  formatOptions,
  onReceiverChange,
  onReceiverInputChange,
  setAllReceiverValues
} from './helpers';
import { useReceiverDisplayStates, useReceiverError } from './hooks';
import { GenericOptionType } from './Receiver.types';

export const ReceiverComponent = (
  props: WithClassnameType & WithStylesImportType
) => {
  const receiverSelectReference = useRef(null);

  const { className, globalStyles, styles } = props;
  const { setFieldValue } = useFormikContext<ExtendedValuesType>();

  const {
    receiverInfo: {
      scamError,
      fetchingScamAddress,
      receiverInputValue,
      setReceiverInputValue,
      knownAddresses,
      receiver,
      onBlurReceiver,
      onChangeReceiver
    },
    receiverUsernameInfo: { receiverUsername },
    formInfo: { readonly }
  } = useSendFormContext();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [option, setOption] = useState<GenericOptionType | null>(
    receiver ? { label: receiver, value: receiver } : null
  );

  const { receiverErrorDataTestId, error } = useReceiverError();
  const {
    isAddressError,
    isUsernameError,
    isRequiredError,
    isReceiverDropdownOpened
  } = useReceiverDisplayStates({
    menuIsOpen
  });

  const { usernameAccounts, isUsernameLoading } = useReceiverUsernameContext();

  const onBlur = () => {
    onBlurReceiver(new Event('blur'));

    const foundValueOnBlur = knownAddresses?.find(
      (account) =>
        account.username === receiverInputValue && account.address === receiver
    );

    if (foundValueOnBlur) {
      setFieldValue(ValuesEnum.receiver, foundValueOnBlur.address);
      setFieldValue(ValuesEnum.receiverUsername, foundValueOnBlur.username);
      setFieldValue(
        ValuesEnum.rawReceiverUsername,
        foundValueOnBlur.rawUsername
      );
    }
  };

  const oneOption = knownAddresses?.find(
    (account) =>
      account.username === receiverInputValue && account.address === receiver
  );

  const allOptions = useMemo(
    () => formatOptions(knownAddresses),
    [knownAddresses]
  );

  const options: GenericOptionType[] = oneOption
    ? formatOptions([oneOption])
    : allOptions;

  const setAllValues = setAllReceiverValues({
    setFieldValue,
    setInputValue: setReceiverInputValue,
    setOption,
    options,
    knownAddresses: knownAddresses ?? [],
    usernameAccounts
  });

  const onInputChange = useCallback(
    onReceiverInputChange({ setAllValues, setOption }),
    []
  );

  const changeAndBlurInput = useCallback((value: string) => {
    onChangeReceiver(value ? value.trim() : '');

    // Trigger validation after blur, by instantiating a new Event class and
    // pushing the action at the end of the event loop through setTimeout function.
    setTimeout(onBlur);
  }, []);

  const onChange = onReceiverChange({
    changeAndBlurInput,
    setOption,
    setInputValue: setReceiverInputValue
  });

  const Input = useMemo(
    () => renderInput(receiverSelectReference, styles),
    [receiverSelectReference]
  );

  useEffect(() => {
    if (!receiver) {
      return;
    }

    const username = Object.keys(usernameAccounts).find(
      (key) => usernameAccounts[key]?.address === receiver
    );

    setAllValues(username ?? receiver);

    if (username) {
      setReceiverInputValue(username);
    }
  }, [usernameAccounts, receiver]);

  const isFieldError = isAddressError || isUsernameError || isRequiredError;
  const showErrorText = isFieldError && !menuIsOpen;

  return (
    <div className={classNames(styles?.receiver, className)}>
      <div
        className={globalStyles?.label}
        data-testid={FormDataTestIdsEnum.receiverLabel}
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
        ref={receiverSelectReference}
        inputValue={receiverInputValue}
        onMenuClose={() => setMenuIsOpen(false)}
        onMenuOpen={() => setMenuIsOpen(true)}
        components={{
          Input,
          Menu: renderMenu(styles),
          Control: renderControl(styles),
          ValueContainer: renderValueContainer(styles),
          DropdownIndicator: renderDropdownIndicator(styles),
          SelectContainer: renderSelectContainer(styles),
          MenuList: renderMenuList(styles),
          Option: renderOption(styles),
          Placeholder: () => null,
          SingleValue: () => null,
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null
        }}
        className={classNames(styles?.receiverSelectContainer, {
          [styles?.opened]: isReceiverDropdownOpened,
          [styles?.invalid]: isFieldError || scamError
        })}
      />

      {showErrorText && (
        <div
          data-testid={receiverErrorDataTestId}
          className={globalStyles?.error}
        >
          {error}
        </div>
      )}

      {isUsernameLoading && <div className={styles?.loading}>Loading...</div>}

      {receiverUsername && (
        <span
          className={styles?.found}
          data-testid={FormDataTestIdsEnum.receiverUsernameAddress}
        >
          Account found!{' '}
          <FontAwesomeIcon icon={faCheck} className={styles?.foundIcon} />
        </span>
      )}

      {scamError && (
        <div
          data-testid={FormDataTestIdsEnum.receiverScam}
          className={classNames(globalStyles?.error, globalStyles?.scam)}
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

export const Receiver = withStyles(ReceiverComponent, {
  ssrStyles: () => import('UI/Fields/Receiver/styles.scss'),
  clientStyles: () => require('UI/Fields/Receiver/styles.scss').default
});
