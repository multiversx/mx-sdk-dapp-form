import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { tokenGasLimit, ZERO } from 'constants/index';
import { ExtendedValuesType } from 'types';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGaslimit } from './sharedGaslimit';

const required = string().required('Required');

const minValue = string().test(
  'minValue',
  `Gas limit must be greater or equal to ${tokenGasLimit}`,
  function minGasValue(value: any) {
    const bNgasLimit = new BigNumber(value);
    const bNcalculatedGasLimit = new BigNumber(tokenGasLimit);
    const isValid =
      value && bNgasLimit.isGreaterThanOrEqualTo(bNcalculatedGasLimit);

    return isValid;
  }
);

const funds = string().test(
  'funds',
  'Insufficient funds',
  function fundsCheck(value) {
    const { data, gasPrice, ignoreTokenBalance, balance, chainId } = this
      .parent as ExtendedValuesType;

    if (value && !ignoreTokenBalance && balance) {
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

const validations = [...sharedGaslimit(), required, minValue, funds];

export const esdtGasLimit = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default esdtGasLimit;
