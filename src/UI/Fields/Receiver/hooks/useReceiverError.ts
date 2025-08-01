import { useFormikContext } from 'formik';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { ExtendedValuesType } from 'types';
import { getStartsWithHrp } from 'helpers/misc';

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

  if (getStartsWithHrp(receiverUsername)) {
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
