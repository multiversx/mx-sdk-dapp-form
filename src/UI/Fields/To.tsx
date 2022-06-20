import React, { useEffect, useState } from 'react';
import { addressIsValid } from '@elrondnetwork/dapp-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { Typeahead, Menu, MenuItem, Hint } from 'react-bootstrap-typeahead';
import { MenuProps } from 'react-bootstrap-typeahead/types/components/Menu';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

function filterBy(option: any, props: any) {
  if (props.text.length > 2) {
    return option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;
  }
  return false;
}

// const shouldSelect = (canSelect: boolean, e: any) => {
//   return e.key === 'Enter' || e.keyCode === 13 || canSelect;
// };

const renderMenu = (results: string[], menuProps: MenuProps) => {
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
  <Hint>
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
  const {
    fields: {
      to: { classes: customClasses, label }
    }
  } = useUICustomizationContext();
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

  function triggerRerenderOnceOnHook() {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  }

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  return (
    <div className={customClasses.container} key={key}>
      {label && <div className={customClasses.label}>{label}</div>}
      <div
        className={classnames(customClasses.inputContainer, {
          [customClasses.inputContainerError as string]: isReceiverInvalid
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
          onBlur={(e) => {
            onBlurReceiver(e as any);
          }}
          renderMenuItemChildren={(option) => <div>{option.toString()}</div>}
          renderInput={renderInput}
          renderMenu={renderMenu as any}
        />
      </div>
      {isReceiverInvalid && (
        <div
          className={customClasses.invalidReceiverErrorMsg}
          data-testid='receiverError'
        >
          {receiverError}
        </div>
      )}
      {scamError && (
        <div className={customClasses.scamErrorMsg} data-testid='receiverScam'>
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={customClasses.scamErrorIcon}
            />
            <small>{scamError}</small>
          </span>
        </div>
      )}
    </div>
  );
};

export default To;
