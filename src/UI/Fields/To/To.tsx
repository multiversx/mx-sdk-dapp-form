import React, { useState, useEffect, useCallback } from 'react';

import { addressIsValid } from '@elrondnetwork/dapp-core/utils';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import { MenuProps } from 'react-bootstrap-typeahead/types/components/Menu';
import {
  FilterByCallback,
  Option,
  TypeaheadManagerChildProps
} from 'react-bootstrap-typeahead/types/types';

import classNames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';
import globals from 'assets/sass/globals.module.scss';

const CustomMenu = (
  results: Array<Option>,
  props: MenuProps,
  state: TypeaheadManagerChildProps
) => (
  <Menu {...props} className={styles.menu}>
    {results.map((option: Option, position: number) => (
      <MenuItem
        {...{
          option,
          position,
          className: classNames(styles.item, {
            [styles.highlighted]: position === state.activeIndex
          })
        }}
      >
        {option.toString()}
      </MenuItem>
    ))}
  </Menu>
);

const To = () => {
  const {
    fields: {
      to: { label }
    }
  } = useUICustomizationContext();

  const {
    receiverInfo: {
      scamError,
      knownAddresses,
      receiverError,
      receiver,
      isReceiverInvalid,
      onBlurReceiver,
      onChangeReceiver
    }
  } = useSendFormContext();

  const [value, setValue] = useState(receiver);
  const [key, setKey] = useState('');

  const changeAndBlurInput = useCallback((value: string) => {
    onChangeReceiver(value ? value.trim() : '');

    // Trigger validation after blur, by instantiating a new Event class and
    // skipping the event loop through the setTimeout function.
    setTimeout(() => onBlurReceiver(new Event('blur')));
  }, []);

  const onInputChange = (value: string) => {
    changeAndBlurInput(value);
    setValue(value);
  };

  const onChange = ([option]: Array<Option>) => {
    setValue(option.toString());
    changeAndBlurInput(option.toString());
  };

  const triggerRerenderOnceOnHook = () => {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  };

  const filterBy: FilterByCallback = (option, props) =>
    option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 &&
    props.text.length > 2;

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  return (
    <div className={styles.to}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.autocomplete}>
        <Typeahead
          id='receiverWrapper'
          filterBy={filterBy}
          ignoreDiacritics={true}
          emptyLabel={false}
          maxResults={5}
          caseSensitive={false}
          defaultInputValue={value}
          options={knownAddresses}
          onChange={onChange}
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
        <div data-testid='receiverScam' className={styles.scam}>
          <span>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};

export { To };
