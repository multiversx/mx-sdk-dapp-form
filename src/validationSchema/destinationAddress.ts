import { addressIsValid } from '@elrondnetwork/dapp-core';
import { string } from 'yup';
import { NftType } from 'types';

interface ReceiverValidationProps {
  nft?: NftType;
  ignoreTokenBalance?: boolean;
  readonly?: boolean;
  address: string;
}

export const receiver = ({
  nft,
  ignoreTokenBalance,
  readonly,
  address
}: ReceiverValidationProps) => {
  const isNftTransaction = Boolean(nft);

  const required = string().required('Required');

  const validAddress = string().test(
    'addressIsValid',
    'Invalid address',
    (value) => Boolean(value && addressIsValid(value))
  );

  const sameAddress = string().test(
    'sameAddress',
    'Same as owner address',
    (value) => {
      const signContext = ignoreTokenBalance;
      if (isNftTransaction && !signContext && !readonly) {
        return address !== value;
      }
      return true;
    }
  );

  const validations = [required, validAddress, sameAddress];

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default receiver;
