import React from 'react';
import { decodePart } from '@multiversx/sdk-dapp/utils/decoders/decodePart';
import classNames from 'classnames';

import globals from 'assets/sass/globals.module.scss';
import styles from './styles.module.scss';

const allOccurences = (sourceStr: string, searchStr: string) =>
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

export interface DataPropsType {
  label?: string;
  scCallLabel?: string;
  data: string;
  highlight?: string;
  isScCall?: boolean;
}

export const Data = ({
  label = 'Data',
  scCallLabel = 'SC Call',
  data,
  highlight,
  isScCall
}: DataPropsType) => {
  let output = <>{data}</>;

  const [encodedScCall, ...remainingDataFields] =
    highlight && isScCall ? highlight.split('@') : [];

  if (data && highlight && allOccurences(data, highlight).length === 1) {
    switch (true) {
      case data.startsWith(highlight): {
        const [, rest] = data.split(highlight);
        output = (
          <>
            {highlight}
            <span className={styles.secondary}>{rest}</span>
          </>
        );
        break;
      }
      case data.endsWith(highlight): {
        const [rest] = data.split(highlight);
        output = (
          <>
            <span className={styles.secondary}>{rest}</span>
            {highlight}
          </>
        );
        break;
      }

      default: {
        const [start, end] = data.split(highlight);

        output = (
          <>
            <span className={styles.secondary}>{start}</span>
            {highlight}
            <span className={styles.secondary}>{end}</span>
          </>
        );
        break;
      }
    }
  }

  return (
    <>
      {encodedScCall && (
        <div className={styles.data}>
          <span className={globals.label}>{scCallLabel}</span>

          <div
            data-testid='confirmScCall'
            className={classNames(globals.textarea, styles.textarea)}
          >
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}

      <div className={styles.data}>
        <span className={globals.label}>{label}</span>

        <div
          data-testid='confirmData'
          className={classNames(globals.textarea, globals.value)}
        >
          {data ? output : 'N/A'}
        </div>
      </div>
    </>
  );
};
