import React, { useState, useEffect, useCallback } from 'react';

import { addressIsValid } from '@elrondnetwork/dapp-core/utils/account/addressIsValid';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Typeahead, Menu, MenuItem, Hint } from 'react-bootstrap-typeahead';
import { MenuProps } from 'react-bootstrap-typeahead/types/components/Menu';
import {
  FilterByCallback,
  Option,
  TypeaheadManagerChildProps
} from 'react-bootstrap-typeahead/types/types';

import globals from 'assets/sass/globals.module.scss';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import { getIsDisabled } from 'helpers';
import { ValuesEnum } from 'types';
import styles from './styles.module.scss';

const CustomMenu = (
  results: Array<Option>,
  props: MenuProps,
  state: TypeaheadManagerChildProps
) => {
  const {
    // remove unused props which are not recognized by react
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderMenuItemChildren,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newSelectionPrefix,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paginationText,
    ...menuProps
  } = props as any;

  return (
    <Menu {...menuProps} className={styles.toFieldMenu}>
      {results.map((option: Option, position: number) => (
        <MenuItem
          key={option.toString()}
          {...{
            option,
            position,
            className: classNames(styles.toFieldItem, {
              [styles.highlighted]: position === state.activeIndex
            })
          }}
        >
          {option.toString()}
        </MenuItem>
      ))}
    </Menu>
  );
};

export const To = () => {
  const {
    fields: {
      to: { label }
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

  const [value, setValue] = useState(receiver);
  const [key, setKey] = useState('');

  const onBlur = () => onBlurReceiver(new Event('blur'));

  const changeAndBlurInput = useCallback((value: string) => {
    onChangeReceiver(value ? value.trim() : '');

    // Trigger validation after blur, by instantiating a new Event class and
    // pushing the action at the end of the event loop through setTimeout function.
    setTimeout(onBlur);
  }, []);

  const onInputChange = (value: string) => {
    changeAndBlurInput(value);
    setValue(value);
  };

  const onChange = ([option]: Array<Option>) => {
    if (option) {
      setValue(option.toString());
      changeAndBlurInput(option.toString());
    }
  };

  const triggerRerenderOnceOnHook = () => {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  };

  const renderInput = ({
    inputRef,
    referenceElementRef,
    ...inputProps
  }: any) => (
    <Hint>
      <input
        {...inputProps}
        data-testid='destinationAddress'
        ref={(node: any) => {
          inputRef(node);
          referenceElementRef(node);
        }}
      />
    </Hint>
  );

  const filterBy: FilterByCallback = (option, props) =>
    option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 &&
    props.text.length > 2;

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  return (
    <div className={styles.toField}>
      {label !== null && (
        <div
          className={styles.toFieldLabel}
          data-testid='receiverLabel'
          data-loading={fetchingScamAddress}
        >
          {label}
        </div>
      )}

      <div className={styles.toFieldAutocomplete}>
        <Typeahead
          id='receiverWrapper'
          filterBy={filterBy}
          disabled={getIsDisabled(ValuesEnum.receiver, readonly)}
          ignoreDiacritics={true}
          emptyLabel={false}
          maxResults={5}
          caseSensitive={false}
          defaultInputValue={value}
          options={knownAddresses}
          onChange={onChange}
          onBlur={onBlur}
          renderInput={renderInput}
          onInputChange={onInputChange}
          renderMenu={CustomMenu}
          inputProps={{ className: globals.input }}
        />
      </div>

      {isReceiverInvalid && (
        <div data-testid='receiverError' className={globals.error}>
          {receiverError}
        </div>
      )}

      {scamError && (
        <div data-testid='receiverScam' className={styles.toFieldScam}>
          <span>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};
