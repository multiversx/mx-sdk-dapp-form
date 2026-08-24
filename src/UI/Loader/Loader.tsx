import React from 'react';
import classNames from 'classnames';
import { WithClassnameType } from 'types';
import { MvxSpinnerIcon } from 'UI/sdkDappUi';
import styles from './loader.module.scss';

export type LoaderPropsType = WithClassnameType;

export const Loader = ({
  className,
  'data-testid': dataTestId
}: LoaderPropsType) => (
  <div
    className={classNames(
      'flex justify-center items-center h-screen',
      className
    )}
    data-testid={dataTestId}
  >
    <MvxSpinnerIcon class={styles.loaderSpinner} />
  </div>
);
