import { Address } from '@multiversx/sdk-core/out';
import { useFormikContext } from 'formik';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType } from 'types';

export const useReceiverError = () => {
  const {
    receiverInfo: { receiverError, isReceiverInvalid },
    receiverUsernameInfo: {
      receiverUsernameError,
      isReceiverUsernameInvalid,
      receiverUsername
    }
  } = useSendFormContext();
  const {
    touched: { receiver: receiverTouched }
  } = useFormikContext<ExtendedValuesType>();

  const isInvalid =
    (isReceiverInvalid && receiverTouched) || isReceiverUsernameInvalid;

  let userIntendsToUseValidAddress = false;
  try {
    Address.newFromBech32(receiverUsername || '');
    userIntendsToUseValidAddress = true;
  } catch (error) {
    console.error(error);
  }

  if (userIntendsToUseValidAddress) {
    return {
      isInvalid: isReceiverInvalid,
      receiverErrorDataTestId: 'receiverError',
      error: receiverError
    };
  }

  const receiverErrorDataTestId = isReceiverUsernameInvalid
    ? 'receiverUsernameError'
    : 'receiverError';

  const error = isReceiverUsernameInvalid
    ? receiverUsernameError
    : receiverError;

  return {
    isInvalid,
    receiverErrorDataTestId,
    error
  };
};
