import React, { Fragment } from 'react';
import { decodePart } from '@elrondnetwork/dapp-core/utils';

import styles from './styles.module.scss';

const allOccurences = (sourceStr: string, searchStr: string) =>
  // eslint-disable-next-line
  // @ts-ignore
  [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map((a) => a.index);

const Data = ({
  label = 'Data',
  scCallLabel = 'SC Call',
  data,
  highlight,
  isScCall
}: {
  label?: string;
  scCallLabel?: string;
  data: string;
  highlight?: string;
  isScCall?: boolean;
}) => {
  let output = <Fragment>{data}</Fragment>;

  const [encodedScCall, ...remainingDataFields] =
    highlight && isScCall ? highlight.split('@') : [];

  if (data && highlight && allOccurences(data, highlight).length === 1) {
    switch (true) {
      case data.startsWith(highlight): {
        const [, rest] = data.split(highlight);
        output = (
          <Fragment>
            {highlight}
            <span className={styles.secondary}>{rest}</span>
          </Fragment>
        );
        break;
      }
      case data.endsWith(highlight): {
        const [rest] = data.split(highlight);
        output = (
          <Fragment>
            <span className={styles.secondary}>{rest}</span>
            {highlight}
          </Fragment>
        );
        break;
      }

      default: {
        const [start, end] = data.split(highlight);

        output = (
          <Fragment>
            <span className={styles.secondary}>{start}</span>
            {highlight}
            <span className={styles.secondary}>{end}</span>
          </Fragment>
        );
        break;
      }
    }
  }

  return (
    <Fragment>
      {encodedScCall && (
        <div className={styles.data}>
          <span className={styles.label}>{scCallLabel}</span>

          <div data-testid='confirmScCall' className={styles.textarea}>
            {[decodePart(encodedScCall), ...remainingDataFields].join('@')}
          </div>
        </div>
      )}

      <div className={styles.data}>
        <span className={styles.label}>{label}</span>

        <div data-testid='confirmData' className={styles.textarea}>
          {data ? output : 'N/A'}
        </div>
      </div>
    </Fragment>
  );
};

export default Data;
