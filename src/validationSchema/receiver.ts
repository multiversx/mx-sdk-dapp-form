import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
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

const canTransfer = string().test(
  'canTransfer',
  'Receiver not allowed',
  function allowedReceivers(value) {
    const { nft, txType, ignoreTokenBalance, address } = this
      .parent as ExtendedValuesType;
    const isMetaEsdtTransaction = TransactionTypeEnum.MetaESDT === txType;
    const signContext = ignoreTokenBalance;
    const allowedReceivers = nft?.allowedReceivers;

    if (!value || !isMetaEsdtTransaction || signContext) {
      return true;
    }

    // collection is not restricted or user has colleciton send role
    if (allowedReceivers == null || allowedReceivers.includes(address)) {
      return true;
    }

    const isReceiverNotAllwed = !allowedReceivers.includes(value);

    if (isReceiverNotAllwed) {
      return false;
    }

    return true;
  }
);

const validations = [required, validAddress, sameAddress, canTransfer];

export const receiver = validations.reduce(
  (previousValue, currentValue) => previousValue.concat(currentValue),
  string()
);

export default receiver;
