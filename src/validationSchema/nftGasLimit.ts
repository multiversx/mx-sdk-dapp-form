import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { calculateNftGasLimit } from 'logic/operations';
import { ValuesType } from 'logic/types';
import { validateGasLimitAmount } from 'logic/validation';
import { sharedGaslimit } from 'logic/validationSchema/sharedGaslimit';

interface EsdtGasLimitValidationProps {
  ignoreTokenBalance?: boolean;
  chainId: string;
  balance: string;
}

export const esdtGasLimit = ({
  ignoreTokenBalance,
  chainId,
  balance
}: EsdtGasLimitValidationProps) => {
  const required = string().required('Required');

  const minValueData = string().test({
    name: 'minValueData',
    test: function (value) {
      const parent: ValuesType = this.parent;
      const { data } = parent;

      const calculatedGasLimit = calculateNftGasLimit(data ? data.trim() : '');

      if (value) {
        const bNgasLimit = new BigNumber(value);
        const bNcalculatedGasLimit = new BigNumber(calculatedGasLimit);
        const valid =
          value && bNgasLimit.isGreaterThanOrEqualTo(bNcalculatedGasLimit);

        if (!valid) {
          return this.createError({
            message: `Gas limit must be greater or equal to ${calculatedGasLimit}`,
            path: 'gasLimit'
          });
        }
      }

      return true;
    }
  });

  const funds = string().test(
    'funds',
    'Insufficient funds',
    function funds(value) {
      const parent: ValuesType = this.parent;
      const { data, gasPrice } = parent;
      if (value && esdtGasLimit !== undefined && !ignoreTokenBalance) {
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

  const validations = [required, minValueData, funds, ...sharedGaslimit()];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default esdtGasLimit;
