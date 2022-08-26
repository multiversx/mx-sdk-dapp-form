import { stringIsInteger } from '@elrondnetwork/dapp-core/utils/validation/stringIsInteger';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { MAX_GAS_LIMIT } from 'constants/index';

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
    `Must be lower than ${MAX_GAS_LIMIT}`,
    (value) => {
      const bNgasLimit = new BigNumber(String(value));
      const bNmaxGasLimit = new BigNumber(MAX_GAS_LIMIT);
      const result = value && bNmaxGasLimit.comparedTo(bNgasLimit) >= 0;
      return Boolean(result);
    }
  );

  const validations = [required, validInteger, maximum];

  return validations;
};

export default sharedGaslimit;
