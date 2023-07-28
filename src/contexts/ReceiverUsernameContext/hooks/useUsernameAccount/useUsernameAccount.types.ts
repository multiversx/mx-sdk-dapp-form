import { UsernameAccountsType } from '../useFetchUsernameAddress';

export interface UseUsernameAddressReturnType {
  fetchingUsernameAccount: boolean;
  usernameAccounts: UsernameAccountsType;
}

export interface UseUsernameAccountType {
  searchPatternToLookFor: string;
  shouldSkipSearch: boolean;
}
