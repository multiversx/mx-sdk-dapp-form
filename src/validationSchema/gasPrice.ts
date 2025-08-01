import { DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants/index';
import { stringIsFloat } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsFloat';
import { maxDecimals } from '@multiversx/sdk-dapp/out/utils/validation/maxDecimals';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import {
  formattedConfigGasPrice,
  maxAcceptedGasPrice
} from 'operations/formattedConfigGasPrice';

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
  const maximum = string().test(
    'maximum',
    errorMessages.tooHighGasPrice(maxAcceptedGasPrice),
    (value) => {
      const bNgasPrice = new BigNumber(String(value));
      const bNmaxAcceptedGasPrice = new BigNumber(maxAcceptedGasPrice);
      const result =
        value && bNgasPrice.isLessThanOrEqualTo(bNmaxAcceptedGasPrice);
      return Boolean(result);
    }
  );
  const validNumber = string().test(
    'isValidNumber',
    errorMessages.invalidNumber,
    (value) => Boolean(value && stringIsFloat(value))
  );

  const validations = [
    required,
    decimalsValidation,
    minimum,
    maximum,
    validNumber
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default gasPrice;
