import { Dispatch, SetStateAction } from 'react';
import { InputActionMeta } from 'react-select';

import { GenericOptionType } from '../Receiver.types';

export interface OnReceiverInputChangeType {
  setOption: Dispatch<SetStateAction<GenericOptionType | null>>;
  setAllValues: (value: string) => void;
}

export const onReceiverInputChange = ({
  setOption,
  setAllValues
}: OnReceiverInputChangeType) => {
  const onInputChangeCallback = (inputValue: string, meta: InputActionMeta) => {
    const isActionBlurOrMenuClose = ['input-blur', 'menu-close'].includes(
      meta.action
    );

    if (isActionBlurOrMenuClose) {
      return;
    }

    setAllValues(inputValue);

    if (!inputValue) {
      setOption(null);
    }
  };

  return onInputChangeCallback;
};
