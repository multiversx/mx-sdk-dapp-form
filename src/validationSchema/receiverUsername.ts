import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';

export const receiverUsername = (
  errorMessages: ValidationErrorMessagesType
) => {
  const validUsername = string().test(
    'invalidHerotag',
    errorMessages.invalidHerotag,
    function checkUsername(value) {
      const { receiver } = this.parent as ExtendedValuesType;

      const userIntendsToUseValidAddress = receiver?.startsWith('erd1');
      const receiverIsEmpty = !value && !receiver;

      if (userIntendsToUseValidAddress || receiverIsEmpty) {
        return true;
      }

      const hasUsernameAndValidReceiver = value && addressIsValid(receiver);

      return Boolean(hasUsernameAndValidReceiver);
    }
  );

  const validations = [validUsername];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default receiverUsername;
