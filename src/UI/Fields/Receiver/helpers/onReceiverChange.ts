import { Dispatch, SetStateAction } from 'react';
import { SingleValue } from 'react-select';

import { GenericOptionType } from '../Receiver.types';

export interface OnReceiverChangeType {
  setOption: Dispatch<SetStateAction<GenericOptionType | null>>;
  setInputValue: (value: string) => void;
  changeAndBlurInput: (value: string) => void;
}

export const onReceiverChange = ({
  setInputValue,
  setOption,
  changeAndBlurInput
}: OnReceiverChangeType) => {
  const onChangeCallback = (option: SingleValue<GenericOptionType>) => {
    if (!option) {
      return;
    }
    setOption(option);
    changeAndBlurInput(option.value);

    if (option.value !== option.label) {
      setInputValue(option.label);
    } else {
      setInputValue(option.value);
    }
  };

  return onChangeCallback;
};
