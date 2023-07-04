import { useEffect } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils';
import { useAccountContext } from '../../AccountContext';
import {
  UsernameAddressesType,
  useFetchUsernameAddress
} from './useFetchUsernameAddress';

export interface UseUsernameAddressReturnType {
  usernameAddress: string;
  fetchingUsernameAddress: boolean;
  usernameAddresses: UsernameAddressesType;
}

export const useUsernameAddress = (
  username: string
): UseUsernameAddressReturnType => {
  const account = useAccountContext();

  const { fetchUsernameAddres, fetchingUsernameAddress, usernameAddresses } =
    useFetchUsernameAddress();

  const isOwnUsername = username && username === account.username;
  const isValidAddress = addressIsValid(username);

  useEffect(() => {
    if (!username || isOwnUsername || isValidAddress) {
      return;
    }
    fetchUsernameAddres(username);
  }, [username, isOwnUsername, isValidAddress]);

  const usernameAddress = isOwnUsername
    ? account.address
    : usernameAddresses[username];

  return {
    usernameAddress: isValidAddress ? username : usernameAddress,
    fetchingUsernameAddress,
    usernameAddresses
  };
};
