import { Dispatch, SetStateAction } from 'react';
import { trimUsernameDomain } from '@multiversx/sdk-dapp/hooks/account/helpers/trimUsernameDomain';
import { FormikHelpers } from 'formik';

import { UsernameAccountsType } from 'contexts/ReceiverUsernameContext/hooks/useFetchUsernameAddress';
import { ExtendedValuesType, ValuesEnum } from 'types';

import { GenericOptionType } from '../Receiver.types';

export interface SetAllReceiverValuesType {
  setFieldValue: FormikHelpers<ExtendedValuesType>['setFieldValue'];
  setInputValue: (value: string) => void;
  setOption: Dispatch<SetStateAction<GenericOptionType | null>>;
  options: GenericOptionType[];
  usernameAccounts: UsernameAccountsType;
}

export const setAllReceiverValues = ({
  options,
  usernameAccounts,
  setFieldValue,
  setInputValue,
  setOption
}: SetAllReceiverValuesType) => {
  const setAllValuesCallback = (value: string) => {
    const optionWithUsername = options.find((option) => option.value === value);
    const optionLabel = usernameAccounts[value]?.username
      ? String(trimUsernameDomain(usernameAccounts[value]?.username))
      : optionWithUsername?.label;

    const updatedInputValue = optionLabel ?? value;

    setInputValue(updatedInputValue);
    setOption({ value, label: updatedInputValue });

    setFieldValue(
      ValuesEnum.receiver,
      usernameAccounts[value]?.address ?? value
    );

    // TODO: check here
    console.log(
      '\x1b[42m%s\x1b[0m',
      13,
      usernameAccounts[value]?.username,
      usernameAccounts[value]?.address,
      value
    );

    setFieldValue(
      ValuesEnum.receiverUsername,
      usernameAccounts[value]?.username
    );
  };

  return setAllValuesCallback;
};
