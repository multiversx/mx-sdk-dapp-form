import { UsernameAccountsType } from '../useFetchUsernameAddress';

export interface UseUsernameAddressReturnType {
  fetchingUsernameAccount: boolean;
  usernameAccounts: UsernameAccountsType;
}

export interface UseUsernameAccountType {
  usernameToLookFor: string;
  shouldSkipSearch: boolean;
}
