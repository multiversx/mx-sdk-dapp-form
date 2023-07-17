import { useEffect } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils';
import { useAccountContext } from '../../AccountContext';
import {
  UsernameAccountsType,
  useFetchUsernameAddress
} from './useFetchUsernameAddress';

export interface UseUsernameAddressReturnType {
  usernameAddress: string;
  usernameApiUsername?: string;
  fetchingUsernameAccount: boolean;
  usernameAccounts: UsernameAccountsType;
}

export const useUsernameAccount = (
  username: string
): UseUsernameAddressReturnType => {
  const account = useAccountContext();

  const { fetchUsernameAccount, fetchingUsernameAccount, usernameAccounts } =
    useFetchUsernameAddress();

  const isOwnUsername = username && username === account.username;
  const isValidAddress = addressIsValid(username);

  useEffect(() => {
    if (!username || isOwnUsername || isValidAddress) {
      return;
    }
    fetchUsernameAccount(username);
  }, [username, isOwnUsername, isValidAddress]);

  const usernameAddress = isOwnUsername
    ? account.address
    : usernameAccounts[username]?.address ?? '';

  const usernameApiUsername = isOwnUsername
    ? account.username
    : usernameAccounts[username]?.username;

  return {
    usernameAddress: isValidAddress ? username : usernameAddress,
    usernameApiUsername,
    fetchingUsernameAccount,
    usernameAccounts
  };
};
