import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';
import { string } from 'yup';

import { maxDecimals, stringIsFloat } from 'helpers';
import { formattedConfigGasPrice } from 'operations/formattedConfigGasPrice';
import { ValidationErrorMessagesType } from 'types/validation';

export const gasPrice = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const decimalsValidation = string().test(
    'decimalFormat',
    errorMessages.maxDecimalsAllowed(DECIMALS),
    (value) => maxDecimals(String(value))
  );
  const minimum = string().test(
    'minimum',
    errorMessages.tooLowGasPrice(formattedConfigGasPrice),
    (value) => {
      const bNgasPrice = new BigNumber(String(value));
      const bNformattedConfigGasPrice = new BigNumber(formattedConfigGasPrice);
      const result =
        value && bNgasPrice.isGreaterThanOrEqualTo(bNformattedConfigGasPrice);
      return Boolean(result);
    }
  );
  const validNumber = string().test(
    'isValidNumber',
    errorMessages.invalidNumber,
    (value) => Boolean(value && stringIsFloat(value))
  );

  const validations = [required, decimalsValidation, minimum, validNumber];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default gasPrice;
