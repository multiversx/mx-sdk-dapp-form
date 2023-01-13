import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { maxDecimals } from '@multiversx/sdk-dapp/utils/validation/maxDecimals';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { formattedConfigGasPrice } from 'operations/formattedConfigGasPrice';

const required = string().required('Required');

const decimalsValidation = string().test(
  'decimalFormat',
  `Maximum ${DECIMALS} decimals allowed`,
  (value) => maxDecimals(String(value))
);
const minimum = string().test(
  'minimum',
  `Must be higher than ${formattedConfigGasPrice}`,
  (value) => {
    const bNgasPrice = new BigNumber(String(value));
    const bNformattedConfigGasPrice = new BigNumber(formattedConfigGasPrice);
    const result =
      value && bNgasPrice.isGreaterThanOrEqualTo(bNformattedConfigGasPrice);
    return Boolean(result);
  }
);
const validNumber = string().test('isValidNumber', 'Invalid number', (value) =>
  Boolean(value && stringIsFloat(value))
);

const validations = [required, decimalsValidation, minimum, validNumber];

export const gasPrice = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default gasPrice;
