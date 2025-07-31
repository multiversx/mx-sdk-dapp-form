import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import { getStartsWithHrp } from 'helpers/misc';

export const receiverUsername = (
  errorMessages: ValidationErrorMessagesType
) => {
  const validUsername = string().test(
    'invalidHerotag',
    errorMessages.invalidHerotag,
    function checkUsername(value) {
      const { receiver } = this.parent as ExtendedValuesType;

      const userIntendsToUseValidAddress = getStartsWithHrp(receiver);

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
