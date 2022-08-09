import React from 'react';
import classNames from 'classnames';

import { useSendFormContext } from 'contexts/SendFormProviderContext';

import styles from './../styles.module.scss';

export const MaxButton = () => {
  const { amountInfo } = useSendFormContext();

  const { isMaxButtonVisible, onMaxClicked, isInvalid } = amountInfo;

  return (
    <>
      {isMaxButtonVisible && (
        <div
          className={classNames(styles.max, {
            [styles.maxOffset]: isInvalid
          })}
        >
          <button
            data-testid='maxBtn'
            className={styles.button}
            onClick={onMaxClicked}
          >
            Max
          </button>
        </div>
      )}
    </>
  );
};
