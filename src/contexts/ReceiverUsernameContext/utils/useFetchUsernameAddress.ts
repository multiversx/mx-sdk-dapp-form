import { useState } from 'react';
import { ApiConfigType } from 'apiCalls';
import { getAccountByUsername } from 'apiCalls/account';

export interface UsernameAddressesType {
  [username: string]: string;
}

let fetchedAddresses: UsernameAddressesType = {};

export function useFetchUsernameAddress(apiConfig?: ApiConfigType) {
  const [fetching, setFetching] = useState(false);
  const [usernameAddresses, setUsernameAddresses] =
    useState<UsernameAddressesType>(fetchedAddresses);
  const fetchUsernameAddres = async (username: string) => {
    const notVerified = !(username in usernameAddresses);
    if (notVerified && !fetching) {
      setFetching(true);
      try {
        const address = await getAccountByUsername(username, apiConfig);
        setUsernameAddresses((existing) => {
          const newAddresses = {
            ...existing,
            [username]: address
          };
          fetchedAddresses = newAddresses;
          return newAddresses;
        });
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
