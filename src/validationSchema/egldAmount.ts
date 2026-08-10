import { maxDecimals } from '@multiversx/sdk-dapp/out/utils/validation/maxDecimals';
import { DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants/index';
import { stringIsFloat } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsFloat';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import { validateGasLimitAmount } from 'validation/validateGasLimitAmount';
import { concatValidations } from './concatValidations';

const egldAmount = (errorMessages: ValidationErrorMessagesType) => {
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
        const {
          gasLimit,
          data,
          gasPrice,
          balance,
          chainId,
          ignoreTokenBalance
        } = this.parent as ExtendedValuesType;

        if (ignoreTokenBalance) {
          return true;
        }

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

  return concatValidations(
    [isValidNumber, decimals, funds],
    errorMessages.required
  );
};

export default egldAmount;
