import { useFormikContext } from 'formik';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType } from 'types';

export const useReceiverError = () => {
  const {
    receiverInfo: { receiverError, isReceiverInvalid },
    receiverUsernameInfo: { receiverUsernameError, isReceiverUsernameInvalid }
  } = useSendFormContext();
  const {
    touched: { receiver: receiverTouched }
  } = useFormikContext<ExtendedValuesType>();

  const isInvalid =
    (isReceiverInvalid && receiverTouched) || isReceiverUsernameInvalid;

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
