import { validation } from '@elrondnetwork/dapp-utils';
import { denomination } from 'config';
import { string } from 'yup';
import { ValidationSchemaType, ValuesType } from 'logic/types';
import { maxDecimals, validateGasLimitAmount } from 'logic/validation';

const { stringIsFloat } = validation;

export const egldAmount = (props: ValidationSchemaType) => {
  const { balance, chainId } = props;

  const required = string().required('Required');

  const decimals = string().test(
    'denomination',
    `Maximum ${denomination} decimals allowed`,
    (value) => maxDecimals(String(value))
  );

  const funds = string().test('funds', 'Insufficient funds', function (amount) {
    if (amount != null) {
      const parent: ValuesType = this.parent;
      const { gasLimit, data, gasPrice } = parent;

      const valid = validateGasLimitAmount({
        amount,
        balance,
        gasLimit,
        gasPrice,
        data,
        chainId
      });

      return valid;
    }
    return true;
  });

  const isValidNumber = string().test(
    'isValidNumber',
    'Invalid number',
    (value) => {
      return Boolean(value && stringIsFloat(value));
    }
  );

  const validations = [required, isValidNumber, decimals, funds];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default egldAmount;
