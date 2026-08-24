import React from 'react';
import classNames from 'classnames';
import { MvxTrim } from 'lib/sdkDappUi';
import { WithClassnameType } from 'types';
import styles from './trim.module.scss';

export interface TrimType extends WithClassnameType {
  text: string;
  color?: 'muted' | 'secondary' | string;
}

const TrimComponent = ({
  text,
  className = 'dapp-trim',
  'data-testid': dataTestId,
  color
}: TrimType) => (
  <MvxTrim
    text={text}
    class={classNames(styles.trim, color, className)}
    dataTestId={dataTestId}
  />
);

export const Trim = TrimComponent;
