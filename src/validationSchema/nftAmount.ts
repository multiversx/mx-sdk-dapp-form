import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';
import { stringIsFloat } from '@elrondnetwork/dapp-core/utils/validation/stringIsFloat';
import { stringIsInteger } from '@elrondnetwork/dapp-core/utils/validation/stringIsInteger';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { ZERO } from 'constants/index';
import { NftEnumType } from 'types';
import { TxTypeEnum, ExtendedValuesType } from 'types';
import maxDecimals from 'validation/maxDecimals';

const required = string().required('Required');

const metaDenomination = string().test({
  name: 'denomination',
  test: function hashSignCheck(value) {
    const { nft, txType } = this.parent as ExtendedValuesType;

    if (txType !== TxTypeEnum.MetaESDT) {
      return true;
    }

    const valid = maxDecimals(String(value), nft?.decimals);

    if (!valid) {
      return this.createError({
        message: `Maximum ${nft?.decimals} decimals allowed`,
        path: 'amount'
      });
    }

    return true;
  }
});

const balance = string().test(
  'balance',
  'Insufficient funds',
  function balanceCheck(amount: any) {
    const { txType, nft } = this.parent as ExtendedValuesType;

    if (!amount) {
      return true;
    }

    if (txType === TxTypeEnum.MetaESDT) {
      const nominatedAmount = nominate(amount, nft?.decimals);
      const bnAmount = new BigNumber(nominatedAmount);
      const bnTokenBalance = new BigNumber(nft?.balance || ZERO);
      return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
    }

    if (txType === TxTypeEnum.SemiFungibleESDT) {
      const bnAmount = new BigNumber(amount);
      const bnTokenBalance = new BigNumber(nft?.balance || ZERO);
      return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
    }

    return true;
  }
);

const isValidNumber = string().test(
  'isValidNumber',
  'Invalid number',
  function isValidNumberCheck(value) {
    const { nft } = this.parent as ExtendedValuesType;
    const isMeta = nft?.type === NftEnumType.MetaESDT;
    if (isMeta) {
      return Boolean(value && stringIsFloat(value));
    }
    return Boolean(value && stringIsInteger(value));
  }
);

const validations = [required, isValidNumber, balance, metaDenomination];

export const nftAmount = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default nftAmount;
