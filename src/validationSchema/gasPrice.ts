import { DECIMALS } from '@elrondnetwork/dapp-core/constants/index';
import { maxDecimals } from '@elrondnetwork/dapp-core/utils/validation/maxDecimals';
import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import denominatedConfigGasPrice from 'operations/denominatedConfigGasPrice';

const required = string().required('Required');

const decimalsValidation = string().test(
  'denomination',
  `Maximum ${DECIMALS} decimals allowed`,
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

const validations = [required, decimalsValidation, minimum, validNumber];

export const gasPrice = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default gasPrice;
