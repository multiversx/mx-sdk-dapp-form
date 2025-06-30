import React, { MutableRefObject } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import classNames from 'classnames';
import { components } from 'react-select';

import { useSendFormContext } from 'contexts';
import { ValuesEnum } from 'types';

import { ReceiverSelectReferenceType } from '../../Receiver.types';
import styles from '../../styles.module.scss';
import { getFocusedOptionIncludesUsername } from './helpers';

export const renderInput =
  (
    receiverSelectReference: MutableRefObject<ReceiverSelectReferenceType>
  ): typeof components.Input =>
  (props) => {
    const { selectProps, value } = props;
    const { inputValue, menuIsOpen } = selectProps;
    const {
      receiverUsernameInfo: { receiverUsername }
    } = useSendFormContext();

    const focusedOptionIncludesUsername = getFocusedOptionIncludesUsername(
      receiverSelectReference,
      inputValue
    );

    const selectedOptionIsAddress = addressIsValid(String(value));
    const isSpaced = Boolean(receiverUsername) || focusedOptionIncludesUsername;

    const isVisible =
      (selectedOptionIsAddress && menuIsOpen) ||
      (!selectedOptionIsAddress && inputValue);

    return (
      <components.Input
        {...props}
        data-testid={ValuesEnum.receiver}
        className={classNames(styles.receiverSelectInput, {
          [styles.visible]: isVisible,
          [styles.spaced]: isSpaced
        })}
      />
    );
  };
