import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types';
import { getLedgerVersionOptions } from '@multiversx/sdk-dapp/utils';

import { useAccountContext, useSendFormContext } from 'contexts';

export const useAllowWithGuardians = () => {
  const { isGuarded } = useAccountContext();
  const { ledgerAccount } = useGetAccountInfo();
  const {
    accountInfo: { providerType }
  } = useSendFormContext();

  const isLedgerProvider = providerType === LoginMethodsEnum.ledger;
  const ledgerOptions = getLedgerVersionOptions(ledgerAccount?.version ?? '');

  const guardiansException =
    !ledgerOptions.ledgerWithGuardians && isLedgerProvider && isGuarded;

  return !guardiansException;
};
