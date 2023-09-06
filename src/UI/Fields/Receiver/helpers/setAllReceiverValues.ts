import { Dispatch, SetStateAction } from 'react';
import { FormikHelpers } from 'formik';

import { KnowAddressType } from 'contexts/ReceiverContext/ReceiverContext';
import { UsernameAccountsType } from 'contexts/ReceiverUsernameContext/hooks/useFetchUsernameAddress';
import { ExtendedValuesType, ValuesEnum } from 'types';

import { GenericOptionType } from '../Receiver.types';

export interface SetAllReceiverValuesType {
  setFieldValue: FormikHelpers<ExtendedValuesType>['setFieldValue'];
  setInputValue: (value: string) => void;
  setOption: Dispatch<SetStateAction<GenericOptionType | null>>;
  options: GenericOptionType[];
  usernameAccounts: UsernameAccountsType;
  knownAddresses: KnowAddressType[];
}

export const setAllReceiverValues = ({
  options,
  usernameAccounts,
  knownAddresses,
  setFieldValue,
  setInputValue,
  setOption
}: SetAllReceiverValuesType) => {
  const setAllValuesCallback = (value: string) => {
    const optionWithUsername = options.find(
      (option) => option.value === value && option.value !== option.label
    );

    let optionLabel = optionWithUsername?.label;
    let receiverUsername: string | undefined = undefined;
    let rawReceiverUsername: string | undefined = undefined;
    const usernameAccountUsername = usernameAccounts[value]?.username;
    if (usernameAccountUsername) {
      optionLabel = usernameAccountUsername;
      receiverUsername = usernameAccountUsername;
      rawReceiverUsername = usernameAccounts[value]?.rawUsername;
    }
    const knownUsername = knownAddresses.find(
      (address) => address.address === value
    );
    if (knownUsername?.username) {
      optionLabel = knownUsername?.username;
      receiverUsername = knownUsername?.username;
      rawReceiverUsername = knownUsername?.rawUsername;
    }

    const updatedInputValue = optionLabel ?? value;

    setInputValue(updatedInputValue);
    setOption({ value, label: updatedInputValue });

    setFieldValue(
      ValuesEnum.receiver,
      usernameAccounts[value]?.address ?? value
    );

    setFieldValue(ValuesEnum.receiverUsername, receiverUsername);
    setFieldValue(ValuesEnum.rawReceiverUsername, rawReceiverUsername);
  };

  return setAllValuesCallback;
};
