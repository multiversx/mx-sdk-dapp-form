import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsFloat';
import { stringIsInteger } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsInteger';
import { maxDecimals } from '@multiversx/sdk-dapp/out/utils/validation/maxDecimals';
import BigNumber from 'bignumber.js';
import { string } from 'yup';

import { ZERO } from 'constants/index';
import { ExtendedValuesType, NftEnumType, TransactionTypeEnum } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';

const nftAmount = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const metaFormattedAmount = string().test({
    name: 'formatDecimals',
    test: function hashSignCheck(value) {
      const { nft, txType } = this.parent as ExtendedValuesType;

      if (txType !== TransactionTypeEnum.MetaESDT) {
        return true;
      }

      const valid = maxDecimals(String(value), nft?.decimals);

      if (!valid) {
        return this.createError({
          message: errorMessages.maxDecimalsAllowed(nft?.decimals),
          path: 'amount'
        });
      }

      return true;
    }
  });

  const balance = string().test(
    'balance',
    errorMessages.insufficientFunds,
    function balanceCheck(amount: any) {
      const { txType, nft } = this.parent as ExtendedValuesType;

      if (!amount) {
        return true;
      }

      if (txType === TransactionTypeEnum.MetaESDT) {
        const parsedAmount = parseAmount(amount, nft?.decimals);
        const bnAmount = new BigNumber(parsedAmount);
        const bnTokenBalance = new BigNumber(nft?.balance || ZERO);
        return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
      }

      if (txType === TransactionTypeEnum.SemiFungibleESDT) {
        const bnAmount = new BigNumber(amount);
        const bnTokenBalance = new BigNumber(nft?.balance || ZERO);
        return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
      }

      return true;
    }
  );

  const nonZero = string().test(
    'nonZero',
    errorMessages.cannotBeZero,
    function balanceCheck(amount: any) {
      const parent: ExtendedValuesType = this.parent;
      const { ignoreTokenBalance } = parent;

      if (!amount || ignoreTokenBalance) {
        return true;
      }

      const isZero = new BigNumber(amount).isZero();

      return !isZero;
    }
  );

  const isValidNumber = string().test(
    'isValidNumber',
    errorMessages.invalidNumber,
    function isValidNumberCheck(value) {
      const { nft } = this.parent as ExtendedValuesType;
      const isMeta = nft?.type === NftEnumType.MetaESDT;
      if (isMeta) {
        return Boolean(value && stringIsFloat(value));
      }
      return Boolean(value && stringIsInteger(value));
    }
  );

  const validations = [
    required,
    isValidNumber,
    balance,
    metaFormattedAmount,
    nonZero
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};
export default nftAmount;
