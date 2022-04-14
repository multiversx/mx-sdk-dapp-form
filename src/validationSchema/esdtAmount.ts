import { nominate, stringIsFloat } from '@elrondnetwork/dapp-core';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import getTokenDetails from 'operations/getTokenDetails';
import { ExtendedValuesType } from 'types';
import maxDecimals from 'validation/maxDecimals';

const required = string().required('Required');

const decimals = string().test({
  name: 'denomination',
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
          message: `Maximum ${decimals} decimals allowed`,
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
    const { ignoreTokenBalance, tokens } = this.parent as ExtendedValuesType;
    if (tokenAmount !== undefined && !ignoreTokenBalance && tokens) {
      const { decimals, balance } = getTokenDetails({
        tokens,
        tokenId: this.parent.tokenId
      });
      const nominatedAmount = nominate(tokenAmount.toString(), decimals);
      const bnAmount = new BigNumber(nominatedAmount);
      const bnTokenBalance = new BigNumber(balance);
      return bnTokenBalance.comparedTo(bnAmount) >= 0;
    }
    return true;
  }
);

const greaterThanZero = string().test(
  'greaterThanZero',
  'Cannot be zero',
  function tokenBalanceZero(tokenAmount?: string) {
    const { tokens, ignoreTokenBalance } = this.parent as ExtendedValuesType;
    if (!ignoreTokenBalance && tokenAmount != null && tokens) {
      const { decimals } = getTokenDetails({
        tokens,
        tokenId: this.parent.tokenId
      });
      const nominatedAmount = nominate(tokenAmount.toString(), decimals);
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

export const esdtAmount = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default esdtAmount;
