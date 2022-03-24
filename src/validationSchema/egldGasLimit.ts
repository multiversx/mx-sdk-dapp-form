import BigNumber from 'bignumber.js';
import { string } from 'yup';
import calculateGasLimit from 'operations/calculateGasLimit';
import { ExtendedValuesType } from 'types';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGaslimit } from './sharedGaslimit';

const required = string().required('Required');

const funds = string().test(
  'funds',
  'Insufficient funds',
  function fundsCheck(value) {
    const { data, gasPrice, amount, balance, chainId } = this
      .parent as ExtendedValuesType;
    if (amount && value !== undefined) {
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
  }
);

const minValueData = string().test({
  name: 'minValueData',
  test: function (value) {
    const parent: ExtendedValuesType = this.parent;
    const { data } = parent;

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
