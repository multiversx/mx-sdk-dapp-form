import { validation } from '@elrondnetwork/dapp-utils';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { maxGasLimit } from 'constants/index';

const { stringIsInteger } = validation;

export const sharedGaslimit = () => {
  const required = string().required('Required');

  const validInteger = string().test(
    'isValidInteger',
    'Invalid number',
    (value) => {
      const result = value && stringIsInteger(value);
      return Boolean(result);
    }
  );
  const maximum = string().test(
    'maximum',
    `Must be lower than ${maxGasLimit}`,
    (value) => {
      const bNgasLimit = new BigNumber(String(value));
      const bNmaxGasLimit = new BigNumber(maxGasLimit);
      const result = value && bNmaxGasLimit.comparedTo(bNgasLimit) >= 0;
      return Boolean(result);
    }
  );

  const validations = [required, validInteger, maximum];

  return validations;
};

export default sharedGaslimit;
