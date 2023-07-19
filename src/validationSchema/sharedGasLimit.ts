import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { MAX_GAS_LIMIT } from 'constants/index';
import { ValidationErrorMessagesType } from 'types/validation';

export const sharedGasLimit = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const validInteger = string().test(
    'isValidInteger',
    errorMessages.invalidNumber,
    (value) => {
      const result = value && stringIsInteger(value);
      return Boolean(result);
    }
  );
  const maximum = string().test(
    'maximum',
    errorMessages.tooHighGasLimit(MAX_GAS_LIMIT),
    (value) => {
      const bNgasLimit = new BigNumber(String(value));
      const bNmaxGasLimit = new BigNumber(MAX_GAS_LIMIT);
      const result = value && bNmaxGasLimit.comparedTo(bNgasLimit) >= 0;
      return Boolean(result);
    }
  );

  return [required, validInteger, maximum];
};
