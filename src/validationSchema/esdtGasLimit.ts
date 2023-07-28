import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { getGuardedAccountGasLimit } from 'operations';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGasLimit } from './sharedGasLimit';

const esdtGasLimit = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const minValue = string().test(
    'minValue',
    errorMessages.tooLowGasLimit(TOKEN_GAS_LIMIT),
    function minGasValue(value: any) {
      const parent: ExtendedValuesType = this.parent;
      const { ignoreTokenBalance, isGuarded } = parent;

      // allow signing with 0 gasLimit
      if (ignoreTokenBalance) {
        return true;
      }

      const bNgasLimit = new BigNumber(value);
      const bNcalculatedGasLimit = new BigNumber(TOKEN_GAS_LIMIT).plus(
        getGuardedAccountGasLimit(isGuarded)
      );
      const isValid =
        value && bNgasLimit.isGreaterThanOrEqualTo(bNcalculatedGasLimit);

      return isValid;
    }
  );

  const funds = string().test(
    'funds',
    errorMessages.insufficientFunds,
    function fundsCheck(value) {
      const { data, gasPrice, ignoreTokenBalance, balance, chainId } = this
        .parent as ExtendedValuesType;
      if (value && !ignoreTokenBalance) {
        const valid = validateGasLimitAmount({
          amount: ZERO,
          balance,
          gasLimit: value,
          gasPrice,
          data,
          chainId
        });
        return valid;
      }
      return true;
    }
  );

  const validations = [
    ...sharedGasLimit(errorMessages),
    required,
    minValue,
    funds
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default esdtGasLimit;
