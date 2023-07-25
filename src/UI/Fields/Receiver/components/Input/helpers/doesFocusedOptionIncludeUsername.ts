import { MutableRefObject } from 'react';

import { ReceiverSelectReferenceType } from 'UI/Fields/Receiver/Receiver.types';

export const doesFocusedOptionIncludeUsername = (
  receiverSelectReference: MutableRefObject<null>,
  inputValue: string
) => {
  const currentReceiverSelectReference =
    receiverSelectReference.current as ReceiverSelectReferenceType;

  if (!currentReceiverSelectReference) {
    return false;
  }

  if (!currentReceiverSelectReference.state.focusedOption) {
    return false;
  }

  const focusedOption = currentReceiverSelectReference.state.focusedOption;
  const optionHasUsername = focusedOption.label !== focusedOption.value;

  if (optionHasUsername && !inputValue) {
    return true;
  }

  return optionHasUsername && focusedOption.label.startsWith(inputValue);
};
