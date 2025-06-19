import { useState } from 'react';

import { trimUsernameDomain } from '@multiversx/sdk-dapp/out/utils/account/trimUsernameDomain';
import { ApiConfigType, getApiConfig } from 'apiCalls';
import { getAccountByUsername } from 'apiCalls/account';
import { getMultiversxAccount } from 'apiCalls/account/getAccount';

export interface UsernameAccountsType {
  [username: string]: {
    address: string;
    /**
     * **username**: Might differ from the original username search string.
     */
    username: string;
    rawUsername: string;
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
      const accountUsername = account?.username;

      setUsernameAddresses((existing) => {
        const newAddresses = {
          ...existing,
          [username]: {
            address: account?.address ?? '',
            username: accountUsername
              ? String(trimUsernameDomain(accountUsername))
              : '',
            rawUsername: accountUsername ?? ''
          }
        };

        fetchedAddresses = newAddresses;

        return newAddresses;
      });
    } catch {
      setUsernameAddresses((existing) => ({
        ...existing,
        [username]: null
      }));
    }

    setFetching(false);
  };

  const fetchUsernameByAddress = async (address: string) => {
    const fetched = Object.values(usernameAccounts).find(
      (account) => account && account.address === address
    );

    if (fetched || fetching) {
      return;
    }

    setFetching(true);

    try {
      const config = apiConfig || (await getApiConfig());
      const account = await getMultiversxAccount(address, config.baseURL);
      const fetchedAddress = account?.address;
      const accountUsername = account?.username;
      const fetchedUsername = trimUsernameDomain(accountUsername);

      if (!fetchedAddress || !fetchedUsername) {
        return;
      }

      setUsernameAddresses((existing) => {
        const newAddresses = {
          ...existing,
          [fetchedUsername]: {
            address: fetchedAddress,
            username: String(fetchedUsername),
            rawUsername: accountUsername ?? ''
          }
        };

        fetchedAddresses = newAddresses;
        return newAddresses;
      });
    } catch (error) {
      console.error(error);
    }

    setFetching(false);
  };

  return {
    usernameAccounts,
    fetchUsernameAccount,
    fetchUsernameByAddress,
    fetchingUsernameAccount: fetching
  };
}
