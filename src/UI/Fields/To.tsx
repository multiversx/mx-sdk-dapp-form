import React, { useEffect, useState } from 'react';
import { addressIsValid } from '@elrondnetwork/dapp-core/utils/account/addressIsValid';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';
import { Typeahead, Menu, MenuItem, Hint } from 'react-bootstrap-typeahead';
import { MenuProps } from 'react-bootstrap-typeahead/types/components/Menu';
import {
  FilterByCallback,
  SelectHint,
  TypeaheadInputProps,
  TypeaheadManagerChildProps,
  Option
} from 'react-bootstrap-typeahead/types/types';
import { ReceiverContextPropsType } from 'contexts/ReceiverContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

const filterBy: FilterByCallback = (option, props) => {
  if (props.text.length > 2) {
    return option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;
  }
  return false;
};

const renderMenu = (results: string[], menuProps: MenuProps) => {
  if (!results.length) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { renderMenuItemChildren, referenceElementRef, ...rest } =
    menuProps as any;

  return (
    <Menu {...rest}>
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

const changeAndBlurInput = (props: {
  value?: string;
  onBlurReceiver: ReceiverContextPropsType['onBlurReceiver'];
  onChangeReceiver: ReceiverContextPropsType['onChangeReceiver'];
}) => {
  const noSpaces = props.value ? props.value.trim() : '';
  props.onChangeReceiver(noSpaces);
  setTimeout(() => {
    props.onBlurReceiver(new Event('blur'));
  });
};

const renderInput =
  (
    onBlurReceiver: ReceiverContextPropsType['onBlurReceiver'],
    onChangeReceiver: ReceiverContextPropsType['onChangeReceiver']
  ) =>
  (inputProps: TypeaheadInputProps, props: TypeaheadManagerChildProps) => {
    return (
      <Hint>
        <Form.Control
          {...(props.getInputProps() as any)}
          {...inputProps}
          onBlur={() => {
            changeAndBlurInput({
              value: inputProps.value?.toString(),
              onBlurReceiver,
              onChangeReceiver
            });
          }}
          data-testid='receiver'
        />
      </Hint>
    );
  };

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

  const onInputChange = (value: string) => {
    changeAndBlurInput({ value, onChangeReceiver, onBlurReceiver });
  };

  const onChange = (selected: Option[]) => {
    const selection = selected.pop()?.toString();
    if (selection) {
      onInputChange(selection);
    }
  };

  const triggerRerenderOnceOnHook = () => {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  };

  const selectHint = (
    shouldSelect: SelectHint,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => event.key === 'Enter' || shouldSelect;

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
          selectHint={selectHint as any}
          defaultInputValue={receiver}
          options={knownAddresses}
          ignoreDiacritics
          emptyLabel={false}
          caseSensitive={false}
          filterBy={filterBy}
          onChange={onChange}
          onInputChange={onInputChange}
          renderInput={renderInput(onBlurReceiver, onChangeReceiver)}
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
