import React, {
  useState,
  ChangeEvent,
  ReactNode,
  useEffect,
  useCallback,
  Children
} from 'react';

import { addressIsValid } from '@elrondnetwork/dapp-core/utils';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Autocomplete from 'react-autocomplete';

import { ReceiverContextPropsType } from 'contexts/ReceiverContext';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { useUICustomizationContext } from 'contexts/UICustomization';

import styles from './styles.module.scss';

const Item = (address: string, highlighted: boolean) => (
  <div
    key={address}
    className={classNames(styles.item, { [styles.highlighted]: highlighted })}
  >
    {address}
  </div>
);

const Menu = (children: Array<ReactNode>) => (
  <div className={styles.menu}>
    {Children.map(children, (child, index) => (index < 5 ? child : null))}
  </div>
);

export const To = () => {
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

  const changeAndBlurInput = useCallback(
    (props: {
      value?: string;
      onBlurReceiver: ReceiverContextPropsType['onBlurReceiver'];
      onChangeReceiver: ReceiverContextPropsType['onChangeReceiver'];
    }) => {
      props.onChangeReceiver(props.value ? props.value.trim() : '');
      setTimeout(() => props.onBlurReceiver(new Event('blur')));
    },
    []
  );

  const shouldItemRender = (item: string, value: string) =>
    item.toLowerCase().indexOf(value.toLowerCase()) !== -1 && value.length > 2;

  const onChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    event.preventDefault();
    onInputChange(event.target.value);
    setValue(value);
  };

  const onSelect = (option: string) => {
    setValue(option);
    onInputChange(option);
  };

  const onInputChange = (value: string) => {
    changeAndBlurInput({ value, onBlurReceiver, onChangeReceiver });
  };

  const triggerRerenderOnceOnHook = () => {
    if (addressIsValid(receiver) && !key) {
      setKey(receiver);
    }
  };

  useEffect(triggerRerenderOnceOnHook, [receiver]);

  return (
    <div className={styles.to}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.autocomplete}>
        <Autocomplete
          {...{
            getItemValue: (item: string) => item,
            wrapperStyle: { display: 'flex' },
            items: knownAddresses,
            renderItem: Item,
            renderMenu: Menu,
            shouldItemRender,
            onSelect,
            onChange,
            value
          }}
        />
      </div>

      {isReceiverInvalid && (
        <div data-testid='receiverError' className={styles.error}>
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

export default To;
