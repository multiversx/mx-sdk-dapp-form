import { useFormikContext } from 'formik';

import { useReceiverContext } from 'contexts';
import { useReceiverUsernameContext } from 'contexts/ReceiverUsernameContext';
import { getIsValueAmongKnown } from 'contexts/ReceiverUsernameContext/helpers/getIsValueAmongKnown';
import { addressIsValid } from 'helpers';
import { ExtendedValuesType } from 'types';
import { useReceiverError } from '../useReceiverError';
import { isAnyOptionFound } from './helpers';

export interface UseReceiverDisplayStatesType {
  menuIsOpen: boolean;
}

export const useReceiverDisplayStates = ({
  menuIsOpen
}: UseReceiverDisplayStatesType) => {
  const { isInvalid } = useReceiverError();
  const {
    values: { nft }
  } = useFormikContext<ExtendedValuesType>();
  const {
    showUsernameError,
    isUsernameLoading,
    isUsernameDebouncing,
    usernameIsAmongKnown,
    searchQueryIsAddress
  } = useReceiverUsernameContext();
  const { receiverInputValue: inputValue, knownAddresses } =
    useReceiverContext();

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
    !isUsernameLoading &&
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
    isReceiverDropdownOpened
  };
};
