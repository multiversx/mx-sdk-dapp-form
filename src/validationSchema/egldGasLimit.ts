import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import calculateGasLimit from 'operations/calculateGasLimit';
import { ExtendedValuesType } from 'types';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGaslimit } from './sharedGaslimit';

const required = string().required('Required');

const funds = string().test('funds', 'Insufficient funds', function fundsCheck(
  value
) {
  const { data, gasPrice, amount, balance, chainId, ignoreTokenBalance } = this
    .parent as ExtendedValuesType;
  // allow 0 gasLimit signing
  if (ignoreTokenBalance) {
    return true;
  }
  if (amount && stringIsFloat(amount) && value != null) {
    const valid = validateGasLimitAmount({
      amount,
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

const minValueData = string().test({
  name: 'minValueData',
  test: function(value) {
    const parent: ExtendedValuesType = this.parent;
    const { data, ignoreTokenBalance } = parent;

    // allow signing with 0 gasLimit
    if (ignoreTokenBalance) {
      return true;
    }

    const calculatedGasLimit = calculateGasLimit({
      data: data ? data.trim() : ''
    });

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

const validations = [...sharedGaslimit(), required, funds, minValueData];

export const egldGasLimit = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default egldGasLimit;
