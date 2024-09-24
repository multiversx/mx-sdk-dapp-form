import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { parseAmount, maxDecimals, stringIsFloat } from 'helpers';
import getTokenDetails from 'operations/getTokenDetails';
import { ExtendedValuesType } from 'types';
import { ValidationErrorMessagesType } from '../types/validation';

const esdtAmount = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const decimals = string().test({
    name: 'decimalFormat',
    test: function (value) {
      const { tokenId, tokens } = this.parent as ExtendedValuesType;
      if (tokens) {
        const { decimals } = getTokenDetails({
          tokens,
          tokenId
        });

        const valid = maxDecimals(String(value), decimals);

        if (!valid) {
          return this.createError({
            message: errorMessages.maxDecimalsAllowed(decimals),
            path: 'amount'
          });
        }

        return true;
      }
      return true;
    }
  });

  const balance = string().test(
    'tokenBalance',
    errorMessages.insufficientFunds,
    function tokenFunds(tokenAmount?: string) {
      const { ignoreTokenBalance, tokens } = this.parent as ExtendedValuesType;
      if (tokenAmount !== undefined && !ignoreTokenBalance && tokens) {
        const { decimals, balance: tokenBalance } = getTokenDetails({
          tokens,
          tokenId: this.parent.tokenId
        });

        const parsedAmount = parseAmount(tokenAmount.toString(), decimals);
        const bnAmount = new BigNumber(parsedAmount);
        const bnTokenBalance = new BigNumber(tokenBalance);
        return bnTokenBalance.comparedTo(bnAmount) >= 0;
      }
      return true;
    }
  );

  const greaterThanZero = string().test(
    'greaterThanZero',
    errorMessages.cannotBeZero,
    function tokenBalanceZero(tokenAmount?: string) {
      const { tokens, ignoreTokenBalance } = this.parent as ExtendedValuesType;
      if (!ignoreTokenBalance && tokenAmount != null && tokens) {
        const { decimals } = getTokenDetails({
          tokens,
          tokenId: this.parent.tokenId
        });
        const parsedAmount = parseAmount(tokenAmount.toString(), decimals);
        const bnAmount = new BigNumber(parsedAmount);
        return bnAmount.isGreaterThan(0);
      }
      return true;
    }
  );

  const isValidNumber = string().test(
    'isValidNumber',
    errorMessages.invalidNumber,
    (value) => {
      return Boolean(value && stringIsFloat(value));
    }
  );

  const validations = [
    required,
    decimals,
    balance,
    greaterThanZero,
    isValidNumber
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default esdtAmount;
