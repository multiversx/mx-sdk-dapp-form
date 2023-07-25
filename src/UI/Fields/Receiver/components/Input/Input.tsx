import React, { MutableRefObject } from 'react';
import classNames from 'classnames';
import { components } from 'react-select';

import { useSendFormContext } from 'contexts';

import styles from '../../styles.module.scss';
import { doesFocusedOptionIncludeUsername } from './helpers';

export const renderInput =
  (receiverSelectReference: MutableRefObject<null>): typeof components.Input =>
  (props) => {
    const { selectProps } = props;
    const { menuIsOpen, inputValue } = selectProps;
    const {
      receiverUsernameInfo: { receiverUsername }
    } = useSendFormContext();

    const focusedOptionIncludesUsername = doesFocusedOptionIncludeUsername(
      receiverSelectReference,
      inputValue
    );

    return (
      <components.Input
        {...props}
        data-testid='receiver'
        className={classNames(styles.receiverSelectInput, {
          [styles.visible]: menuIsOpen,
          [styles.spaced]:
            Boolean(receiverUsername) || focusedOptionIncludesUsername
        })}
      />
    );
  };
