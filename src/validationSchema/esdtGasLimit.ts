import BigNumber from 'bignumber.js';
import { tokenGasLimit } from 'config';
import { string } from 'yup';
import { ValidationSchemaType } from 'logic/types';
import { validateGasLimitAmount } from 'logic/validation';
import { sharedGaslimit } from 'logic/validationSchema/sharedGaslimit';

export const esdtGasLimit = ({
  ignoreTokenBalance,
  chainId,
  balance
}: ValidationSchemaType) => {
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
    function funds(value) {
      const { data, gasPrice } = this.parent;
      if (value && !ignoreTokenBalance) {
        const valid = validateGasLimitAmount({
          amount: '0',
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

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default esdtGasLimit;
