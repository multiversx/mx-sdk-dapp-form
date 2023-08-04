import { addressIsValid } from '@multiversx/sdk-dapp/utils';

import { useFormikContext } from 'formik';
import { KnowAddressType } from 'contexts';
import { useUsernameAccount } from 'contexts/ReceiverUsernameContext/hooks';
import useDebounce from 'hooks/useFetchGasLimit/useDebounce';
import { ExtendedValuesType } from 'types';
import { useReceiverError } from '../useReceiverError';
import { getIsValueAmongKnown, isAnyOptionFound } from './helpers';

export interface UseReceiverDisplayStatesType {
  inputValue: string;
  knownAddresses: KnowAddressType[] | null;
  menuIsOpen: boolean;
}

const MS_100 = process.env.NODE_ENV !== 'test' ? 1000 : 1;

export const useReceiverDisplayStates = ({
  inputValue,
  knownAddresses,
  menuIsOpen
}: UseReceiverDisplayStatesType) => {
  const searchQueryIsAddress = inputValue.startsWith('erd1');
  const debouncedUsername = useDebounce(inputValue, MS_100);
  const { isInvalid } = useReceiverError();
  const {
    values: { nft }
  } = useFormikContext<ExtendedValuesType>();

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

  const isNftError = nft ? isInvalid : false;

  return {
    isAddressError: isAddressError || isNftError,
    isUsernameError,
    isRequiredError,
    isUsernameLoading,
    usernameAccounts,
    isReceiverDropdownOpened,
    foundReceiver
  };
};
