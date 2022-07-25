import { denomination } from '@elrondnetwork/dapp-core/constants/index';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';

import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { ExtendedValuesType } from 'types';
import maxDecimals from 'validation/maxDecimals';
import validateGasLimitAmount from 'validation/validateGasLimitAmount';

const required = string().required('Required');

const decimals = string().test(
  'denomination',
  `Maximum ${denomination} decimals allowed`,
  (value) => maxDecimals(String(value))
);

const funds = string().test('funds', 'Insufficient funds', function(amount) {
  if (amount != null) {
    const { gasLimit, data, gasPrice, balance, chainId } = this
      .parent as ExtendedValuesType;

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

const customBalance = string().test(
  'customBalance',
  'Not enough balance',
  function(amount) {
    const { validationRules } = this.parent as ExtendedValuesType;
    if (amount != null && validationRules?.customBalance) {
      const bnCustomBalance = new BigNumber(validationRules?.customBalance);
      const nominatedAmount = nominate(amount.toString());
      const valid = bnCustomBalance.isGreaterThanOrEqualTo(nominatedAmount);
      return valid;
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

const validations = [required, isValidNumber, decimals, funds, customBalance];

export const egldAmount = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default egldAmount;
