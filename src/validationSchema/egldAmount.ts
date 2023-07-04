import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { maxDecimals } from '@multiversx/sdk-dapp/utils/validation/maxDecimals';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';

const egldAmount = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);
  const decimals = string().test(
    'decimalFormat',
    errorMessages.maxDecimalsAllowed(DECIMALS),
    (value) => maxDecimals(String(value))
  );

  const funds = string().test(
    'funds',
    errorMessages.insufficientFunds,
    function (amount) {
      if (amount && stringIsFloat(amount)) {
        const { gasLimit, data, gasPrice, balance, chainId } = this
          .parent as ExtendedValuesType;

        const valid = validateGasLimitAmount({
          amount,
          balance,
          gasLimit,
          gasPrice,
          data,
          chainId
        });

        return valid;
      }
      return true;
    }
  );

  const isValidNumber = string().test(
    'isValidNumber',
    errorMessages.invalidNumber,
    (value) => {
      return Boolean(value && stringIsFloat(value));
    }
  );

  const validations = [required, isValidNumber, decimals, funds];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default egldAmount;
