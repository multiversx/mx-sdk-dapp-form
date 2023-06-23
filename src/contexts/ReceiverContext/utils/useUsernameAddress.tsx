import { useEffect } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils';
import { useAccountContext } from '../../AccountContext';
import { useFetchUsernameAddress } from './useFetchUsernameAddress';

export function useUsernameAddress(username: string) {
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
    fetchingUsernameAddress
  };
}
