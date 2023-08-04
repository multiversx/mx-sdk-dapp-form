import { addressIsValid } from '@multiversx/sdk-dapp/utils';

import { useFormikContext } from 'formik';
import { KnowAddressType } from 'contexts';
import { useReceiverUsernameContext } from 'contexts/ReceiverUsernameContext';
import { getIsValueAmongKnown } from 'contexts/ReceiverUsernameContext/helpers/getIsValueAmongKnown';
import { ExtendedValuesType } from 'types';
import { useReceiverError } from '../useReceiverError';
import { isAnyOptionFound } from './helpers';

export interface UseReceiverDisplayStatesType {
  inputValue: string;
  knownAddresses: KnowAddressType[] | null;
  menuIsOpen: boolean;
}

export const useReceiverDisplayStates = ({
  inputValue,
  knownAddresses,
  menuIsOpen
}: UseReceiverDisplayStatesType) => {
  const { isInvalid } = useReceiverError();
  const {
    values: { nft }
  } = useFormikContext<ExtendedValuesType>();
  const {
    showUsernameError,
    isUsernameLoading,
    isUsernameFetching,
    isUsernameDebouncing,
    usernameIsAmongKnown,
    usernameAccounts,
    searchQueryIsAddress,
    foundReceiver
  } = useReceiverUsernameContext();

  const addressIsAmongKnown = getIsValueAmongKnown({
    key: 'address',
    knownAddresses,
    inputValue
  });

  const searchMatchesOption = isAnyOptionFound({
    inputValue,
    knownAddresses
  });

  const isAddressError =
    searchQueryIsAddress &&
    (!addressIsAmongKnown || !menuIsOpen) &&
    !addressIsValid(inputValue);

  const isUsernameError = Boolean(
    showUsernameError &&
      !(menuIsOpen && addressIsAmongKnown) &&
      !(menuIsOpen && usernameIsAmongKnown)
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
