import { useState } from 'react';
import { ApiConfigType } from 'apiCalls';
import { getAccountByUsername } from 'apiCalls/account';

interface UsernameAddressesType {
  [username: string]: string;
}

export function useFetchUsernameAddress(apiConfig?: ApiConfigType) {
  const [usernameAddresses, setUsernameAddresses] =
    useState<UsernameAddressesType>({});
  const [fetching, setFetching] = useState(false);

  const fetchUsernameAddres = async (username: string) => {
    const notVerified = !(username in usernameAddresses);
    if (notVerified && !fetching) {
      setFetching(true);
      try {
        const data = await getAccountByUsername(username, apiConfig);
        setUsernameAddresses((existing) => ({
          ...existing,
          [username]: data ? data.address : ''
        }));
      } catch (err) {
        setUsernameAddresses((existing) => ({
          ...existing,
          [username]: ''
        }));
      }
      setFetching(false);
    }
  };

  return {
    usernameAddresses,
    fetchUsernameAddres,
    fetchingUsernameAddress: fetching
  };
}
