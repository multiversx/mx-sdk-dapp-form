import React, { ReactNode, useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isContract } from '@multiversx/sdk-dapp/out/utils/validation/isContract';
import { getAccountFromApi } from '@multiversx/sdk-dapp/out/apiCalls/account/getAccountFromApi';
import { ACCOUNTS_ENDPOINT } from '@multiversx/sdk-dapp/out/apiCalls/endpoints';
import { trimUsernameDomain } from '@multiversx/sdk-dapp/out/utils/account/trimUsernameDomain';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import MultiversXIconSimple from 'assets/icons/mx-icon-simple.svg';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { CopyButton } from 'UI/CopyButton';
import { ExplorerLink } from 'UI/ExplorerLink';
import { LoadingDots } from 'UI/LoadingDots';
import { Trim } from 'UI/Trim';
import styles from './styles.module.scss';

interface AccountData {
  username?: string;
}

export interface ReceiverPropsType {
  amount: string;
  label?: ReactNode;
  customCopyIcon?: IconProp;
  customExplorerIcon?: IconProp;
  receiver: string;
  receiverUsername?: string;
  scamReport: string | null;
  shouldTrimReceiver?: boolean;
}

export const Receiver = ({
  amount,
  label,
  receiver,
  customCopyIcon,
  customExplorerIcon,
  receiverUsername,
  scamReport,
  shouldTrimReceiver = true
}: ReceiverPropsType) => {
  const [usernameAccount, setUsernameAccount] = useState<AccountData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const isSmartContract = isContract(receiver);
  const skipFetchingAccount = Boolean(isSmartContract || receiverUsername);
  const isAmountZero = new BigNumber(amount).isZero();

  const foundReceiverUsername = receiverUsername ?? usernameAccount?.username;
  const receiverValue = foundReceiverUsername ?? receiver;
  const hasUsername =
    Boolean(receiver && Boolean(foundReceiverUsername)) && !error;

  const defaultReceiverLabel =
    isAmountZero && isSmartContract ? 'To interact with' : 'To';

  const fetchUsernameAccount = async () => {
    if (skipFetchingAccount) {
      setUsernameAccount(null);
    } else {
      try {
        setIsLoading(true);
        const username = await getAccountFromApi({
          address: receiver,
          baseURL: ACCOUNTS_ENDPOINT
        });
        setUsernameAccount(username);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsernameAccount();
  }, [receiver, skipFetchingAccount]);

  return (
    <div className={styles.receiver}>
      <div className={styles.receiverLabelWrapper}>
        <div className={styles.receiverLabel}>
          {label ?? defaultReceiverLabel}
        </div>

        {scamReport && (
          <div className={styles.receiverLabelScam}>
            <span
              className={styles.receiverLabelScamText}
              data-testid={FormDataTestIdsEnum.confirmScamReport}
            >
              {scamReport}
            </span>

            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={styles.receiverLabelScamIcon}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className={styles.receiverWrapper}>
          <LoadingDots className={styles.receiverLoading} />
        </div>
      ) : (
        <div
          data-testid={FormDataTestIdsEnum.confirmReceiver}
          className={classNames(styles.receiverWrapper, {
            [styles.unwrappable]: shouldTrimReceiver
          })}
        >
          {shouldTrimReceiver ? (
            <Trim text={receiver} className={styles.receiverTrim} />
          ) : (
            <div className={styles.receiverText}>{receiver}</div>
          )}

          {hasUsername && !isSmartContract && (
            <span className={styles.receiverData}>
              (<MultiversXIconSimple className={styles.receiverDataIcon} />
              <span className={styles.receiverDataUsername}>
                {trimUsernameDomain(receiverValue)}
              </span>
              )
            </span>
          )}

          {isSmartContract && (
            <span className={styles.receiverData}>
              (
              <span className={styles.receiverDataUsername}>
                Smart Contract
              </span>
              )
            </span>
          )}

          <CopyButton
            text={receiver}
            className={styles.receiverCopy}
            copyIcon={customCopyIcon}
          />

          <ExplorerLink
            page={`/${ACCOUNTS_ENDPOINT}/${receiver}`}
            className={styles.receiverExternal}
            customExplorerIcon={customExplorerIcon}
          />
        </div>
      )}
    </div>
  );
};
