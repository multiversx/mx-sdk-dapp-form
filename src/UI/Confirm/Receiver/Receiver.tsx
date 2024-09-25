import React, { ReactNode } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ACCOUNTS_ENDPOINT } from '@multiversx/sdk-dapp/apiCalls/endpoints';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI/ExplorerLink';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';

import classNames from 'classnames';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { MultiversXIconSimple } from 'UI/Fields/Receiver/components/MultiversXIconSimple';

export interface ReceiverPropsType {
  label?: string;
  receiver: string;
  receiverUsername?: string;
  scamReport?: ReactNode;
}

export const ReceiverComponent = ({
  label = 'Receiver',
  receiver,
  scamReport,
  receiverUsername,
  globalStyles,
  styles
}: ReceiverPropsType & WithStylesImportType) => {
  const hasUsername = Boolean(receiverUsername);
  const receiverValue = receiverUsername ?? receiver;

  return (
    <div className={styles?.confirmReceiver}>
      <span className={globalStyles?.label}>{label}</span>

      <span
        className={classNames(styles?.value, { [styles?.shrunk]: hasUsername })}
        data-testid={FormDataTestIdsEnum.confirmReceiver}
      >
        {hasUsername && <MultiversXIconSimple className={styles?.icon} />}
        {receiverValue}

        {hasUsername && (
          <ExplorerLink
            page={`/${ACCOUNTS_ENDPOINT}/${receiver}`}
            className={styles?.explorer}
          />
        )}
      </span>

      {hasUsername && (
        <span className={styles?.subValue}>
          <Trim text={receiver} className={styles?.subValueTrim} />
          <CopyButton text={receiver} className={styles?.subValueCopy} />
        </span>
      )}

      {scamReport && (
        <div className={styles?.scam}>
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={styles?.icon}
            />
            <small data-testid='confirmScamReport'>{scamReport}</small>
          </span>
        </div>
      )}
    </div>
  );
};

export const Receiver = withStyles(ReceiverComponent, {
  ssrStyles: () => import('UI/Confirm/Receiver/styles.scss'),
  clientStyles: () => require('UI/Confirm/Receiver/styles.scss').default
});
