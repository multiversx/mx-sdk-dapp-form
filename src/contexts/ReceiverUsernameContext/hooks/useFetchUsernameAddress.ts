import { useState } from 'react';
import { ApiConfigType } from 'apiCalls';
import { getAccountByUsername } from 'apiCalls/account';

export interface UsernameAccountsType {
  [username: string]: {
    address: string;
    /**
     * **username**: Might differ from the original username search string.
     */
    username: string;
  } | null;
}

let fetchedAddresses: UsernameAccountsType = {};

export function useFetchUsernameAddress(apiConfig?: ApiConfigType) {
  const [fetching, setFetching] = useState(false);
  const [usernameAccounts, setUsernameAddresses] =
    useState<UsernameAccountsType>(fetchedAddresses);

  const fetchUsernameAccount = async (username: string) => {
    const fetched = username in usernameAccounts;

    if (fetched || fetching) {
      return;
    }

    setFetching(true);

    try {
      const account = await getAccountByUsername(username, apiConfig);

      setUsernameAddresses((existing) => {
        const newAddresses = {
          ...existing,
          [username]: account
        };
        fetchedAddresses = newAddresses;
        return newAddresses;
      });
    } catch (err) {
      setUsernameAddresses((existing) => ({
        ...existing,
        [username]: null
      }));
    }

    setFetching(false);
  };

  return {
    usernameAccounts,
    fetchUsernameAccount,
    fetchingUsernameAccount: fetching
  };
}
