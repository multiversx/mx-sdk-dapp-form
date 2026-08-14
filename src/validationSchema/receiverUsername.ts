import { addressIsValid } from '@multiversx/sdk-dapp/out/utils/validation/addressIsValid';
import { string } from 'yup';
import { getStartsWithHrp } from 'helpers/misc';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import { concatValidations } from './concatValidations';

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

  return concatValidations([validUsername]);
};

export default receiverUsername;
