import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { TOKEN_GAS_LIMIT, ZERO } from 'constants/index';
import { ExtendedValuesType } from 'types';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';
import { sharedGaslimit } from './sharedGaslimit';

const required = string().required('Required');

const minValue = string().test(
  'minValue',
  `Gas limit must be greater or equal to ${TOKEN_GAS_LIMIT}`,
  function minGasValue(value: any) {
    const parent: ExtendedValuesType = this.parent;
    const { ignoreTokenBalance } = parent;

    // allow signing with 0 gasLimit
    if (ignoreTokenBalance) {
      return true;
    }

    const bNgasLimit = new BigNumber(value);
    const bNcalculatedGasLimit = new BigNumber(TOKEN_GAS_LIMIT);
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

const validations = [...sharedGaslimit(), required, minValue, funds];

export const esdtGasLimit = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default esdtGasLimit;
