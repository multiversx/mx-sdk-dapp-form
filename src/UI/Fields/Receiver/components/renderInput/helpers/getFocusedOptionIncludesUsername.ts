import { MutableRefObject } from 'react';

import { ReceiverSelectReferenceType } from 'UI/Fields/Receiver/Receiver.types';

export const getFocusedOptionIncludesUsername = (
  receiverSelectReference: MutableRefObject<ReceiverSelectReferenceType>,
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
  const focusedOptionLabel = focusedOption.label.toLowerCase();
  const focusedOptionValue = focusedOption.value.toLowerCase();
  const labelDiffersFromValue = focusedOptionLabel !== focusedOptionValue;

  const optionIncludesUsername =
    labelDiffersFromValue &&
    focusedOptionLabel.startsWith(inputValue.toLowerCase());

  if (labelDiffersFromValue && !inputValue) {
    return true;
  }

  return optionIncludesUsername;
};
