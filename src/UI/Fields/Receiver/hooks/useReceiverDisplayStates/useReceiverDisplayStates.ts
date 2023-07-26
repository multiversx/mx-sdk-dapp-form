import { addressIsValid } from '@multiversx/sdk-dapp/utils';

import { KnowAddressType } from 'contexts';
import { useUsernameAccount } from 'contexts/ReceiverUsernameContext/hooks';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';
import { getIsValueAmongKnown, isAnyOptionFound } from './helpers';

export interface UseReceiverDisplayStatesType {
  inputValue: string;
  knownAddresses: KnowAddressType[] | null;
  menuIsOpen: boolean;
  isInvalid: boolean;
}

export const useReceiverDisplayStates = ({
  inputValue,
  knownAddresses,
  menuIsOpen,
  isInvalid
}: UseReceiverDisplayStatesType) => {
  const ms1000 = process.env.NODE_ENV !== 'test' ? 1000 : 1;
  const searchQueryIsAddress = inputValue.startsWith('erd1');
  const debouncedUsername = useDebounce(inputValue, ms1000);

  const usernameExactMatchExists = knownAddresses
    ? knownAddresses.find((account) => account.username === inputValue)
    : false;

  const { usernameAccounts } = useUsernameAccount({
    shouldSkipSearch: Boolean(usernameExactMatchExists) || searchQueryIsAddress,
    searchPatternToLookFor: debouncedUsername
  });

  const foundReceiver = usernameAccounts[inputValue];
  const isUsernameDebouncing =
    inputValue !== debouncedUsername && foundReceiver !== null;

  const addressIsAmongKnown = getIsValueAmongKnown({
    key: 'address',
    knownAddresses,
    inputValue
  });

  const usernameIsAmongKnown = getIsValueAmongKnown({
    key: 'username',
    knownAddresses,
    inputValue
  });

  const searchMatchesOption = isAnyOptionFound({
    inputValue,
    knownAddresses
  });

  const isUsernameFetching =
    !isUsernameDebouncing && foundReceiver === undefined && inputValue;

  const isAddressError =
    searchQueryIsAddress &&
    (!addressIsAmongKnown || !menuIsOpen) &&
    !addressIsValid(inputValue);

  const isUsernameError = Boolean(
    inputValue &&
      debouncedUsername &&
      !isUsernameDebouncing &&
      !isUsernameFetching &&
      !foundReceiver &&
      !searchQueryIsAddress &&
      !(menuIsOpen && addressIsAmongKnown) &&
      !(menuIsOpen && usernameIsAmongKnown)
  );

  const isUsernameLoading = Boolean(
    inputValue &&
      !searchQueryIsAddress &&
      isUsernameFetching &&
      !usernameIsAmongKnown
  );

  const isRequiredError =
    isInvalid &&
    !isUsernameError &&
    !isUsernameFetching &&
    !isUsernameDebouncing &&
    !isAddressError &&
    !searchMatchesOption &&
    !inputValue;

  const isReceiverDropdownOpened =
    inputValue && searchMatchesOption && menuIsOpen;

  return {
    isAddressError,
    isUsernameError,
    isRequiredError,
    isUsernameLoading,
    usernameAccounts,
    isReceiverDropdownOpened,
    foundReceiver
  };
};
