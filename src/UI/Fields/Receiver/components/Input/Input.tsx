import React, { MutableRefObject } from 'react';
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
    const { selectProps } = props;
    const { menuIsOpen, inputValue } = selectProps;
    const {
      receiverUsernameInfo: { receiverUsername }
    } = useSendFormContext();

    const focusedOptionIncludesUsername = getFocusedOptionIncludesUsername(
      receiverSelectReference,
      inputValue
    );

    const isSpaced = Boolean(receiverUsername) || focusedOptionIncludesUsername;

    return (
      <components.Input
        {...props}
        data-testid={ValuesEnum.receiver}
        className={classNames(styles.receiverSelectInput, {
          [styles.visible]: menuIsOpen,
          [styles.spaced]: isSpaced
        })}
      />
    );
  };
