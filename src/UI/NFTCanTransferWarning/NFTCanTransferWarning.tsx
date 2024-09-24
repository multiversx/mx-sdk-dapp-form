import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ACCOUNTS_ENDPOINT } from '@multiversx/sdk-dapp/apiCalls/endpoints';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI/ExplorerLink';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import { CAN_TRANSFER_MESSAGE, FormDataTestIdsEnum } from 'constants/index';
import { WithClassnameType } from 'types';

import { ExtendedValuesType } from 'types';
import styles from './styles.module.scss';

export const NFTCanTransferWarning = (props: WithClassnameType) => {
  const { className } = props;
  const {
    values: { nft, address }
  } = useFormikContext<ExtendedValuesType>();

  if (!nft?.allowedReceivers || nft.allowedReceivers.includes(address)) {
    return null;
  }

  return (
    <div
      className={classNames(styles.canTransferWarning, className)}
      data-testid={FormDataTestIdsEnum.canTransferWarning}
    >
      <div className={styles.canTransferWarningHeading}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={styles.canTransferWarningIcon}
          size='lg'
        />

        <div className={styles.canTransferWarningTitle}>
          <div className={styles.canTransferWarningLabel}>Warning!</div>
          <div className={styles.canTransferWarningMessage}>
            {CAN_TRANSFER_MESSAGE}
          </div>
        </div>
      </div>

      <div className={styles.canTransferWarningAddresses}>
        {nft.allowedReceivers.map((receiver) => (
          <div className={styles.canTransferWarningAddress} key={receiver}>
            <Trim
              text={receiver}
              className={styles.canTransferWarningAddressTrim}
            />

            <CopyButton
              text={receiver}
              className={styles.canTransferWarningAddressCopy}
            />

            <ExplorerLink
              page={`/${ACCOUNTS_ENDPOINT}/${receiver}`}
              className={styles.canTransferWarningAddressExplorer}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
