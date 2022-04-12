import React, { useEffect, useState } from 'react';
import { addressIsValid } from '@elrondnetwork/dapp-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import {
  Typeahead,
  Menu,
  MenuItem,
  Hint,
  TypeaheadResult,
  TypeaheadMenuProps
} from 'react-bootstrap-typeahead';
import { useSendFormContext } from 'contexts/SendFormProviderContext';

export type DefaultFormToClassesType = {
  container: string;
  label: string;
  inputContainer: string;
  inputContainerError: string;
  invalidReceiverErrorMsg: string;
  scamErrorMsg: string;
  scamErrorIcon: string;
};
export const defaultFormToClasses = {
  container: 'form-group',
  label: 'mb-2',
  inputContainer: 'notranslate typeahead',
  inputContainerError: 'is-invalid',
  invalidReceiverErrorMsg: 'invalid-feedback',
  scamErrorMsg: 'text-warning',
  scamErrorIcon: 'text-warning mr-1'
};

function filterBy(option: any, props: any) {
  if (props.text.length > 2) {
    return option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;
  }
  return false;
}

const renderMenuItemChildren = (option: TypeaheadResult<string>) => (
  <div>{option}</div>
);

const shouldSelect = (canSelect: boolean, e: any) => {
  return e.key === 'Enter' || e.keyCode === 13 || canSelect;
};

const renderMenu = (
  results: TypeaheadResult<string>[],
  menuProps: TypeaheadMenuProps<string>
) => {
  if (!results.length) {
    return null;
  }
  return (
    <Menu {...menuProps}>
      {results.map((result, index) => {
        return index < 5 ? (
          <MenuItem option={result} position={index} key={index}>
            {result}
          </MenuItem>
        ) : null;
      })}
    </Menu>
  );
};

const renderInput = ({ inputRef, referenceElementRef, ...inputProps }: any) => (
  <Hint shouldSelect={shouldSelect}>
    <Form.Control
      {...inputProps}
      data-testid='receiver'
      ref={(node: any) => {
        inputRef(node);
        referenceElementRef(node);
      }}
    />
  </Hint>
);

export const To = ({
  label,
  customClasses
}: {
  label?: string;
  customClasses?: DefaultFormToClassesType;
}) => {
  const classes = customClasses || defaultFormToClasses;
  const { receiverInfo } = useSendFormContext();

  const {
    scamError,
    knownAddresses,
    receiverError,
    receiver,
    isReceiverInvalid,
    onBlurReceiver,
    onChangeReceiver
  } = receiverInfo;

  const [key, setKey] = useState('');

  const ref = React.useRef(null);

  const typeaheadInputProps = {
    id: 'receiver',
    name: 'receiver',
    autoCapitalize: 'none',
    className: classnames('', {
      scam: Boolean(scamError),
      'is-invalid': isReceiverInvalid
    })
  };

  const onInputChange = (input: string) => {
    const noSpaces = input ? input.trim() : input;
    onChangeReceiver(noSpaces);
  };

  const onChange = (selected: string[]) => {
    const [selectedValue] = selected;
    if (selectedValue) {
      onChangeReceiver(selectedValue);
    }
  };

  function triggerRerenderOnceOnHook() {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  }

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  return (
    <div className={classes.container} key={key}>
      {label && <div className={classes.label}>{label}</div>}
      <div
        className={classnames(classes.inputContainer, {
          [classes.inputContainerError]: isReceiverInvalid
        })}
      >
        <Typeahead
          ref={ref}
          id='receiverWrapper'
          inputProps={typeaheadInputProps}
          defaultInputValue={receiver}
          options={knownAddresses}
          ignoreDiacritics
          emptyLabel={false}
          caseSensitive={false}
          filterBy={filterBy}
          onInputChange={onInputChange}
          onChange={onChange}
          onBlur={onBlurReceiver}
          renderMenuItemChildren={renderMenuItemChildren}
          renderInput={renderInput}
          renderMenu={renderMenu}
        />
      </div>
      {isReceiverInvalid && (
        <div
          className={classes.invalidReceiverErrorMsg}
          data-testid='receiverError'
        >
          {receiverError}
        </div>
      )}
      {scamError && (
        <div className={classes.scamErrorMsg} data-testid='receiverScam'>
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={classes.scamErrorIcon}
            />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};

export default To;
