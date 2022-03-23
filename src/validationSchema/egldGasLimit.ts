import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { calculateGasLimit } from 'logic/operations';
import { ValuesType } from 'logic/types';
import { validateGasLimitAmount } from 'logic/validation';
import { sharedGaslimit } from 'logic/validationSchema/sharedGaslimit';

interface EgldGasLimitTypeProps {
  chainId: string;
  balance: string;
}

export const egldGasLimit = ({ chainId, balance }: EgldGasLimitTypeProps) => {
  const required = string().required('Required');

  const funds = string().test(
    'funds',
    'Insufficient funds',
    function funds(value) {
      const parent: ValuesType = this.parent;
      const { data, gasPrice, amount } = parent;
      if (amount && value !== undefined) {
        const valid = validateGasLimitAmount({
          amount,
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

  const minValueData = string().test({
    name: 'minValueData',
    test: function (value) {
      const parent: ValuesType = this.parent;
      const { data } = parent;

      const calculatedGasLimit = calculateGasLimit({
        data: data ? data.trim() : ''
      });

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

  const validations = [...sharedGaslimit(), required, funds, minValueData];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default egldGasLimit;
