import { useEffect } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils';

import { useFetchUsernameAddress } from '../useFetchUsernameAddress';
import {
  UseUsernameAccountType,
  UseUsernameAddressReturnType
} from './useUsernameAccount.types';

export const useUsernameAccount = ({
  shouldSkipSearch = false,
  usernameToLookFor
}: UseUsernameAccountType): UseUsernameAddressReturnType => {
  const { fetchUsernameAccount, fetchingUsernameAccount, usernameAccounts } =
    useFetchUsernameAddress();

  const isValidAddress = addressIsValid(usernameToLookFor);

  useEffect(() => {
    if (!usernameToLookFor || isValidAddress || shouldSkipSearch) {
      return;
    }

    fetchUsernameAccount(usernameToLookFor);
  }, [usernameToLookFor, isValidAddress]);

  return {
    fetchingUsernameAccount,
    usernameAccounts
  };
};
