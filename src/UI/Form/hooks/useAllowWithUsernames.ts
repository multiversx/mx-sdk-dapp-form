import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types';
import { getLedgerVersionOptions } from '@multiversx/sdk-dapp/utils';
import { useSendFormContext } from 'contexts';

export const useAllowWithUsernames = () => {
  const { ledgerAccount } = useGetAccountInfo();
  const {
    accountInfo: { providerType },
    receiverUsernameInfo: { receiverUsername }
  } = useSendFormContext();

  const isLedgerProvider = providerType === LoginMethodsEnum.ledger;
  const ledgerOptions = getLedgerVersionOptions(ledgerAccount?.version ?? '');

  const usernamesException =
    !ledgerOptions.ledgerWithUsernames && isLedgerProvider && receiverUsername;

  return !usernamesException;
};
