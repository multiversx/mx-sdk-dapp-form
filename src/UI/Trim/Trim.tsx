import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ELLIPSIS } from '@multiversx/sdk-dapp/out/constants';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';
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
}: TrimType) => {
  const [debounce, setDebounce] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const trimRef = useRef<HTMLSpanElement>(null);
  const hiddenTextRef = useRef<HTMLSpanElement>(null);
  const debounceTracker = useDebounce(debounce, 300);

  const onOverflowChange = () => {
    if (trimRef.current && hiddenTextRef.current) {
      const diff =
        hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
      setOverflow(diff > 1);
    }
  };

  const listener = () => {
    setDebounce((d) => d + 1);
  };

  useEffect(() => {
    window?.addEventListener('resize', listener);
    return () => {
      window?.removeEventListener('resize', listener);
    };
  }, []);

  useEffect(() => {
    onOverflowChange();
  }, [debounceTracker]);

  return (
    <span
      ref={trimRef}
      className={classNames(styles.trim, color, className, {
        overflow: overflow
      })}
      data-testid={dataTestId}
    >
      <span ref={hiddenTextRef} className={styles.hiddenTextRef}>
        {text}
      </span>

      {overflow ? (
        <>
          <span className={styles.left}>
            <span>
              {String(text).substring(0, Math.floor(text.length / 2))}
            </span>
          </span>

          <span className={styles.ellipsis}>{ELLIPSIS}</span>

          <span className={styles.right}>
            <span>{String(text).substring(Math.ceil(text.length / 2))}</span>
          </span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </span>
  );
};

export const Trim = TrimComponent;
