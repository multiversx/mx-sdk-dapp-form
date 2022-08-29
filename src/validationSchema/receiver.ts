import { addressIsValid } from '@elrondnetwork/dapp-core/utils/account/addressIsValid';
import { string } from 'yup';
import { TransactionTypeEnum, ExtendedValuesType } from 'types';

const required = string().required('Required');

const validAddress = string().test(
  'addressIsValid',
  'Invalid address',
  (value) => Boolean(value && addressIsValid(value))
);

const sameAddress = string().test(
  'sameAddress',
  'Same as owner address',
  function sameAddressCheck(value) {
    const { ignoreTokenBalance, txType, readonly, address } = this
      .parent as ExtendedValuesType;
    const isNftTransaction = ![
      TransactionTypeEnum.EGLD,
      TransactionTypeEnum.ESDT
    ].includes(txType);
    const signContext = ignoreTokenBalance;
    if (isNftTransaction && !signContext && !readonly) {
      return address !== value;
    }
    return true;
  }
);

const validations = [required, validAddress, sameAddress];

export const receiver = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default receiver;
