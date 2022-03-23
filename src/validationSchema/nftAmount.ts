import { nominate } from '@elrondnetwork/dapp-core';
import { validation } from '@elrondnetwork/dapp-utils';
import BigNumber from 'bignumber.js';
import { string } from 'yup';
import { NftValidationSchemaType } from 'logic/types';
import { maxDecimals } from 'logic/validation';
import { NftEnumType } from 'types';
const { stringIsFloat, stringIsInteger } = validation;

export const nftAmount = ({ nft }: NftValidationSchemaType) => {
  const isMeta = nft.type === NftEnumType.MetaESDT;
  const isSFT = nft.type === NftEnumType.SemiFungibleESDT;

  const required = string().required('Required');

  const sftBalance = string().test(
    'sftBalance',
    'Insufficient funds',
    function balance(amount) {
      if (amount !== undefined) {
        const bnAmount = new BigNumber(amount);
        const bnTokenBalance = new BigNumber(nft?.balance || '0');
        return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
      }
      return true;
    }
  );

  const metaDenomination = string().test(
    'denomination',
    `Maximum ${nft?.decimals} decimals allowed`,
    (value) => {
      return maxDecimals(String(value), nft?.decimals);
    }
  );
  const metaBalance = string().test(
    'metaBalance',
    'Insufficient funds',
    function balance(metaAmount: any) {
      if (metaAmount !== undefined) {
        const nominatedAmount = nominate(metaAmount, nft?.decimals);
        const bnAmount = new BigNumber(nominatedAmount);
        const bnTokenBalance = new BigNumber(nft?.balance || '0');
        return bnTokenBalance.isGreaterThanOrEqualTo(bnAmount);
      }
      return true;
    }
  );

  const isValidNumber = string().test(
    'isValidNumber',
    'Invalid number',
    (value) => {
      if (isMeta) {
        return Boolean(value && stringIsFloat(value));
      }
      return Boolean(value && stringIsInteger(value));
    }
  );

  const validations = [
    required,
    isValidNumber,
    ...(isMeta ? [metaBalance, metaDenomination] : []),
    ...(isSFT ? [sftBalance] : [])
  ];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default nftAmount;
