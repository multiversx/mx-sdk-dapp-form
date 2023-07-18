import { useEffect } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils';
import {
  UsernameAccountsType,
  useFetchUsernameAddress
} from './useFetchUsernameAddress';

export interface UseUsernameAddressReturnType {
  fetchingUsernameAccount: boolean;
  usernameAccounts: UsernameAccountsType;
}

export const useUsernameAccount = (
  username: string
): UseUsernameAddressReturnType => {
  const { fetchUsernameAccount, fetchingUsernameAccount, usernameAccounts } =
    useFetchUsernameAddress();

  const isValidAddress = addressIsValid(username);

  useEffect(() => {
    if (!username || isValidAddress) {
      return;
    }
    fetchUsernameAccount(username);
  }, [username, isValidAddress]);

  return {
    fetchingUsernameAccount,
    usernameAccounts
  };
};
