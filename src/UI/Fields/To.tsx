import React, { useEffect, useState } from 'react';
import { addressIsValid } from '@elrondnetwork/dapp-core';
import { Form } from 'react-bootstrap';
import {
  Typeahead,
  Menu,
  MenuItem,
  Hint,
  TypeaheadResult,
  TypeaheadMenuProps
} from 'react-bootstrap-typeahead';
import { useSendFormContext } from 'contexts';
import classnames from 'optionalPackages/classnames';
import { faExclamationTriangle } from 'optionalPackages/fortawesome-free-solid-svg-icons';
import { FontAwesomeIcon } from 'optionalPackages/react-fontawesome';

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

export const To = () => {
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
    <div className='form-group' key={key}>
      <div
        className={classnames('notranslate typeahead', {
          'is-invalid': isReceiverInvalid
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
        <div className='invalid-feedback' data-testid='receiverError'>
          {receiverError}
        </div>
      )}
      {scamError && (
        <div className='text-warning' data-testid='receiverScam'>
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className='text-warning mr-1'
            />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};

export default To;
