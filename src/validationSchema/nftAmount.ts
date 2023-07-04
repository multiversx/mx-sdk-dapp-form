import { maxDecimals } from '@multiversx/sdk-dapp/utils/validation/maxDecimals';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { ZERO } from 'constants/index';
import { parseAmount } from 'helpers';
import { ExtendedValuesType, NftEnumType, TransactionTypeEnum } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';

const required = string().required('Required');

const nftAmount = (errorMessages: ValidationErrorMessagesType) => {
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
