import { nominate } from '@elrondnetwork/dapp-core';
import { validation } from '@elrondnetwork/dapp-utils';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { EsdtValidationSchemaType, ValuesType } from 'logic/index';
import { getTokenDetails } from 'logic/operations';
import { maxDecimals } from 'logic/validation';

const { stringIsFloat } = validation;

export const esdtAmount = (props: EsdtValidationSchemaType) => {
  const { tokens, ignoreTokenBalance } = props;

  const required = string().required('Required');

  const decimals = string().test({
    name: 'denomination',
    test: function (value) {
      const parent: ValuesType = this.parent;
      const { tokenId } = parent;
      if (tokens) {
        const { tokenDenomination } = getTokenDetails({
          tokens,
          tokenId
        });
        const valid = maxDecimals(String(value), tokenDenomination);

        if (!valid) {
          return this.createError({
            message: `Maximum ${tokenDenomination} decimals allowed`,
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
    'Insufficient funds',
    function tokenFunds(tokenAmount?: string) {
      if (tokenAmount !== undefined && !ignoreTokenBalance && tokens) {
        const { tokenDenomination, tokenBalance } = getTokenDetails({
          tokens,
          tokenId: this.parent.tokenId
        });
        const nominatedAmount = nominate(
          tokenAmount.toString(),
          tokenDenomination
        );
        const bnAmount = new BigNumber(nominatedAmount);
        const bnTokenBalance = new BigNumber(tokenBalance);
        return bnTokenBalance.comparedTo(bnAmount) >= 0;
      }
      return true;
    }
  );

  const greaterThanZero = string().test(
    'greaterThanZero',
    'Cannot be zero',
    function tokenBalanceZero(tokenAmount: any) {
      if (tokenAmount !== undefined && tokens) {
        const { tokenDenomination } = getTokenDetails({
          tokens,
          tokenId: this.parent.tokenId
        });
        const nominatedAmount = nominate(
          tokenAmount.toString(),
          tokenDenomination
        );
        const bnAmount = new BigNumber(nominatedAmount);
        return bnAmount.isGreaterThan(0);
      }
      return true;
    }
  );

  const isValidNumber = string().test(
    'isValidNumber',
    'Invalid number',
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
