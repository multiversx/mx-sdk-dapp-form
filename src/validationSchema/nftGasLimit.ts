import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { ZERO } from 'constants/index';
import { calculateNftGasLimit } from 'operations/calculateNftGasLimit';
import { getGuardedAccountGasLimit } from 'operations/getGuardedAccountGasLimit';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGasLimit } from './sharedGasLimit';

const required = string().required('Required');

const nftGasLimit = (errorMessages: ValidationErrorMessagesType) => {
  const minValueData = string().test({
    name: 'minValueData',
    test: function (value) {
      const parent: ExtendedValuesType = this.parent;
      const { data, ignoreTokenBalance, isGuarded } = parent;

      // allow signing with 0 gasLimit
      if (ignoreTokenBalance) {
        return true;
      }

      const calculatedGasLimit = calculateNftGasLimit(data ? data.trim() : '');

      if (value) {
        const bNgasLimit = new BigNumber(value);
        const bNcalculatedGasLimit = new BigNumber(calculatedGasLimit).plus(
          getGuardedAccountGasLimit(isGuarded)
        );
        const valid =
          value && bNgasLimit.isGreaterThanOrEqualTo(bNcalculatedGasLimit);

        if (!valid) {
          return this.createError({
            message: errorMessages.tooLowGasLimit(calculatedGasLimit),
            path: 'gasLimit'
          });
        }
      }

      return true;
    }
  });

  const funds = string().test(
    'funds',
    errorMessages.insufficientFunds,
    function funds(value) {
      const { data, gasPrice, balance, chainId, ignoreTokenBalance } = this
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
    required,
    minValueData,
    funds,
    ...sharedGasLimit(errorMessages)
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};
export default nftGasLimit;
