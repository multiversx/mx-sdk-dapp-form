import { denomination } from '@elrondnetwork/dapp-core/constants/index';
import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import denominatedConfigGasPrice from 'operations/denominatedConfigGasPrice';
import { ValuesEnum } from 'types';
import { getCustomValidationRules } from 'validation/getCustomValidationRules';
import maxDecimals from 'validation/maxDecimals';

const required = string().required('Required');

const decimalsValidation = string().test(
  'denomination',
  `Maximum ${denomination} decimals allowed`,
  (value) => maxDecimals(String(value))
);
const minimum = string().test(
  'minimum',
  `Must be higher than ${denominatedConfigGasPrice}`,
  (value) => {
    const bNgasPrice = new BigNumber(String(value));
    const bNdenominatedConfigGasPrice = new BigNumber(
      denominatedConfigGasPrice
    );
    const result =
      value && bNgasPrice.comparedTo(bNdenominatedConfigGasPrice) >= 0;
    return Boolean(result);
  }
);
const validNumber = string().test('isValidNumber', 'Invalid number', (value) =>
  Boolean(value && stringIsFloat(value))
);

const validations = [
  required,
  decimalsValidation,
  minimum,
  validNumber,
  getCustomValidationRules(ValuesEnum.gasPrice)
];

export const gasPrice = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default gasPrice;
