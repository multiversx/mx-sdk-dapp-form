import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { ZERO } from 'constants/index';
import { calculateNftGasLimit } from 'operations/calculateNftGasLimit';
import { ExtendedValuesType } from 'types';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGaslimit } from './sharedGaslimit';

const required = string().required('Required');

const minValueData = string().test({
  name: 'minValueData',
  test: function(value) {
    const parent: ExtendedValuesType = this.parent;
    const { data } = parent;

    const calculatedGasLimit = calculateNftGasLimit(data ? data.trim() : '');

    if (value) {
      const bNgasLimit = new BigNumber(value);
      const bNcalculatedGasLimit = new BigNumber(calculatedGasLimit);
      const valid =
        value && bNgasLimit.isGreaterThanOrEqualTo(bNcalculatedGasLimit);

      if (!valid) {
        return this.createError({
          message: `Gas limit must be greater or equal to ${calculatedGasLimit}`,
          path: 'gasLimit'
        });
      }
    }

    return true;
  }
});

const funds = string().test('funds', 'Insufficient funds', function funds(
  value
) {
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
});

const validations = [required, minValueData, funds, ...sharedGaslimit()];

export const esdtGasLimit = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default esdtGasLimit;
