import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { string } from 'yup';
import { ExtendedValuesType, TransactionTypeEnum } from 'types';
import { ValidationErrorMessagesType } from 'types/validation';

export const receiver = (errorMessages: ValidationErrorMessagesType) => {
  const required = string().required(errorMessages.required);

  const validAddress = string().test(
    'addressIsValid',
    errorMessages.invalidAddress,
    (value) => Boolean(value && addressIsValid(value))
  );

  const sameAddress = string().test(
    'sameAddress',
    errorMessages.sameAsOwnerAddress,
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
    errorMessages.receiverNotAllowed,
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

  return validations.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue),
    string()
  );
};

export default receiver;
