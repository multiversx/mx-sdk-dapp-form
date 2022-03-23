import { validation } from '@elrondnetwork/dapp-utils';
import BigNumber from 'bignumber.js';
import { denomination } from 'config';
import { string } from 'yup';
import { denominatedConfigGasPrice } from 'logic/operations';
import { maxDecimals } from 'logic/validation';
const { stringIsFloat } = validation;

export const gasPrice = () => {
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
  const validNumber = string().test(
    'isValidNumber',
    'Invalid number',
    (value) => Boolean(value && stringIsFloat(value))
  );

  const validations = [required, decimalsValidation, minimum, validNumber];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default gasPrice;
