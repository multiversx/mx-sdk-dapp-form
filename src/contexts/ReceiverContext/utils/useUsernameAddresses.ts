import { useState } from 'react';
import { ApiConfigType } from 'apiCalls';
import { getAccountByUsername } from 'apiCalls/account';

interface UsernameAddressesType {
  [username: string]: string;
}

export function useUsernameAddresses(apiConfig?: ApiConfigType) {
  const [usernameAddresses, setUsernameAddresses] =
    useState<UsernameAddressesType>({});
  const [fetching, setFetching] = useState(false);

  const fetchUsernameAddress = async (username: string) => {
    const notVerified = !(username in usernameAddresses);
    if (notVerified && !fetching) {
      setFetching(true);
      try {
        const data = await getAccountByUsername(username, apiConfig);
        setUsernameAddresses((existing) => ({
          ...existing,
          ...(data ? { [username]: data.address } : {})
        }));
      } catch (err) {
        console.info(`Unable to find ${username} address`, err);
      }
      setFetching(false);
    }
  };

  return {
    usernameAddresses,
    fetchUsernameAddress,
    fetchingUsernameAddress: fetching
  };
}
