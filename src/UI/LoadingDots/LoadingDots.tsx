import React from 'react';
import classNames from 'classnames';
import { WithClassnameType } from 'types';
import styles from './loadingDotsStyle.scss';

export type LoadingDotsPropsType = WithClassnameType;

export const LoadingDots = ({ className }: LoadingDotsPropsType) => (
  <div className={classNames(styles.loadingDots, className)}>
    {Array.from({ length: 3 }).map((_, dotIndex) => (
      <span
        key={`loading-dot-${dotIndex}`}
        className={classNames(
          styles.loadingDot,
          styles[`loadingDot-${dotIndex}`]
        )}
      />
    ))}

    <span>Loading...</span>
  </div>
);
