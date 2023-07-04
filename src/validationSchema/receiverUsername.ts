import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';

const validUsername = string().test(
  'addressIsValid',
  'Invalid herotag',
  function checkUsername(value) {
    const { receiver } = this.parent as ExtendedValuesType;

    const userIntendsToUseValidAddress = receiver.startsWith('erd1');

    if (userIntendsToUseValidAddress) {
      return true;
    }

    const hasUsernameAndValidReceiver = value && addressIsValid(receiver);

    return Boolean(hasUsernameAndValidReceiver);
  }
);

const validations = [validUsername];

export const receiverUsername = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default receiverUsername;
