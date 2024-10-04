import { useEffect } from 'react';

import { addressIsValid } from 'helpers';
import { useFetchUsernameAddress } from '../useFetchUsernameAddress';
import {
  UseUsernameAccountType,
  UseUsernameAddressReturnType
} from './useUsernameAccount.types';

export const useUsernameAccount = ({
  shouldSkipSearch = false,
  searchPatternToLookFor
}: UseUsernameAccountType): UseUsernameAddressReturnType => {
  const {
    fetchUsernameAccount,
    fetchUsernameByAddress,
    fetchingUsernameAccount,
    usernameAccounts
  } = useFetchUsernameAddress();

  const isValidAddress = addressIsValid(searchPatternToLookFor);

  useEffect(() => {
    if (!searchPatternToLookFor || shouldSkipSearch) {
      return;
    }

    if (isValidAddress) {
      fetchUsernameByAddress(searchPatternToLookFor);
      return;
    }

    fetchUsernameAccount(searchPatternToLookFor);
  }, [searchPatternToLookFor, isValidAddress]);

  return {
    fetchingUsernameAccount,
    usernameAccounts
  };
};
